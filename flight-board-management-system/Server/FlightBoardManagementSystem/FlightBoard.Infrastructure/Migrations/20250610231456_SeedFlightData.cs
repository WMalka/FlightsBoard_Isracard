using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FlightBoard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedFlightData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Flights",
                columns: new[] { "Id", "CreatedAt", "DepartureTime", "Destination", "FlightNumber", "Gate", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7075), new DateTime(2025, 6, 11, 1, 14, 56, 484, DateTimeKind.Utc).AddTicks(6324), "London", "FL001", "A1", 0, null },
                    { 2, new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7320), new DateTime(2025, 6, 11, 2, 14, 56, 484, DateTimeKind.Utc).AddTicks(7315), "Paris", "FL002", "B2", 0, null },
                    { 3, new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7333), new DateTime(2025, 6, 10, 23, 29, 56, 484, DateTimeKind.Utc).AddTicks(7321), "New York", "FL003", "C3", 1, null },
                    { 4, new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7335), new DateTime(2025, 6, 11, 3, 14, 56, 484, DateTimeKind.Utc).AddTicks(7334), "Tokyo", "FL004", "D4", 0, null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 4);
        }
    }
}
