using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FlightBoard.Core.Interfaces;
using FlightBoard.Core.Entities;
using FlightBoard.Services.DTOs;
using FlightBoard.Services.Interfaces;
using AutoMapper;
using Microsoft.Extensions.Logging;


namespace FlightBoard.Services.Services
    {
        public class FlightService : IFlightService
        {
            private readonly IFlightRepository _flightRepository;
            private readonly IMapper _mapper;
            private readonly ILogger<FlightService> _logger;

            public FlightService(
                IFlightRepository flightRepository,
                IMapper mapper,
                ILogger<FlightService> logger
                )
            {
                _flightRepository = flightRepository;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<IEnumerable<FlightDto>> GetAllFlightsAsync()
            {
                try
                {
                    var flights = await _flightRepository.GetAllAsync();
                    return _mapper.Map<IEnumerable<FlightDto>>(flights);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error getting all flights");
                    throw;
                }
            }

            public async Task<FlightDto> AddFlightAsync(CreateFlightDto flightDto)
            {
                try
                {
                    if (await _flightRepository.FlightNumberExistsAsync(flightDto.FlightNumber))
                    {
                        throw new InvalidOperationException($"Flight number {flightDto.FlightNumber} already exists");
                    }

                    if (flightDto.DepartureTime <= DateTime.UtcNow)
                    {
                        throw new InvalidOperationException("Departure time must be in the future");
                    }

                    var flight = _mapper.Map<Flight>(flightDto);
                    var result = await _flightRepository.AddAsync(flight);

                    _logger.LogInformation($"Flight {result.FlightNumber} added successfully");
                    return _mapper.Map<FlightDto>(result);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error adding flight {flightDto.FlightNumber}");
                    throw;
                }
            }

            public async Task<bool> DeleteFlightAsync(int id)
            {
                try
                {
                    var result = await _flightRepository.DeleteAsync(id);
                    if (result)
                    {
                        _logger.LogInformation($"Flight with ID {id} deleted successfully");
                    }
                    return result;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error deleting flight with ID {id}");
                    throw;
                }
            }

            public async Task<IEnumerable<FlightDto>> GetFilteredFlightsAsync(string status, string destination)
            {
                try
                {
                    var flights = await _flightRepository.GetFilteredAsync(status, destination);
                    return _mapper.Map<IEnumerable<FlightDto>>(flights);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error getting filtered flights");
                    throw;
                }
            }
        }
    }
