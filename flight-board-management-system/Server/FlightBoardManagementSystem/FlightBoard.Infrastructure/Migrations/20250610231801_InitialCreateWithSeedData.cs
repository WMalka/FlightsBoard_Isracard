using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightBoard.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateWithSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 11, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 11, 14, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 11, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 11, 15, 0, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 11, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 11, 12, 15, 0, 0, DateTimeKind.Utc) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 11, 12, 0, 0, 0, DateTimeKind.Utc), new DateTime(2025, 6, 11, 16, 0, 0, 0, DateTimeKind.Utc) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7075), new DateTime(2025, 6, 11, 1, 14, 56, 484, DateTimeKind.Utc).AddTicks(6324) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7320), new DateTime(2025, 6, 11, 2, 14, 56, 484, DateTimeKind.Utc).AddTicks(7315) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7333), new DateTime(2025, 6, 10, 23, 29, 56, 484, DateTimeKind.Utc).AddTicks(7321) });

            migrationBuilder.UpdateData(
                table: "Flights",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "CreatedAt", "DepartureTime" },
                values: new object[] { new DateTime(2025, 6, 10, 23, 14, 56, 484, DateTimeKind.Utc).AddTicks(7335), new DateTime(2025, 6, 11, 3, 14, 56, 484, DateTimeKind.Utc).AddTicks(7334) });
        }
    }
}
