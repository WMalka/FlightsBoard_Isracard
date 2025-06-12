using FlightBoard.Core.Entities;
using FlightBoard.Core.Interfaces;
using FlightBoard.Infrastructure.Data;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FlightBoard.Infrastructure.Repositories
{
    public class FlightRepository : IFlightRepository
    {
        private readonly FlightBoardContext _context;
        private readonly ILogger<FlightRepository> _logger;

        public FlightRepository(FlightBoardContext context, ILogger<FlightRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Flight>> GetAllAsync()
        {
            return await _context.Flights
                .OrderBy(f => f.DepartureTime)
                .ToListAsync();
        }

        public async Task<Flight> GetByIdAsync(int id)
        {
            return await _context.Flights.FindAsync(id);
        }

        public async Task<Flight> AddAsync(Flight flight)
        {
            await _context.Flights.AddAsync(flight);
            await _context.SaveChangesAsync();
            return flight;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var flight = await _context.Flights.FindAsync(id);
            if (flight == null)
            {
                return false;
            }

            _context.Flights.Remove(flight);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Flight>> GetFilteredAsync(string status = null, string destination = null)
        {
            var query = _context.Flights.AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                if (Enum.TryParse<FlightStatus>(status, true, out var flightStatus))
                {
                    query = query.Where(f => f.Status == flightStatus);
                }
            }

            if (!string.IsNullOrEmpty(destination))
            {
                query = query.Where(f => f.Destination.Contains(destination));
            }

            return await query.OrderBy(f => f.DepartureTime).ToListAsync();
        }

        public async Task<bool> FlightNumberExistsAsync(string flightNumber)
        {
            return await _context.Flights.AnyAsync(f => f.FlightNumber == flightNumber);
        }
    }
}