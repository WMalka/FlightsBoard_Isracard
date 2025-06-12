using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FlightBoard.Core.Entities
{
    public class Flight
    {
        public int Id { get; set; }

        [Required]
        [StringLength(10)]
        public string FlightNumber { get; set; }

        [Required]
        [StringLength(100)]
        public string Destination { get; set; }

        [Required]
        public DateTime DepartureTime { get; set; }

        [Required]
        [StringLength(5)]
        public string Gate { get; set; }

        public FlightStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public bool IsValidDepartureTime() => DepartureTime > DateTime.UtcNow;
    }

    public enum FlightStatus
    {
        Scheduled,
        Boarding,
        Departed,
        Landed,
        Delayed
    }
}