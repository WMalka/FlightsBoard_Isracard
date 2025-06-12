using Microsoft.AspNetCore.Mvc;
using FlightBoard.Services.Interfaces;
using FlightBoard.Services.DTOs;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using FlightBoard.API.Hubs;

namespace FlightBoard.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FlightsController : ControllerBase
    {
        private readonly IFlightService _flightService;
        private readonly IHubContext<FlightHub> _hubContext;
        private readonly ILogger<FlightsController> _logger;

        public FlightsController(
            IFlightService flightService,
            IHubContext<FlightHub> hubContext,
            ILogger<FlightsController> logger)
        {
            _flightService = flightService;
            _hubContext = hubContext;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetFlights(
            [FromQuery] string? status = null,
            [FromQuery] string? destination = null)
        {
            var flights = await _flightService.GetFilteredFlightsAsync(status, destination);
            return Ok(flights);
        }

        [HttpPost]
        public async Task<IActionResult> CreateFlight([FromBody] CreateFlightDto flightDto)
        {
            try
            {                var flight = await _flightService.AddFlightAsync(flightDto);
                await _hubContext.Clients.All.SendAsync("flightAdded", flight);
                return CreatedAtAction(nameof(GetFlights), new { id = flight.Id }, flight);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFlight(int id)
        {
            var result = await _flightService.DeleteFlightAsync(id);
            if (!result)
                return NotFound();

            await _hubContext.Clients.All.SendAsync("FlightDeleted", id);
            return NoContent();
        }
    }
}