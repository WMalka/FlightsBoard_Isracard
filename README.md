# Flight Board Management System

## Project Description
A real-time flight board management application that enables tracking and managing flight information with live updates. Built with React and ASP.NET Core, it provides a responsive interface for monitoring flight statuses, managing departures, and handling real-time updates through SignalR.

## Main Features
- 🔄 Real-time flight status updates using SignalR
- 📊 Interactive flight board with sorting and filtering
- ✈️ Flight management (add, delete, update status)
- 🎯 Status calculation based on departure times
- 🎨 Modern UI with Material-UI components
- 🔍 Advanced filtering capabilities
- 📱 Responsive design for all devices
- 🔄 Automatic status updates every 2 minutes
- 🎭 Smooth animations for status changes
- ⚡ Optimized performance with React memo

## Project Preview
![image](https://github.com/user-attachments/assets/97d604c2-f75e-4366-bd70-3a2c16c1a6ea)


## Project Structure

### Backend Structure
```
Server/FlightBoardManagementSystem/
├── FlightBoard.API/
│   ├── Controllers/
│   │   └── FlightsController.cs
│   ├── Hubs/
│   │   └── FlightHub.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── appsettings.json
│   ├── appsettings.Development.json
│   ├── Program.cs
│   └── FlightBoard.API.csproj
├── FlightBoard.Core/
│   ├── Entities/
│   │   └── Flight.cs
│   ├── Interfaces/
│   │   └── IFlightRepository.cs
│   └── FlightBoard.Core.csproj
├── FlightBoard.Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   ├── Migrations/
│   └── FlightBoard.Infrastructure.csproj
├── FlightBoard.Services/
│   ├── DTOs/
│   ├── Interfaces/
│   ├── Mapping/
│   ├── Services/
│   └── FlightBoard.Services.csproj
└── FlightBoardManagementSystem.sln
```
### Frontend Structure
```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── flightApi.ts
│   ├── components/
│   │   ├── ErrorBoundary.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── FlightBoard.styles.ts
│   │   ├── FlightBoard.tsx
│   │   ├── FlightCreationForm.tsx
│   │   └── MemoizedFlightRow.tsx
│   ├── hooks/
│   │   ├── useFlightAnimation.ts
│   │   ├── useFlightFilter.ts
│   │   └── useFlights.ts
│   ├── models/
│   │   └── Flight.ts
│   ├── services/
│   │   └── signalRService.ts
│   ├── styles/
│   │   ├── animations.css
│   │   └── theme.ts
│   ├── utils/
│   │   ├── debounce.ts
│   │   ├── formatDate.ts
│   │   └── statusCalculator.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### Backend Setup
1. **Navigate to the backend directory**:
   ```
   cd backend/FlightBoard.API
   ```

2. **Restore dependencies**:
   ```
   dotnet restore
   ```

3. **Run the application**:
   ```
   dotnet run
   ```

4. **Database Migration**:
   Ensure that the database is set up correctly. Run the following command to apply migrations:
   ```
   dotnet ef database update
   ```

## Frontend Setup
1. **Navigate to the frontend directory**:
   ```
   cd frontend
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

## API Endpoints

### REST Endpoints

#### Get All Flights
```powershell
# Request (PowerShell)
Invoke-RestMethod -Uri "https://localhost:5001/api/flights" -Method Get

# Success Response (200 OK) - Multiple Flights
{
    "data": [
        {
            "id": "1",
            "flightNumber": "FL123",
            "destination": "London",
            "departureTime": "2025-06-12T14:30:00",
            "gate": "B12",
            "status": "OnTime"
        },
        {
            "id": "2",
            "flightNumber": "FL456",
            "destination": "Paris",
            "departureTime": "2025-06-12T15:45:00",
            "gate": "A5",
            "status": "Delayed"
        }
    ],
    "totalCount": 2
}

# Success Response (200 OK) - Empty List
{
    "data": [],
    "totalCount": 0
}

# Error Response (500 Internal Server Error)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.6.1",
    "title": "An error occurred while processing your request.",
    "status": 500,
    "traceId": "00-1234567890abcdef-1234567890abcdef-00"
}
```

#### Get Filtered Flights
```powershell
# Request (PowerShell)
Invoke-RestMethod -Uri "https://localhost:5001/api/flights/filter?status=OnTime&destination=London" -Method Get

# Success Response (200 OK)
[
    {
        "id": 1,
        "flightNumber": "FL123",
        "destination": "London",
        "departureTime": "2025-06-12T14:30:00",
        "gate": "B12",
        "status": "OnTime"
    }
]

# No Results Response (200 OK with empty array)
[]

# Invalid Filter Response (400 Bad Request)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "Invalid status value",
    "status": 400,
    "detail": "Status must be one of: Scheduled, OnTime, Delayed, Cancelled",
    "traceId": "00-1234567890abcdef-1234567890abcdef-00"
}
```

#### Add New Flight
```powershell
# Request (PowerShell)
$body = @{
    flightNumber = "FL123"
    destination = "London"
    departureTime = "2025-06-12T14:30:00"
    gate = "B12"
    status = "Scheduled"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://localhost:5001/api/flights" -Method Post -Body $body -ContentType "application/json"

# Success Response (201 Created)
{
    "id": 3,
    "flightNumber": "FL123",
    "destination": "London",
    "departureTime": "2025-06-12T14:30:00",
    "gate": "B12",
    "status": "Scheduled"
}

# Validation Error Response (400 Bad Request)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    "title": "One or more validation errors occurred.",
    "status": 400,
    "errors": {
        "flightNumber": [
            "Flight number is required",
            "Flight number must be in format: XX000"
        ],
        "departureTime": [
            "Departure time must be in the future"
        ]
    }
}

# Conflict Response (409 Conflict)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.8",
    "title": "A flight with this number already exists",
    "status": 409,
    "detail": "Flight number FL123 is already in use",
    "traceId": "00-1234567890abcdef-1234567890abcdef-00"
}
```

#### Delete Flight
```powershell
# Request (PowerShell)
Invoke-RestMethod -Uri "https://localhost:5001/api/flights/123" -Method Delete

# Success Response (204 No Content)
# No response body

# Not Found Response (404 Not Found)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
    "title": "Flight not found",
    "status": 404,
    "detail": "No flight found with ID 123",
    "traceId": "00-1234567890abcdef-1234567890abcdef-00"
}

# Unauthorized Response (401 Unauthorized)
{
    "type": "https://tools.ietf.org/html/rfc7231#section-6.5.3",
    "title": "Unauthorized",
    "status": 401,
    "detail": "Authentication credentials are missing or invalid",
    "traceId": "00-1234567890abcdef-1234567890abcdef-00"
}
```

### SignalR Hub Endpoints

The SignalR hub at `https://localhost:5001/flightHub` supports the following methods for real-time updates:

#### Server-to-Client Methods
```typescript
interface IFlightHubClient {
    // Notifies when a new flight is added to the system
    FlightAdded: (flight: Flight) => void;
    
    // Notifies when a flight is removed from the system
    FlightDeleted: (flightId: string) => void;
    
    // Notifies when a flight's status changes
    FlightStatusChanged: (flight: Flight) => void;
    
    // Notifies when there's an error processing a flight operation
    FlightError: (error: { message: string; flightId?: string }) => void;
}

// Example client implementation:
connection.on("FlightAdded", (flight: Flight) => {
    console.log("New flight added:", flight);
    // Update UI with new flight
});

connection.on("FlightDeleted", (flightId: string) => {
    console.log("Flight removed:", flightId);
    // Remove flight from UI
});

connection.on("FlightStatusChanged", (flight: Flight) => {
    console.log("Flight status updated:", flight);
    // Update flight status in UI
});
```

#### Connection Example
```typescript
// Initialize SignalR connection with retry policy
const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:5001/flightHub")
    .withAutomaticReconnect([0, 2000, 5000, 10000, 30000]) // Retry delays in milliseconds
    .configureLogging(signalR.LogLevel.Information)
    .build();

// Start connection with error handling
try {
    await connection.start();
    console.log("Connected to Flight Hub");
    
    // Subscribe to connection state changes
    connection.onreconnecting((error) => {
        console.log("Reconnecting to Flight Hub...", error);
    });
    
    connection.onreconnected((connectionId) => {
        console.log("Reconnected to Flight Hub. ConnectionId:", connectionId);
    });
    
    connection.onclose((error) => {
        console.log("Disconnected from Flight Hub", error);
    });
} catch (err) {
    console.error("Error connecting to Flight Hub:", err);
}
```

## Third-Party Libraries

### Backend
- **Framework & Core**:
  - ASP.NET Core 6.0
  - Entity Framework Core
  - SQLite (Database Provider)
  - SignalR (Real-time Communication)

- **Documentation & API**:
  - Swagger/OpenAPI (API Documentation)
  - Swashbuckle.AspNetCore (Swagger Integration)

- **Logging & Monitoring**:
  - Serilog (Structured Logging)
  - Serilog.Sinks.File (File Logging)
  - Serilog.Sinks.Console (Console Logging)

- **Data & Mapping**:
  - AutoMapper (Object-Object Mapping)
  - Microsoft.EntityFrameworkCore.Sqlite
  - Microsoft.EntityFrameworkCore.Tools

### Frontend
- **Core & State Management**:
  - React 18
  - TypeScript
  - @microsoft/signalr (SignalR Client)

- **Routing & Forms**:
  - React Router DOM
  - Formik (Form Management)
  - Yup (Form Validation)

- **UI & Styling**:
  - @mui/material (Material-UI Components)
  - @mui/icons-material
  - @emotion/styled (Styled Components)
  - @emotion/react
  - styled-components

- **HTTP & API**:
  - Axios (HTTP Client)

- **Development & Testing**:
  - React Scripts
  - ESLint
  - Jest
  - Testing Library

