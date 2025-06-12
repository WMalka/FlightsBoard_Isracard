import { useState, useEffect, useCallback, useRef } from 'react';
import { Flight, FlightFilter } from '../models/Flight';
import { getAllFlights, getFilteredFlights, deleteFlight } from '../api/flightApi';
import { signalRService } from '../services/signalRService';
import { calculateFlightStatus } from '../utils/statusCalculator';
import { debounce } from '../utils/debounce';

interface UseFlightsReturn {
    flights: Flight[];
    loading: boolean;
    error: string | null;
    refreshFlights: (filter?: FlightFilter) => Promise<void>;
    handleDeleteFlight: (id: number) => Promise<void>;
}

export const useFlights = (): UseFlightsReturn => {
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<FlightFilter>({});
    const isUpdatingRef = useRef(false);
    const lastStatusUpdateRef = useRef<Date>(new Date());    // Move the time constant outside to avoid recreating it
    const UPDATE_INTERVAL = 120000; // 2 minutes in milliseconds

    const shouldUpdateFlightStatus = useCallback(() => {
        const now = new Date();
        const timeSinceLastUpdate = now.getTime() - lastStatusUpdateRef.current.getTime();
        return timeSinceLastUpdate >= UPDATE_INTERVAL;
    }, []);

    const updateFlightStatuses = useCallback((force: boolean = false) => {
        console.log(`[Status Update] Attempting update - force: ${force}, isUpdating: ${isUpdatingRef.current}`);
        if (isUpdatingRef.current || (!force && !shouldUpdateFlightStatus())) return;

        isUpdatingRef.current = true;
        setFlights(currentFlights => {
            const now = new Date();
            let hasChanges = false;
            
            const updatedFlights = currentFlights.map(flight => {
                const newStatus = calculateFlightStatus(new Date(flight.departureTime));
                if (newStatus !== flight.status) {
                    hasChanges = true;
                    console.log(`[Status Update] Flight ${flight.id} status changed from ${flight.status} to ${newStatus}`);
                    return { ...flight, status: newStatus };
                }
                return flight;
            });

            if (hasChanges || force) {
                console.log(`[Status Update] Changes detected: ${hasChanges}, force: ${force}`);
                lastStatusUpdateRef.current = now;
            }
            isUpdatingRef.current = false;
            return hasChanges ? updatedFlights : currentFlights;
        });
    }, [shouldUpdateFlightStatus]);

    const debouncedUpdateStatus = useCallback(
        debounce(updateFlightStatuses, 1000),
        [updateFlightStatuses]
    );    const refreshFlights = useCallback(async (filter?: FlightFilter) => {
        if (isUpdatingRef.current) return;
        
        // Store current filter values in refs to avoid dependency on currentFilter
        const currentStatus = currentFilter.status;
        const currentDestination = currentFilter.destination;
        
        if (filter && 
            filter.status === currentStatus && 
            filter.destination === currentDestination) {
            return;
        }
        
        try {
            isUpdatingRef.current = true;
            setLoading(true);
            
            const data = filter ? 
                await getFilteredFlights(filter) : 
                await getAllFlights();

            const updatedFlights = data.map(flight => ({
                ...flight,
                departureTime: new Date(flight.departureTime),
                status: calculateFlightStatus(new Date(flight.departureTime))
            }));

            setFlights(updatedFlights);
            setCurrentFilter(filter || {});
            setError(null);
        } catch (err) {
            setError('Failed to fetch flights');
            console.error('Error fetching flights:', err);
        } finally {
            setLoading(false);
            isUpdatingRef.current = false;
        }
    }, []); // Remove currentFilter dependency

    const handleDeleteFlight = useCallback(async (id: number) => {
        try {
            await deleteFlight(id);
            setFlights(prev => prev.filter(flight => flight.id !== id));
        } catch (err) {
            setError('Failed to delete flight');
            console.error('Error deleting flight:', err);
        }
    }, []);    // Keep SignalR connection reference
    const signalRConnectionRef = useRef<boolean>(false);    // Initialize connection once
    useEffect(() => {
        const initConnection = async () => {
            try {
                if (!signalRConnectionRef.current) {
                    await signalRService.startConnection();
                    signalRConnectionRef.current = true;
                    console.log('SignalR connection established');
                }
            } catch (error) {
                console.error('Failed to establish SignalR connection:', error);
                // Try to reconnect after a delay
                setTimeout(initConnection, 5000);
            }
        };

        initConnection();

        return () => {
            signalRConnectionRef.current = false;
            signalRService.stopConnection();
        };
    }, []); // Empty dependency array - only run once

    // Handle SignalR events separately from connection
    useEffect(() => {
        // Only set up listeners if we have a connection
        if (!signalRConnectionRef.current) return;

        const cleanupFns: (() => void)[] = [];        const handleFlightAdded = (newFlightData: Flight) => {
            console.log('Received new flight via SignalR:', newFlightData);
            if (!isUpdatingRef.current) {
                setFlights(prev => {
                    // Check if flight already exists
                    if (prev.some(f => f.id === newFlightData.id)) {
                        console.log('Flight already exists, skipping add');
                        return prev;
                    }

                    // Process the new flight
                    const processedFlight = {
                        ...newFlightData,
                        departureTime: new Date(newFlightData.departureTime),
                        status: calculateFlightStatus(new Date(newFlightData.departureTime))
                    };

                    console.log('Adding new flight to board:', processedFlight);
                    return [...prev, processedFlight];
                });
            }
        };

        const handleStatusChanged = (updatedFlight: Flight) => {
            if (!isUpdatingRef.current && shouldUpdateFlightStatus()) {
                setFlights(prev => {
                    const existingFlight = prev.find(f => f.id === updatedFlight.id);
                    if (!existingFlight) return prev;
                    
                    return prev.map(flight => 
                        flight.id === updatedFlight.id 
                            ? {
                                ...updatedFlight,
                                status: calculateFlightStatus(updatedFlight.departureTime)
                            } 
                            : flight
                    );
                });
                lastStatusUpdateRef.current = new Date();
            }
        };        console.log('Setting up SignalR event handlers');
        // Set up all event handlers
        cleanupFns.push(
            signalRService.onFlightAdded(handleFlightAdded),
            signalRService.onFlightDeleted((id) => {
                console.log('Flight deleted:', id);
                setFlights(prev => prev.filter(f => f.id !== id));
            }),
            signalRService.onFlightStatusChanged(handleStatusChanged)
        );

        // Clean up event listeners only
        return () => {
            cleanupFns.forEach(cleanup => cleanup());
        };
    }, [shouldUpdateFlightStatus]); // Only depend on shouldUpdateFlightStatus

    // Handle periodic updates separately
    useEffect(() => {
        // Initial data load
        refreshFlights();

        const intervalId = setInterval(() => {
            if (!isUpdatingRef.current && shouldUpdateFlightStatus()) {
                updateFlightStatuses();
            }
        }, UPDATE_INTERVAL);

        return () => {
            clearInterval(intervalId);
        };
    }, [refreshFlights, shouldUpdateFlightStatus, updateFlightStatuses]);

    // Handle cleanup on unmount
    useEffect(() => {
        return () => {
            if (signalRConnectionRef.current) {
                signalRService.stopConnection();
            }
        };
    }, []);

    return {
        flights,
        loading,
        error,
        refreshFlights,
        handleDeleteFlight
    };
};