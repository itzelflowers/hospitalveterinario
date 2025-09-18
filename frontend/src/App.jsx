import {
  Box,
  Alert,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material'; 
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {useTranslation} from 'react-i18next'

function App() {
  const [count, setCount] = useState(0)
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [msgAlert, setMsgAlert] = useState('')
  const [errors, setErrors] = useState({})

  const {t, i18n} = useTranslation();
  return (
      <Box
      sx={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(181deg, #6a8ec854 1.01%, #0498d31c 97.13%), #fff',
      }}
    >
      {1 == 1 && (
        <Alert
          variant="filled"
          severity="error"
          sx={{
            position: 'absolute',
            top: 10,
            margin: 1,
            justifyContent: 'center',
            textAlign: 'center',
          }}
          onClose={() => setShowAlert(false)}
        >
          {msgAlert}
        </Alert>
      )}
      <Grid
        container
        rowSpacing={1}
        spacing={3}
        columnSpacing={{ xs: 3, sm: 2, md: 3 }}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'stretch',
        }}
        direction="row"
      >
        <Grid size={{ xs: 4, sm: 4, md: 5 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 365 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M353.667 5.5C353.667 8.44552 356.054 10.8333 359 10.8333C361.946 10.8333 364.333 8.44552 364.333 5.5C364.333 2.55448 361.946 0.166667 359 0.166667C356.054 0.166667 353.667 2.55448 353.667 5.5ZM0 6.5H359V4.5H0V6.5Z"
              fill="url(#paint0_linear_2927_5292)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2927_5292"
                x1="0"
                y1="6"
                x2="359"
                y2="6"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#3674D4" stopOpacity="0" />
                <stop offset="1" stopColor="#1C3C6E" />
              </linearGradient>
            </defs>
          </svg>
        </Grid>

        <Grid size={{ xs: 4, sm: 3, md: 2 }}>
          <img src={viteLogo} alt="Logo SI" width="100%" height="100%" />
        </Grid>
        <Grid size={{ xs: 4, sm: 4, md: 5 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 365 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.666667 5.5C0.666667 8.44552 3.05448 10.8333 6 10.8333C8.94552 10.8333 11.3333 8.44552 11.3333 5.5C11.3333 2.55448 8.94552 0.166667 6 0.166667C3.05448 0.166667 0.666667 2.55448 0.666667 5.5ZM6 6.5H365V4.5H6V6.5Z"
              fill="url(#paint0_linear_2927_5293)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2927_5293"
                x1="6"
                y1="6"
                x2="365"
                y2="6"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#1C3C6E" />
                <stop offset="1" stopColor="#3674D4" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </Grid>
      </Grid>
      <Box elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        <form /*onSubmit={handleLogin}*/>
          <TextField
            fullWidth
            label={t('auth.user')}
            variant="filled"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            error={!!errors.usuario}
            margin="normal"
            size="small"
            required
            autoFocus
            InputProps={{
              sx: {
                backgroundColor: '#EDEDED',
                borderRadius: '10px 10px 0 0',
                border: '1px solid rgba(44, 44, 44, 0.33)',
                borderBottom: 'none'
              },
            }}
            helperText={errors.usuario}
            FormHelperTextProps={{
              sx: {
                textAlign: 'center',
                backgroundColor: 'transparent',
              },
            }}
          />
          <TextField
            fullWidth
            label={t('auth.password')}
            variant="filled"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            size="small"
            required
            InputProps={{
              sx: {
                backgroundColor: '#EDEDED',
                borderRadius: '10px 10px 0 0',
                border: '1px solid rgba(44, 44, 44, 0.33)',
                borderBottom: 'none'
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText={errors.password}
            FormHelperTextProps={{
              sx: {
                textAlign: 'center',
                backgroundColor: 'transparent',
              },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!usuario || !password || isLoading}
            sx={{ mt: 3, backgroundColor: '#4fc3f7', ':hover': { backgroundColor: '#29b6f6' } }}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            
          </Button>
        </form>
        <Typography variant="caption" display="block" textAlign="center" mt={0.5}>
          v0.0.1
        </Typography>
      </Box>
    </Box>
  )
}

export default App
