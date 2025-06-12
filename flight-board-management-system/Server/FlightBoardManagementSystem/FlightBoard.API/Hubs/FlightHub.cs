using Microsoft.AspNetCore.SignalR;

namespace FlightBoard.API.Hubs
{
    public class FlightHub : Hub
    {
        public async Task UpdateFlightStatus(int flightId, string status)
        {
            await Clients.All.SendAsync("flightStatusChanged", flightId, status);
        }
    }
}