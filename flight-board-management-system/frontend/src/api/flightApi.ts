import axios from 'axios';
import { Flight, FlightFilter } from '../models/Flight';

const API_BASE_URL = 'https://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllFlights = async (): Promise<Flight[]> => {
    const response = await api.get('/flights');
    return response.data;
};

export const getFilteredFlights = async (filter: FlightFilter): Promise<Flight[]> => {
    const params = new URLSearchParams();
    if (filter.status) params.append('status', filter.status);
    if (filter.destination) params.append('destination', filter.destination);
    
    const response = await api.get(`/flights?${params.toString()}`);
    return response.data;
};

export const addFlight = async (flight: Omit<Flight, 'id'>): Promise<Flight> => {
    const response = await api.post('/flights', flight);
    return response.data;
};

export const deleteFlight = async (id: number): Promise<void> => {
    await api.delete(`/flights/${id}`);
};