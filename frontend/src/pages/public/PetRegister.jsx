import React, { useState, useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
} from "@mui/material";
import {
  Pets,
  CalendarMonth,
  Numbers,
  ArrowBackIos,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function PetRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Opciones
  const HAIR_TYPE_BY_SPECIES = {
  Perro: [
    'Pelo Corto',
    'Pelo Mediano',
    'Pelo Largo',
    'Pelo Rizado',
    'Pelo Duro (de alambre)',
    'Pelo Liso',
    'Sin Pelo',
    'Doble Manto',
  ],
  Gato: [
    'Pelo Corto',
    'Pelo Semilargo',
    'Pelo Largo',
    'Pelo Rizado (Rex)',
    'Sin Pelo',
  ],
  Roedor: [
    'Pelo Corto',
    'Pelo Largo (Angora)',
    'Pelo Rizado (Rex)',
    'Pelo Satinado (Brillante)',
    'Sin Pelo',
  ],
  Ave: [
    'Plumaje', // Las aves no tienen pelo
  ],
};
  const USOS = [
    "Mascota doméstica",
    "Mascota de asistencia médica",
    "Mascota guía",
    "Mascota de protección",
    "Mascota de apoyo psiquiátrico",
  ];
  const CHIP_TYPES = [
    "FDX‑A (ISO 11784)",
    "FDX‑B (ISO 11784/11785)",
    "HDX",
    "Otro",
  ];
  const SPECIES = ["Perro", "Gato", "Roedor", "Ave"];

  const BREEDS_BY_SPECIES = {
    Perro: [
  'Mestizo', 'Affenpinscher', 'Afgano', 'Airedale Terrier', 'Akita Inu', 'Akita Americano','Alaskan Malamute', 'American Staffordshire Terrier', 'Antiguo Pastor Inglés (Bobtail)',
  'Appenzeller', 'Australian Cattle Dog (Boyero Australiano)', 'Australian Shepherd', 'Azawakh','Basenji', 'Basset Hound', 'Beagle', 'Bearded Collie', 'Beauceron', 'Bedlington Terrier',
  'Bernés de la Montaña', 'Bichón Frisé', 'Bichón Habanero', 'Bichón Maltés', 'Bloodhound','Border Collie', 'Border Terrier', 'Borzoi', 'Boston Terrier', 'Boxer', 'Braco Alemán',
  'Braco de Weimar (Weimaraner)', 'Bull Terrier', 'Bulldog Francés', 'Bulldog Inglés','Bullmastiff', 'Cairn Terrier', 'Cane Corso', 'Caniche (Poodle)', 'Carlino (Pug)',
  'Cavalier King Charles Spaniel', 'Chihuahua', 'Chow Chow', 'Cocker Spaniel Americano','Cocker Spaniel Inglés', 'Collie de Pelo Largo', 'Collie de Pelo Corto', 'Coton de Tuléar',
  'Dachshund (Teckel)', 'Dálmata', 'Doberman', 'Dogo de Burdeos', 'Dogo Argentino','Dogo Alemán (Gran Danés)', 'Fila Brasileiro', 'Fox Terrier', 'Galgo Español',
  'Galgo Inglés (Greyhound)', 'Galgo Italiano', 'Golden Retriever', 'Gordon Setter', 'Gran Pirineo','Grifón de Bruselas', 'Husky Siberiano', 'Jack Russell Terrier', 'Keeshond', 'Kerry Blue Terrier',
  'Komondor', 'Labrador Retriever', 'Lakeland Terrier', 'Leonberger', 'Lhasa Apso','Malamute de Alaska', 'Mastín Inglés', 'Mastín Napolitano', 'Mastín del Pirineo', 'Mastín Tibetano',
  'Münsterländer', 'Papillón', 'Pastor Alemán', 'Pastor Australiano', 'Pastor Belga','Pastor Blanco Suizo', 'Pastor de Anatolia', 'Pastor de Beauce (Beauceron)', 'Pastor de Brie',
  'Pastor de los Pirineos', 'Pastor de Shetland (Sheltie)', 'Pekinés', 'Pembroke Welsh Corgi','Pequeño Lebrel Italiano', 'Perro de Agua Español', 'Perro de Agua Portugués', 'Perro Lobo Checo',
  'Pinscher Miniatura', 'Pitbull Terrier Americano', 'Pointer Inglés', 'Pomerania', 'Presa Canario','Puli', 'Rhodesian Ridgeback', 'Rottweiler', 'Saluki', 'Samoyedo', 'San Bernardo',
  'Schnauzer (Gigante, Estándar, Miniatura)', 'Scottish Terrier (Scottie)', 'Setter Irlandés','Shar Pei', 'Shiba Inu', 'Shih Tzu', 'Skye Terrier', 'Soft Coated Wheaten Terrier',
  'Staffordshire Bull Terrier', 'Teckel (Dachshund)', 'Terranova', 'Terrier Australiano','Terrier Brasileño', 'Terrier Chileno', 'Terrier Escocés', 'Terrier Irlandés', 'Terrier Tibetano',
  'Vizsla (Braco Húngaro)', 'Volpino Italiano', 'West Highland White Terrier (Westie)','Whippet', 'Xoloitzcuintle', 'Yorkshire Terrier', 'Otro'
],
    Gato: [
  'Mestizo', 'Abisinio', 'American Shorthair', 'American Curl', 'Angora Turco', 'Azul Ruso','Balinés', 'Bengalí', 'Birmano', 'Bobtail Japonés', 'Bombay', 'Bosque de Noruega',
  'British Shorthair', 'Burmés', 'Burmilla', 'Chartreux', 'Cornish Rex', 'Cymric', 'Devon Rex','Don Sphynx', 'Exótico de Pelo Corto', 'Fold Escocés (Scottish Fold)', 'Gato del Himalaya',
  'Gato Siberiano', 'Habana Brown', 'Javanés', 'Khao Manee', 'Korat', 'LaPerm', 'Maine Coon','Manx', 'Mau Egipcio', 'Munchkin', 'Nebelung', 'Ocicat', 'Oriental de Pelo Corto',
  'Oriental de Pelo Largo', 'Persa', 'Peterbald', 'Pixie-bob', 'Ragdoll', 'Ragamuffin','Savannah', 'Selkirk Rex', 'Siámes', 'Singapura', 'Snowshoe', 'Somalí', 'Sphynx (Esfinge)',
  'Tonkinés', 'Toyger', 'Van Turco', 'Otro'
],
    Roedor: [
  'Hámster Sirio', 'Hámster Ruso', 'Hámster Roborovski', 'Hámster Chino', 'Cobaya (Conejillo de Indias)','Chinchilla', 'Rata Doméstica (Dumbo, Calva)', 'Ratón Doméstico', 'Jerbo de Mongolia', 'Lirón Careto',
  'Degú', 'Perro de la Pradera', 'Ardilla Coreana', 'Ardilla de Richardson', 'Otro'
],
    Ave: [
  'Canario', 'Periquito Australiano', 'Ninfa (Carolina)', 'Agapornis (Inseparable)', 'Cacatúa','Diamante Mandarín', 'Diamante de Gould', 'Jilguero', 'Loro Gris de Cola Roja (Yaco)',
  'Guacamayo', 'Amazona', 'Cotorra Argentina', 'Rosella', 'Forpus', 'Isabelita del Japón','Pionus', 'Kakariki', 'Perico de Bourke', 'Cotorra del Sol (Aratinga)', 'Eclecto', 'Otro'
],
  };

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    hairType: "",
    ageYears: "",
    ageMonths: "",
    weight: "",
    hasChip: "no", // 'si' | 'no'
    chipType: "",
    chipNumber: "",
    vaccinationRecord: "",
    lastVaccinationDate: "", // yyyy-mm-dd
    sterilized: "no", // 'si' | 'no'
    dewormingDate: "", // yyyy-mm-dd
    specialNeeds: "",
    canLiveWithDogs: "si", // 'si' | 'no'
    aggressionLevel: "", // 1..5
    specialDiet: "no", // 'si' | 'no'
    dietDetails: "",
    usage: "",
  });

  const [errors, setErrors] = useState({});

  const availableBreeds = useMemo(() => {
    return formData.species && BREEDS_BY_SPECIES[formData.species]
      ? BREEDS_BY_SPECIES[formData.species]
      : [];
  }, [formData.species]);

  const hairOptions = useMemo(() => {
    if (!formData.species) return [];
    return HAIR_TYPE_BY_SPECIES[formData.species] || [];
  }, [formData.species]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let next = { ...prev, [name]: value };

      // Reset dependientes
      if (name === "species") {
        next.breed = "";
        // Ajustar tipo de pelo según especie
        if (value === "Ave") {
          next.hairType = "Plumaje";
        } else {
          next.hairType = "";
        }
      }
      if (name === "hasChip" && value === "no") {
        next.chipType = "";
        next.chipNumber = "";
      }
      if (name === "specialDiet" && value === "no") {
        next.dietDetails = "";
      }
      return next;
    });
  };

  const validate = () => {
    const temp = {};

    if (!formData.name.trim()) temp.name = "El nombre es obligatorio";

    if (!formData.species.trim()) temp.species = "La especie es obligatoria";

    if (!formData.breed.trim()) temp.breed = "La raza es obligatoria";

    if (!formData.hairType.trim())
      temp.hairType = "El tipo de pelo es obligatorio";

    const years = Number(formData.ageYears) || 0;
    const months = Number(formData.ageMonths) || 0;

    if (
      years < 0 ||
      months < 1 ||
      months > 11 ||
      (years === 0 && months < 1)
    ) {
      temp.age = "Ingresa una edad válida (meses de 1 a 11)";
    }

    if (
      !formData.weight.toString().trim() ||
      isNaN(Number(formData.weight)) ||
      Number(formData.weight) <= 0
    ) {
      temp.weight = "Ingresa un peso válido";
    }

    if (formData.hasChip === "si") {
      if (!formData.chipType.trim())
        temp.chipType = "Selecciona el tipo de chip";
      if (!formData.chipNumber.trim())
        temp.chipNumber = "Ingresa el número de chip";
    }

    if (
      formData.aggressionLevel &&
      (Number(formData.aggressionLevel) < 1 ||
        Number(formData.aggressionLevel) > 5)
    ) {
      temp.aggressionLevel = "Selecciona un nivel entre 1 y 5";
    }

    if (formData.specialDiet === "si" && !formData.dietDetails.trim()) {
      temp.dietDetails = "Describe la alimentación especial";
    }

    if (!formData.usage.trim()) temp.usage = "Selecciona el uso de la mascota";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Aquí puedes integrar tu llamado a API
    alert("Mascota registrada con éxito");
    navigate("/public/Index");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #C19A83 0%, #fff 100%)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        scrollBehavior: "smooth",
      }}
    >
      <Box sx={{ flex: "0 0 auto", p: { xs: 2, md: 4 } }}>
        <Paper
          elevation={1}
          sx={{
            p: 4,
            borderRadius: 3,
            background: "rgba(255,255,255,0.7)",
            color: "#4e342e",
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={2}
          >
            <Box display="flex" alignItems="center">
              <Button
                color="inherit"
                onClick={() => navigate("/public/Register")}
                startIcon={<ArrowBackIos />}
                sx={{ color: "#4e342e" }}
              >
                Volver
              </Button>
              <Pets sx={{ fontSize: 60, mx: 2 }} />
              <Typography variant="h4" fontWeight={700} color="#4e342e">
                Registro de Mascota
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, bgcolor: "rgba(255,255,255,0.3)" }} />

          {/* Formulario */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            autoComplete="off"
            sx={{ background: "rgba(255,255,255,0.5)", p: 3, borderRadius: 3 }}
          >
            <Grid container spacing={3}>
              {/* Nombre */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  id="name"
                  name="name"
                  label="Nombre"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>

              {/* Especie */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.species}>
                  <InputLabel id="species-label">Especie</InputLabel>
                  <Select
                    labelId="species-label"
                    id="species"
                    name="species"
                    label="Especie"
                    value={formData.species}
                    onChange={handleChange}
                  >
                    {SPECIES.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="error.main">
                    {errors.species}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Raza (combo dependiente) */}
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  required
                  error={!!errors.breed}
                  disabled={!formData.species}
                >
                  <InputLabel id="breed-label">Raza</InputLabel>
                  <Select
                    labelId="breed-label"
                    id="breed"
                    name="breed"
                    label="Raza"
                    value={formData.breed}
                    onChange={handleChange}
                  >
                    {availableBreeds.map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="error.main">
                    {errors.breed}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Tipo de pelo */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required error={!!errors.hairType}>
                  <InputLabel id="hairType-label">Tipo de pelo</InputLabel>
                  <Select
                    labelId="hairType-label"
                    id="hairType"
                    name="hairType"
                    label="Tipo de pelo"
                    value={formData.hairType}
                    onChange={handleChange}
                    disabled={formData.species === "Ave"}
                  >
                    {hairOptions.map((h) => (
                      <MenuItem key={h} value={h}>
                        {h}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="error.main">
                    {errors.hairType}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Edad */}
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={2}>
                  <TextField
                    fullWidth
                    id="ageYears"
                    name="ageYears"
                    label="Edad (años)"
                    type="number"
                    value={formData.ageYears}
                    onChange={handleChange}
                    InputProps={{
                      inputProps: { min: 0 },
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    id="ageMonths"
                    name="ageMonths"
                    label="Edad (meses)"
                    type="number"
                    value={formData.ageMonths}
                    onChange={handleChange}
                    InputProps={{
                      inputProps: { min: 1, max: 11 },
                    }}
                  />
                </Box>
                {errors.age && (
                  <Typography variant="caption" color="error.main">
                    {errors.age}
                  </Typography>
                )}
              </Grid>



              {/* Peso */}
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  id="weight"
                  name="weight"
                  label="Peso (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  error={!!errors.weight}
                  helperText={errors.weight}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Numbers />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* ¿Tiene chip? */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="hasChip-label">¿Tiene chip?</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="hasChip-label"
                    name="hasChip"
                    value={formData.hasChip}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Campos de chip condicionales */}
              {formData.hasChip === "si" && (
                <>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required error={!!errors.chipType}>
                      <InputLabel id="chipType-label">Tipo de chip</InputLabel>
                      <Select
                        labelId="chipType-label"
                        id="chipType"
                        name="chipType"
                        label="Tipo de chip"
                        value={formData.chipType}
                        onChange={handleChange}
                      >
                        {CHIP_TYPES.map((c) => (
                          <MenuItem key={c} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </Select>
                      <Typography variant="caption" color="error.main">
                        {errors.chipType}
                      </Typography>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="chipNumber"
                      name="chipNumber"
                      label="Número de chip"
                      value={formData.chipNumber}
                      onChange={handleChange}
                      error={!!errors.chipNumber}
                      helperText={errors.chipNumber}
                    />
                  </Grid>
                </>
              )}

              {/* Vacunas */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="vaccinationRecord"
                  name="vaccinationRecord"
                  label="Cuadro de vacunación (resumen)"
                  multiline
                  minRows={3}
                  value={formData.vaccinationRecord}
                  onChange={handleChange}
                  placeholder="Ej.: Rabia: 2024-10-01; Parvo: 2025-01-15"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="lastVaccinationDate"
                  name="lastVaccinationDate"
                  label="Fecha de última vacunación"
                  type="date"
                  value={formData.lastVaccinationDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Esterilizado + Desparasitación */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="sterilized-label">¿Esterilizado?</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="sterilized-label"
                    name="sterilized"
                    value={formData.sterilized}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="dewormingDate"
                  name="dewormingDate"
                  label="Fecha de desparasitación"
                  type="date"
                  value={formData.dewormingDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Necesidades especiales */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="specialNeeds"
                  name="specialNeeds"
                  label="Necesidades especiales"
                  multiline
                  minRows={2}
                  value={formData.specialNeeds}
                  onChange={handleChange}
                />
              </Grid>

              {/* Convivir con otros perros */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="canLiveWithDogs-label">
                    ¿Convive con otros perros?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="canLiveWithDogs-label"
                    name="canLiveWithDogs"
                    value={formData.canLiveWithDogs}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* Nivel de agresividad */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.aggressionLevel}>
                  <InputLabel id="aggressionLevel-label">
                    Nivel de agresividad (1–5)
                  </InputLabel>
                  <Select
                    labelId="aggressionLevel-label"
                    id="aggressionLevel"
                    name="aggressionLevel"
                    label="Nivel de agresividad (1–5)"
                    value={formData.aggressionLevel}
                    onChange={handleChange}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <MenuItem key={n} value={String(n)}>
                        {n}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="error.main">
                    {errors.aggressionLevel}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Alimentación especial */}
              <Grid item xs={12} sm={6}>
                <FormControl>
                  <FormLabel id="specialDiet-label">
                    ¿Alimentación especial?
                  </FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="specialDiet-label"
                    name="specialDiet"
                    value={formData.specialDiet}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="si"
                      control={<Radio />}
                      label="Sí"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {formData.specialDiet === "si" && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    id="dietDetails"
                    name="dietDetails"
                    label="Detalle de la alimentación"
                    multiline
                    minRows={2}
                    value={formData.dietDetails}
                    onChange={handleChange}
                    error={!!errors.dietDetails}
                    helperText={errors.dietDetails}
                  />
                </Grid>
              )}

              {/* Uso */}
              <Grid item xs={12}>
                <FormControl fullWidth required error={!!errors.usage}>
                  <InputLabel id="usage-label">Uso</InputLabel>
                  <Select
                    labelId="usage-label"
                    id="usage"
                    name="usage"
                    label="Uso"
                    value={formData.usage}
                    onChange={handleChange}
                  >
                    {USOS.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="error.main">
                    {errors.usage}
                  </Typography>
                </FormControl>
              </Grid>

              {/* Submit */}
              <Grid item xs={12}>
                <Tooltip title="Guarda la información de la mascota">
                  <span>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<Pets />}
                      sx={{ mt: 2 }}
                    >
                      Registrar Mascota
                    </Button>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
