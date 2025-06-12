using FlightBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlightBoard.Core.Interfaces
{
    public interface IFlightRepository
    {
        Task<IEnumerable<Flight>> GetAllAsync();
        Task<Flight> GetByIdAsync(int id);
        Task<Flight> AddAsync(Flight flight);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<Flight>> GetFilteredAsync(string status = null, string destination = null);
        Task<bool> FlightNumberExistsAsync(string flightNumber);
    }
}
