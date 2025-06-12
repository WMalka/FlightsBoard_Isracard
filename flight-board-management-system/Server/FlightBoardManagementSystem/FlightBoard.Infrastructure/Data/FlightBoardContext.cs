using FlightBoard.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace FlightBoard.Infrastructure.Data
{
    public class FlightBoardContext : DbContext
    {
        public FlightBoardContext(DbContextOptions<FlightBoardContext> options)
            : base(options)
        {
        }
        public DbSet<Flight> Flights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Flight>()
                .HasIndex(f => f.FlightNumber)
                .IsUnique();

            // Seed initial flight data            // Using fixed dates for seed data
            var baseDate = new DateTime(2025, 6, 11, 12, 0, 0, DateTimeKind.Utc);
            
            modelBuilder.Entity<Flight>().HasData(
                new Flight
                {
                    Id = 1,
                    FlightNumber = "FL001",
                    Destination = "London",
                    DepartureTime = baseDate.AddHours(2),
                    Gate = "A1",
                    Status = FlightStatus.Scheduled,
                    CreatedAt = baseDate
                },
                new Flight
                {
                    Id = 2,
                    FlightNumber = "FL002",
                    Destination = "Paris",
                    DepartureTime = baseDate.AddHours(3),
                    Gate = "B2",
                    Status = FlightStatus.Scheduled,
                    CreatedAt = baseDate
                },
                new Flight
                {
                    Id = 3,
                    FlightNumber = "FL003",
                    Destination = "New York",
                    DepartureTime = baseDate.AddMinutes(15),
                    Gate = "C3",
                    Status = FlightStatus.Boarding,
                    CreatedAt = baseDate
                },
                new Flight
                {
                    Id = 4,
                    FlightNumber = "FL004",
                    Destination = "Tokyo",
                    DepartureTime = baseDate.AddHours(4),
                    Gate = "D4",
                    Status = FlightStatus.Scheduled,
                    CreatedAt = baseDate
                }
            );
        }
    }
}
