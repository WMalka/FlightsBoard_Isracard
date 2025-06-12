import React, { memo } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { format } from 'date-fns';
import { StyledTableRow, StyledTableCell } from './FlightBoard.styles';
import { Flight } from '../models/Flight';
import { useFlightAnimation } from '../hooks/useFlightAnimation';

interface FlightRowProps {
  flight: Flight;
  onDelete: (id: number) => void;
}

const MemoizedFlightRow: React.FC<FlightRowProps> = memo(
  ({ flight, onDelete }) => {
    const animationClass = useFlightAnimation(true);

    return (
      <StyledTableRow className={animationClass} status={flight.status}>
        <StyledTableCell>{flight.flightNumber}</StyledTableCell>
        <StyledTableCell>{flight.destination}</StyledTableCell>
        <StyledTableCell>
          {format(flight.departureTime, 'HH:mm dd/MM/yyyy')}
        </StyledTableCell>
        <StyledTableCell>{flight.gate}</StyledTableCell>
        <StyledTableCell>{flight.status}</StyledTableCell>
        <StyledTableCell>
          <Tooltip title="Delete flight">
            <IconButton
              onClick={() => onDelete(flight.id)}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </StyledTableCell>
      </StyledTableRow>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if these properties change
    return (
      prevProps.flight.status === nextProps.flight.status &&
      prevProps.flight.departureTime === nextProps.flight.departureTime &&
      prevProps.flight.gate === nextProps.flight.gate &&
      prevProps.flight.destination === nextProps.flight.destination &&
      prevProps.flight.flightNumber === nextProps.flight.flightNumber
    );
  }
);

MemoizedFlightRow.displayName = 'MemoizedFlightRow';

export default MemoizedFlightRow;
