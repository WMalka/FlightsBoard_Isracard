using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FlightBoard.Services.DTOs;

namespace FlightBoard.Services.Interfaces
{
    public interface IFlightService
    {
        Task<IEnumerable<FlightDto>> GetAllFlightsAsync();
        Task<FlightDto> AddFlightAsync(CreateFlightDto flightDto);
        Task<bool> DeleteFlightAsync(int id);
        Task<IEnumerable<FlightDto>> GetFilteredFlightsAsync(string status, string destination);
    }
}