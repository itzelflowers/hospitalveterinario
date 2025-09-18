import './../../index.css';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const initialState = {
  name: '',
  species: '',
  breed: '',
  sex: 'U', 
  birth_date: '',
  color: '',
  microchip: '',
  is_neutered: '',
  notes: '',
};

function PetRegister() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'El nombre es obligatorio.';
    if (!formData.species.trim()) tempErrors.species = 'La especie es obligatoria.';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
     console.log('Datos de la mascota para enviar:', formData);
      alert('¡Mascota registrada con éxito!');
      setFormData(initialState);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '700px',
          margin: 2,
          padding: { xs: 2, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registro de Mascota
        </Typography>
        
        <Grid container spacing={3}>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              name="name"
              label="Nombre de la Mascota"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              select
              name="species"
              label="Especie"
              value={formData.species}
              onChange={handleChange}
              error={!!errors.species}
              helperText={errors.species}
            >
              <MenuItem value="Perro">Perro</MenuItem>
              <MenuItem value="Gato">Gato</MenuItem>
              <MenuItem value="Ave">Ave</MenuItem>
              <MenuItem value="Reptil">Reptil</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="breed"
              label="Raza"
              value={formData.breed}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Sexo</InputLabel>
              <Select
                name="sex"
                label="Sexo"
                value={formData.sex}
                onChange={handleChange}
              >
                <MenuItem value="M">Macho</MenuItem>
                <MenuItem value="F">Hembra</MenuItem>
                <MenuItem value="U">No especificado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="birth_date"
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="color"
              label="Color"
              value={formData.color}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="microchip"
              label="N° de Microchip"
              value={formData.microchip}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl>
              <FormLabel>¿Está esterilizado/a?</FormLabel>
              <RadioGroup
                row
                name="is_neutered"
                value={formData.is_neutered}
                onChange={handleChange}
              >
                <FormControlLabel value="1" control={<Radio />} label="Sí" />
                <FormControlLabel value="0" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="notes"
              label="Notas Adicionales (alergias, comportamiento, etc.)"
              multiline
              rows={4}
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              Registrar Mascota
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default PetRegister;