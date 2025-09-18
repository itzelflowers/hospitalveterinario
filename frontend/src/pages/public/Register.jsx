import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Container } from '@mui/material';

const initialState = {
  fullName: '',
  phone: '',
  email: '',
  password: '',
  address: '',
};

function Register() {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = 'El nombre completo es obligatorio.';
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'El formato del correo electrónico no es válido.';
    }
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
      console.log('Datos del formulario listos para enviar:', formData);
      alert('¡Dueño registrado con éxito!');
      setFormData(initialState);
    }
  };

  return (

    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh" 
      sx={{ backgroundColor: '#f0f2f5' }} 
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: '100%',
          maxWidth: '600px',
          margin: 2, 
          padding: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'white',
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Registro de Dueño 🐾
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              id="full-name"
              name="fullName"
              label="Nombre Completo"
              value={formData.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Correo Electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Teléfono"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              id="address"
              name="address"
              label="Dirección"
              multiline
              rows={3}
              value={formData.address}
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
              Registrar Dueño
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Register;