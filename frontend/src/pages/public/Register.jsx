import { Box, TextField, Button, Typography, Grid, InputAdornment, Paper, Divider, IconButton } from '@mui/material';
import { AlternateEmail, Pets, LanguageOutlined, ArrowBackIos, ArrowForwardIos, Visibility, VisibilityOff } from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
// import zIndex not needed
export default function Register() {
  const initialState = {
    name: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    passwordConfirm: '',
    address: '',
    showPassword: false,
  };

  function generarPasswordSegura() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return password;
  }

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [sugerenciaPassword, setSugerenciaPassword] = useState('');
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Si ya existe una sesión activa, redirigir a PetRegister
  useEffect(() => {
    try {
      const session = localStorage.getItem('userSession');
      if (session) {
        navigate('/public/PetRegister');
      }
    } catch (e) {
      // ignore
    }
  }, [navigate]);

  useEffect(() => {
    // Validar confirmación de contraseña cada vez que cambian los campos
    if (formData.password && formData.passwordConfirm) {
      setErrors(prev => ({
        ...prev,
        passwordConfirm:
          formData.password !== formData.passwordConfirm
            ? 'Las contraseñas no coinciden.'
            : '',
      }));
    }
  }, [formData.password, formData.passwordConfirm]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = t('validation.nameRequired', 'El nombre es obligatorio.');
    }
    if (!formData.lastname.trim()) {
      tempErrors.lastname = t('validation.lastnameRequired', 'Los apellidos son obligatorios.');
    }
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = t('validation.emailInvalid', 'El formato del correo electrónico no es válido.');
    }
    if (!formData.password) {
      tempErrors.password = t('validation.passwordRequired', 'La contraseña es obligatoria.');
    }
    if (formData.password !== formData.passwordConfirm) {
      tempErrors.passwordConfirm = t('validation.passwordsDontMatch', 'Las contraseñas no coinciden.');
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

  const handleGenerarPassword = () => {
    const nuevaPassword = generarPasswordSegura();
    setSugerenciaPassword(nuevaPassword);
    setFormData({
      ...formData,
      password: nuevaPassword,
      passwordConfirm: nuevaPassword,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      // Crear una sesión sencilla y guardarla en localStorage
      const sessionData = {
        user: {
          name: formData.name,
          email: formData.email,
        },
        createdAt: Date.now(),
      };
      try {
        localStorage.setItem('userSession', JSON.stringify(sessionData));
      } catch (e) {
        console.warn('No se pudo guardar la sesión en localStorage', e);
      }
      alert(t('register.success', '¡Dueño registrado con éxito!'));
      setFormData(initialState);
      navigate('/public/PetRegister');
    }
  };

  return (
    <Box minHeight="100vh" width="100vw" sx={{ background: 'linear-gradient(135deg, #C19A83 0%, #fff 100%)', display: 'flex', flexDirection: 'column',overflowY: 'auto', scrollBehavior: 'smooth' }}>
      <Box sx={{ flex: '0 0 auto', p: { xs: 1, md: 2 } }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.7)', color: '#4e342e' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" >
              <Pets sx={{marginRight:'30px', fontSize:'60px', lineHeight:'80px'}} />
              <Grid container spacing={2} direction="column" marginTop='5px'>
                <Typography variant="h4" component="h1" fontWeight={700} color='#4e342e'>
                  {t('hospital.title', 'Paw Hospital')}
                </Typography>
                <Typography variant='subtitle2' color='#4e342e'>
                  {t('hospital.subtitle', 'Syntactics Solutions')}
                </Typography>
              </Grid>
            </Box>
            <Box>
              <Button
                startIcon={<LanguageOutlined />}
                variant="link"
                color="inherit"
                onClick={() => i18n.changeLanguage(i18n.language == 'es' ? 'en' : 'es')}
              >
                {i18n.language === 'es' ? '🇲🇽 es-MX' : '🇺🇸 en-US'}
              </Button>
            </Box>
          </Box>
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
          {/* Carrusel de secciones */}
          {(() => {
            const sections = [
              {
                key: 'about',
                title: t('carousel.aboutTitle'),
                content: t('carousel.aboutContent'),
              },
              {
                key: 'mission',
                title: t('carousel.missionTitle'),
                content: t('carousel.missionContent'),
              },
              {
                key: 'vision',
                title: t('carousel.visionTitle'),
                content: t('carousel.visionContent', ''),
              },
              {
                key: 'services',
                title: t('carousel.servicesTitle'),
                content: t('carousel.servicesContent'),
              },
            ];
            const [current, setCurrent] = React.useState(0);
            React.useEffect(() => {
              const timer = setTimeout(() => {
                setCurrent((current + 1) % sections.length);
              }, 5000);
              return () => clearTimeout(timer);
            }, [current, sections.length]);
            return (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" sx={{ minHeight: 120, position: 'relative'}}>
                <Box display="flex" alignItems="center" justifyContent="center" width="100%" position="relative" >
                  <IconButton onClick={() => setCurrent((current - 1 + sections.length) % sections.length)} sx={{ position: 'absolute', left: 0, opacity:.4, '&:hover':{opacity:1}   }}>
                    <ArrowBackIos />
                  </IconButton>
                  <Box sx={{ textAlign: 'center', width: '100%' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ color: '#b71c1c' }}>
                      {sections[current].title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#4e342e', paddingLeft: '20px', paddingRight: '50px' }}>
                      {sections[current].content}
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setCurrent((current + 1) % sections.length)} sx={{ position: 'absolute', right: 0, opacity:.4, '&:hover':{opacity:1}  }}>
                    <ArrowForwardIos />
                  </IconButton>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={1}>
                  {sections.map((_, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: idx === current ? '#b71c1c' : '#c2b09e',
                        border: '2px solid #b71c1c',
                        transition: 'background 0.3s',
                        cursor: 'pointer',
                      }}
                      onClick={() => setCurrent(idx)}
                    />
                  ))}
                </Box>
              </Box>
            );
          })()}
          <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />  
          <Grid container spacing={2} 
            alignItems="flex-start" justifyContent="center">
            <Grid item xs={12} md={1}></Grid>
            <Grid item xs={12} md={4}>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off"
            
            sx={{background: 'rgba(255,255,255,0.5)', p:2, borderRadius:3}}>
              <Typography variant="h5" component="h2" gutterBottom align="center" color="primary" paddingTop={4 }>
                {t('register.title')}
              </Typography>
              
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size='small'
                      required
                      id="name"
                      name="name"
                      label={t('register.name')}
                      value={formData.name}
                      onChange={handleChange}
                      error={!!errors.name}
                      helperText={errors.name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size='small'
                      required
                      id="lastname"
                      name="lastname"
                      label={t('register.lastname')}
                      value={formData.lastname}
                      onChange={handleChange}
                      error={!!errors.lastname}
                      helperText={errors.lastname}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size='small'
                      id="email"
                      name="email"
                      label={t('register.email')}
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AlternateEmail />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size='small'
                      id="password"
                      name="password"
                      label={t('register.password')}
                      type={formData.showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={formData.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                              onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                              edge="end"
                            >
                              {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={handleGenerarPassword}
                    >
                      {t('register.suggestPassword')}
                    </Button>
                    
                    {/* {sugerenciaPassword && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Sugerencia: <b>{sugerenciaPassword}</b>
                      </Typography>
                    )} */}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size='small'
                      id="passwordConfirm"
                      name="passwordConfirm"
                      label={t('register.passwordConfirm')}
                      type={formData.showPassword ? 'text' : 'password'}
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      error={!!errors.passwordConfirm}
                      helperText={errors.passwordConfirm}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label={formData.showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                              onClick={() => setFormData(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                              edge="end"
                            >
                              {formData.showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    {/* { sugerenciaPassword && (
                        <Button
                          variant="outlined"
                          color="success"
                          size="samall"                          
                          sx={{ mt: 1 }}>
                            limpiar sugerencia
                          </Button>
                    )} */}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <PhoneInput
                      defaultCountry="mx"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      sx={{ zIndex:9999999}}
                      onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
                    />
                    
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size='small'
                      id="address"
                      name="address"
                      label={t('register.address')}
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
                      fullWidth
                      size='small'
                      sx={{ mt: 2 }}
                      startIcon={<Pets />}
                    >
                      {t('register.submit')}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} md={1}></Grid>
            <Grid item xs={12} md={6}>
              <img src="https://img.freepik.com/foto-gratis/cerca-veterinario-cuidando-mascota_23-2149143882.jpg" alt="Hospital Logo" style={{ width: '100%', maxWidth: '100%', display: 'block', margin: '0 auto' }} />
            </Grid>
          </Grid>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.7)', color: '#4e342e' }}>
          
        </Paper>
      </Box>
  );
