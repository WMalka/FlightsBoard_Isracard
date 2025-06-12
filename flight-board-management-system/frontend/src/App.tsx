import React, { useState } from 'react';
import { ThemeProvider, CssBaseline, Container, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { theme } from './styles/theme';
//import Home from './pages/Home';
import FlightBoard from './components/FlightBoard';
import FlightCreationForm from './components/FlightCreationForm';
import FilterPanel from './components/FilterPanel';
import ErrorBoundary from './components/ErrorBoundary';
import { Flight, FlightFilter } from './models/Flight';
import { useFlights } from './hooks/useFlights';
import { addFlight } from './api/flightApi';
import { calculateFlightStatus } from './utils/statusCalculator';
import './App.css';
import './styles/animations.css';

const App: React.FC = () => {
  const [isAddFlightOpen, setIsAddFlightOpen] = useState(false);
  const { flights, loading, error, refreshFlights, handleDeleteFlight } = useFlights();

  const handleAddFlight = async (flightData: Omit<Flight, 'id' | 'status'>) => {
    try {
      // Calculate initial flight status
      const flightWithStatus: Omit<Flight, 'id'> = {
        ...flightData,
        status: calculateFlightStatus(new Date(flightData.departureTime))
      };
        // Call your API service here
        await addFlight(flightWithStatus);
        //await refreshFlights();
      } catch (error) {
        console.error('Error adding flight:', error);
      }
    };

    const handleFilter = async (filter: FlightFilter) => {
      await refreshFlights(filter);
    };

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <Router>
            <Container maxWidth="lg">
              <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <h1>Flight Board</h1>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setIsAddFlightOpen(true)}
                  >
                    Add Flight
                  </Button>
                </Box>

                <FilterPanel
                  onFilter={handleFilter}
                  onClear={() => refreshFlights()}
                />

                <FlightBoard
                  flights={flights}
                  loading={loading}
                  error={error}
                  onDelete={handleDeleteFlight}
                />

                <FlightCreationForm
                  open={isAddFlightOpen}
                  onClose={() => setIsAddFlightOpen(false)}
                  onAdd={handleAddFlight}
                />
              </Box>
            </Container>
          </Router>
        </ErrorBoundary>
      </ThemeProvider>
    );
  };

  export default App;