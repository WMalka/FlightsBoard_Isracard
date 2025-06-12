import { styled } from '@mui/material/styles';
import { Paper, TableCell, TableRow } from '@mui/material';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
  overflowX: 'auto',
}));

export const StyledTableRow = styled(TableRow)<{ status?: string }>(({ theme, status }) => ({
  '&.fade-in': {
    animation: 'fadeIn 0.5s ease-in',
  },
  '&.glow': {
    animation: 'glow 2s ease-in-out',
  },
  backgroundColor: status === 'Boarding' 
    ? 'rgba(255, 193, 7, 0.1)'
    : status === 'Departed'
    ? 'rgba(76, 175, 80, 0.1)'
    : 'inherit',
  transition: 'background-color 0.3s ease-in-out',
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
}));