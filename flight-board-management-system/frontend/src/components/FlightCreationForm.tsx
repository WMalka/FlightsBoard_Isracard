import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Flight } from '../models/Flight';

interface FlightCreationFormProps {
    open: boolean;
    onClose: () => void;
    onAdd: (flight: Omit<Flight, 'id' | 'status'>) => Promise<void>;
}

const validationSchema = yup.object({
    flightNumber: yup
        .string()
        .required('Flight number is required')
        .matches(/^[A-Z0-9]{2,8}$/, 'Invalid flight number format'),
    destination: yup.string().required('Destination is required'),
    gate: yup.string().required('Gate is required'),
    departureTime: yup
        .date()
        .min(new Date(), 'Departure time must be in the future')
        .required('Departure time is required'),
});

const FlightCreationForm: React.FC<FlightCreationFormProps> = ({ open, onClose, onAdd }) => {
    const formik = useFormik({
        initialValues: {
            flightNumber: '',
            destination: '',
            gate: '',
            departureTime: new Date().toISOString().slice(0, 16), // Format: "YYYY-MM-DDTHH:mm"
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            await onAdd({
                ...values,
                departureTime: new Date(values.departureTime), // Convert string to Date
            });
            resetForm();
            onClose();
        },
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <form onSubmit={formik.handleSubmit}>
                <DialogTitle>Add New Flight</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            name="flightNumber"
                            label="Flight Number"
                            value={formik.values.flightNumber}
                            onChange={formik.handleChange}
                            error={formik.touched.flightNumber && Boolean(formik.errors.flightNumber)}
                            helperText={formik.touched.flightNumber && formik.errors.flightNumber}
                        />
                        <TextField
                            fullWidth
                            name="destination"
                            label="Destination"
                            value={formik.values.destination}
                            onChange={formik.handleChange}
                            error={formik.touched.destination && Boolean(formik.errors.destination)}
                            helperText={formik.touched.destination && formik.errors.destination}
                        />
                        <TextField
                            fullWidth
                            name="gate"
                            label="Gate"
                            value={formik.values.gate}
                            onChange={formik.handleChange}
                            error={formik.touched.gate && Boolean(formik.errors.gate)}
                            helperText={formik.touched.gate && formik.errors.gate}
                        />
                        <TextField
                            fullWidth
                            type="datetime-local"
                            name="departureTime"
                            label="Departure Time"
                            value={formik.values.departureTime}
                            onChange={formik.handleChange}
                            error={formik.touched.departureTime && Boolean(formik.errors.departureTime)}
                            helperText={formik.touched.departureTime && formik.errors.departureTime}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Add Flight
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FlightCreationForm;