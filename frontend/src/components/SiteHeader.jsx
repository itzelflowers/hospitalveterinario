import React from 'react';
import { Box, Paper, Grid, Typography, Button, Divider, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Pets, LanguageOutlined, ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function SiteHeader() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [current, setCurrent] = React.useState(0);

  const sections = [
    {
      key: 'about',
      title: t('carousel.aboutTitle', 'Conócenos'),
      content: t('carousel.aboutContent', 'Somos un hospital veterinario dedicado al bienestar animal, con un equipo profesional y atención personalizada para cada mascota y familia.'),
      img: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    },
    {
      key: 'mission',
      title: t('carousel.missionTitle', 'Misión'),
      content: t('carousel.missionContent', 'Brindar atención médica integral, ética y profesional a las mascotas, promoviendo su bienestar y el de sus familias.'),
      img: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80',
    },
    {
      key: 'vision',
      title: t('carousel.visionTitle', 'Visión'),
      content: t('carousel.visionContent', 'Ser el hospital veterinario líder en la región, reconocido por la excelencia en el cuidado animal.'),
      img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=800&q=80',
    },
    {
      key: 'services',
      title: t('carousel.servicesTitle', 'Servicios'),
      content: t('carousel.servicesContent', 'Consulta general, cirugías, vacunación, laboratorio, estética y asesoría nutricional para mascotas.'),
      img: 'https://images.unsplash.com/photo-1518715308788-3005759c61d3?auto=format&fit=crop&w=800&q=80',
    },
  ];

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent((c) => (c + 1) % sections.length);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current]);

  const session = (() => {
    try {
      return JSON.parse(localStorage.getItem('userSession'));
    } catch (e) {
      return null;
    }
  })();

  const [authOpen, setAuthOpen] = React.useState(false);
  const [loginEmail, setLoginEmail] = React.useState('');
  const [loginPassword, setLoginPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');

  const handleAuth = () => {
    // Open modal to login or show session info
    setAuthError('');
    if (session) {
      // show session info modal
      setAuthOpen(true);
    } else {
      // open login modal
      setLoginEmail('');
      setLoginPassword('');
      setAuthOpen(true);
    }
  };

  const handleCloseAuth = () => {
    setAuthOpen(false);
    setAuthError('');
  };

  const handleLogin = () => {
    // basic validation
    if (!loginEmail) {
      setAuthError('Email is required');
      return;
    }
    if (!loginPassword) {
      setAuthError('Password is required');
      return;
    }
    const name = loginEmail.split('@')[0] || loginEmail;
    const sessionData = { user: { name, email: loginEmail }, createdAt: Date.now() };
    try {
      localStorage.setItem('userSession', JSON.stringify(sessionData));
    } catch (e) {
      console.warn('Could not save session', e);
    }
    setAuthOpen(false);
    navigate('/public/PetRegister');
  };

  const handleLogoutFromModal = () => {
    try { localStorage.removeItem('userSession'); } catch (e) {}
    setAuthOpen(false);
    navigate('/');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.85)' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Pets sx={{ mr: 2 }} />
            <Box>
              <Typography variant="h5" fontWeight={700}>{t('hospital.title', 'Paw Hospital')}</Typography>
              <Typography variant="caption">{t('hospital.subtitle', 'Syntactics Solutions')}</Typography>
            </Box>
          </Box>
          <Box>
            <Button startIcon={<LanguageOutlined />} variant="outlined" color="inherit" onClick={() => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es')} sx={{ mr: 1 }}>
              {i18n.language === 'es' ? '🇲🇽 es' : '🇺🇸 en'}
            </Button>
            <Button variant="contained" color="secondary" onClick={handleAuth}>
              {session ? t('header.logout', 'Cerrar sesión') : t('header.login', 'Iniciar sesión')}
            </Button>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />

        {/* <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          <Box sx={{ width: '100%', height: 200, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
            <img src={sections[current].img} alt={sections[current].title} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }} />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ background: 'rgba(255,255,255,0.4)', color: '#4e342e', p: 2, borderRadius: 1, textAlign: 'center', maxWidth: '80%' }}>
                <Typography variant="h6" sx={{ color: '#b71c1c', fontWeight: 600 }}>{sections[current].title}</Typography>
                <Typography variant="body2" sx={{ color: '#4e342e' }}>{sections[current].content}</Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setCurrent((current - 1 + sections.length) % sections.length)} sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
              <ArrowBackIos />
            </IconButton>
            <IconButton onClick={() => setCurrent((current + 1) % sections.length)} sx={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'white' }}>
              <ArrowForwardIos />
            </IconButton>
          </Box>
          <Box display="flex" gap={1} mt={1}>
            {sections.map((_, idx) => (
              <Box key={idx} onClick={() => setCurrent(idx)} sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: idx === current ? '#b71c1c' : '#c2b09e', cursor: 'pointer' }} />
            ))}
        </Box>
          </Box> */}
          </Paper>
      {/* Auth modal */}
      <Dialog open={authOpen} onClose={handleCloseAuth}>
        <DialogTitle>
          {session ? t('header.sessionInfo', 'Sesión activa') : t('header.login', 'Iniciar sesión')}
        </DialogTitle>
        <DialogContent>
          {session ? (
            <Box>
              <Typography variant="body1">{t('header.email', 'Email')}: {session.user?.email}</Typography>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
              <TextField label={t('login.email','Email')} value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)} fullWidth />
              <TextField label={t('login.password','Password')} type="password" value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)} fullWidth />
              {authError && <Typography color="error">{authError}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAuth}>{t('common.cancel','Cancelar')}</Button>
          {session ? (
            <Button color="secondary" onClick={handleLogoutFromModal}>{t('header.logout','Cerrar sesión')}</Button>
          ) : (
            <Button variant="contained" onClick={handleLogin}>{t('header.login','Iniciar sesión')}</Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
