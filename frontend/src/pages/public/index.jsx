
import './../../index.css';
import { Card, CardContent, Typography, Grid, Box, Paper, TextField, Button, AppBar, Toolbar, Tabs, Tab } from "@mui/material";
import { motion } from "framer-motion";
import { FaDog, FaHospital } from "react-icons/fa";
import { useState } from "react";
export default function Index() {
    const [tab, setTab] = useState(0);


const handleChange = (event, newValue) => {
setTab(newValue);
};
  return (
    <Box sx={{ flexGrow: 1 }}>
{/* Navigation Bar */}
<AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
<Box display="flex" alignItems="center" gap={2}>
<FaDog size={28} />
<Typography variant="h6" sx={{ fontWeight: "bold" }}>
Paw Hospital
</Typography>
</Box>
<Tabs value={tab} onChange={handleChange} textColor="inherit" indicatorColor="secondary">
<Tab label="Misión" />
<Tab label="Visión" />
<Tab label="Valor" />
</Tabs>
</Toolbar>
</AppBar>
<Box
      sx={{
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundColor: "#f8f0eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 5,
      }}
    >
      {/*<motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >*/}
        <Grid container spacing={4} justifyContent="center" alignItems="center">
            <Grid item xs={10} md={5} padding={5} spacing={1} alignItems="flex-start" justifyContent="center" 
                sx={{borderRightColor:'#000', 
                borderRightWidth:2
                , borderRightStyle:'solid'}}>
            
                {/* Left Side */}
                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" sx={{ letterSpacing: 3, color: "#555" }} gutterBottom>
                    Proyecto Ciberseguridad
                    </Typography>
                    <Typography variant="h1" sx={{ fontWeight: "bold", lineHeight: 1.2}} gutterBottom>
                    PAW <br /> HOSPITAL
                    </Typography>

                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <FaDog size={100} />
                    <FaHospital size={100} />
                    </Box>

                    {/*<Box>
                    {[
                        "ERICK RODRÍGUEZ",
                        "EDUARDO SANTIAGO",
                        "SAUL RAMÍREZ",
                        "ITZEL FLORES",
                        "YATZIRI NERI",
                    ].map((name, idx) => (
                        <Typography key={idx} variant="body2" sx={{ fontWeight: 600 }}>
                        {name}
                        </Typography>
                    ))}
                    </Box>*/}
                </Grid>

                {/* Center - Hospital Illustration */}
                <Grid item xs={12} md={12}>
                    <Card elevation={8} sx={{ borderRadius: 4 }}>
                    <CardContent sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                        <Paper
                        elevation={3}
                        sx={{
                            width: 280,
                            height: 200,
                            bgcolor: "#bbdefb",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRadius: 3,
                            position: "relative"
                        }}
                        >
                        {/* Hospital Label */}
                        <Box
                            sx={{
                            bgcolor: "#e53935",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: "bold",
                            position: "absolute",
                            top: 8,
                            }}
                        >
                            HOSPITAL
                        </Box>

                        {/* Windows */}
                        <Grid container spacing={1} justifyContent="center" sx={{ px: 2, mb: 3 }}>
                            {Array.from({ length: 9 }).map((_, i) => (
                            <Grid item xs={4} key={i}>
                                <Box sx={{ bgcolor: "#64b5f6", height: 32, borderRadius: 1 }} />
                            </Grid>
                            ))}
                        </Grid>

                        {/* Entrance */}
                        <Box
                            sx={{
                            bgcolor: "#1976d2",
                            width: 160,
                            height: 40,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: 600,
                            borderTopLeftRadius: 8,
                            borderTopRightRadius: 8,
                            }}
                        >
                            ENTRADA
                        </Box>
                        </Paper>
                    </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid item xs={12} md={1} spacing={1} alignItems="flex-start" justifyContent="center"></Grid>
            
            {/* Right Side - Registration Form */}
            <Grid item xs={12} md={4}>
                <Card elevation={6} sx={{ borderRadius: 4 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 2 }}>
                    Registro
                    </Typography>
                    <Box component="form" display="flex" flexDirection="column" gap={2}>
                    <TextField label="Nombre" variant="outlined" fullWidth />
                    <TextField label="Correo electrónico" type="email" variant="outlined" fullWidth />
                    <TextField label="Teléfono" type="tel" variant="outlined" fullWidth />
                    <TextField label="Contraseña" type="password" variant="outlined" fullWidth />
                    <Button variant="contained" color="primary" fullWidth>
                        Registrarse
                    </Button>
                    </Box>
                </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} md={1} spacing={1} alignItems="flex-start" justifyContent="center"></Grid>
            
        </Grid>
      {/*</motion.div>*/}
    </Box>
    </Box>
  );
}
