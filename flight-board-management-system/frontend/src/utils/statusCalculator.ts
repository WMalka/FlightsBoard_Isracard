import { FlightStatus } from '../models/Flight';

export const calculateFlightStatus = (departureTime: Date): FlightStatus => {
    const now = new Date();
    const diff = (departureTime.getTime() - now.getTime()) / 60000; // difference in minutes
    
    if (diff > 30) return 'Scheduled';
    if (diff > 10) return 'Boarding';
    if (diff >= -60) return 'Departed';
    if (diff < -60) return 'Landed';
    if (diff < -15) return 'Delayed';
    return 'Scheduled';
};
