import * as signalR from '@microsoft/signalr';
import { Flight } from '../models/Flight';

export class SignalRService {
    private hubConnection: signalR.HubConnection;
    private isConnecting: boolean = false;
    private reconnectTimeout: NodeJS.Timeout | null = null;    constructor() {        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:5001/flightHub', {
                withCredentials: false
            }).withAutomaticReconnect({
                nextRetryDelayInMilliseconds: retryContext => {
                    // Start with 0 (immediate retry), then 2 minutes for subsequent retries
                    return retryContext.previousRetryCount === 0 ? 0 : 120000;
                }
            })
            .configureLogging(signalR.LogLevel.Information)
            .build();

        // Handle reconnection events
        this.hubConnection.onreconnecting(() => {
            console.log('SignalR attempting to reconnect...');
            this.isConnecting = true;
        });

        this.hubConnection.onreconnected(() => {
            console.log('SignalR reconnected successfully');
            this.isConnecting = false;
        });

        this.hubConnection.onclose(() => {
            console.log('SignalR connection closed');
            this.isConnecting = false;
            // Try to reconnect if not explicitly stopped
            if (!this.isConnecting) {
                this.reconnectTimeout = setTimeout(() => this.startConnection(), 120000);
            }
        });
    }

    public async startConnection(): Promise<void> {
        if (this.isConnecting || this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
            return;
        }

        try {
            this.isConnecting = true;
            await this.hubConnection.start();
            console.log('SignalR Connected!');
        } catch (err) {
            console.error('SignalR Connection Error: ', err);
            
            // Clear any existing reconnection timeout
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
            }
            
            // Try to reconnect after 2 minutes
            this.reconnectTimeout = setTimeout(() => this.startConnection(), 120000);
        } finally {
            this.isConnecting = false;
        }
    }

    public async stopConnection(): Promise<void> {
        try {
            // Clear any pending reconnection attempt
            if (this.reconnectTimeout) {
                clearTimeout(this.reconnectTimeout);
                this.reconnectTimeout = null;
            }
            
            if (this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
                await this.hubConnection.stop();
                console.log('SignalR Disconnected!');
            }
        } catch (err) {
            console.error('SignalR Disconnection Error: ', err);
        } finally {
            this.isConnecting = false;
        }
    }    public onFlightAdded(callback: (flight: Flight) => void): () => void {
        this.hubConnection.on('flightAdded', callback);
        // Return cleanup function
        return () => this.hubConnection.off('flightAdded', callback);
    }    public onFlightDeleted(callback: (id: number) => void): () => void {
        this.hubConnection.on('flightDeleted', callback);
        return () => this.hubConnection.off('flightDeleted', callback);
    }

    public onFlightStatusChanged(callback: (flight: Flight) => void): () => void {
        this.hubConnection.on('flightStatusChanged', callback);
        return () => this.hubConnection.off('flightStatusChanged', callback);
    }
}

export const signalRService = new SignalRService();