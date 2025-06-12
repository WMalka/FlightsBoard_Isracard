export type FlightStatus = 'Scheduled' | 'Boarding' | 'Departed' | 'Landed' | 'Delayed'; 

export interface Flight {
    id: number;
    flightNumber: string;
    destination: string;
    departureTime: Date;
    gate: string;
    status: string;
}

export interface FlightFilter {
    status?: FlightStatus;
    destination?: string;
}