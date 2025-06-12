import React, { memo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';
import { StyledPaper, StyledTableCell } from './FlightBoard.styles';
import MemoizedFlightRow from './MemoizedFlightRow';
import { Flight } from '../models/Flight';

interface FlightBoardProps {
  flights: Flight[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<void>;
}

const FlightBoard: React.FC<FlightBoardProps> = memo(
  ({ flights, loading, error, onDelete }) => {
    console.log('[FlightBoard] Render called with', flights.length, 'flights');

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
      <StyledPaper elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Flight Number</StyledTableCell>
              <StyledTableCell>Destination</StyledTableCell>
              <StyledTableCell>Departure Time</StyledTableCell>
              <StyledTableCell>Gate</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flights.map((flight: Flight) => (
              <MemoizedFlightRow
                key={flight.id}
                flight={flight}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </StyledPaper>
    );
  },
  (prevProps, nextProps) => {
    const flightsEqual = 
      prevProps.flights.length === nextProps.flights.length &&
      prevProps.flights.every((flight, index) => 
        flight.id === nextProps.flights[index].id &&
        flight.status === nextProps.flights[index].status
      );
      
    const shouldSkipRender =
      flightsEqual &&
      prevProps.loading === nextProps.loading &&
      prevProps.error === nextProps.error &&
      prevProps.onDelete === nextProps.onDelete;

    console.log('[FlightBoard] Should skip render:', shouldSkipRender, {
      flightsEqual,
      loadingEqual: prevProps.loading === nextProps.loading,
      errorEqual: prevProps.error === nextProps.error,
      onDeleteEqual: prevProps.onDelete === nextProps.onDelete,
    });

    return shouldSkipRender;
  }
);

FlightBoard.displayName = 'FlightBoard';

export default FlightBoard;