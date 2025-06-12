import React from 'react';
import {
  Paper,
  TextField,
  Button,
  Stack,
  MenuItem,
  Box,
} from '@mui/material';
import { FlightStatus, FlightFilter } from '../models/Flight';

interface FilterPanelProps {
  onFilter: (filter: FlightFilter) => void;
  onClear: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilter, onClear }) => {
  const [destination, setDestination] = React.useState('');
  const [status, setStatus] = React.useState<FlightStatus | ''>('');

  const handleSearch = () => {
    onFilter({
      destination: destination || undefined,
      status: status || undefined,
    });
  };

  const handleClear = () => {
    setDestination('');
    setStatus('');
    onClear();
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          label="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          size="small"
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as FlightStatus)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Scheduled">Scheduled</MenuItem>
          <MenuItem value="Boarding">Boarding</MenuItem>
          <MenuItem value="Departed">Departed</MenuItem>
          <MenuItem value="Landed">Landed</MenuItem>
          <MenuItem value="Delayed">Delayed</MenuItem>
        </TextField>
        <Box>
          <Button variant="contained" onClick={handleSearch} sx={{ mr: 1 }}>
            Search
          </Button>
          <Button variant="outlined" onClick={handleClear}>
            Clear
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FilterPanel;