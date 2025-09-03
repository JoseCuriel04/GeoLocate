const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000; // Usa el puerto de Render o el 5000 local

app.use(cors());

// Ruta de ejemplo
app.get('/api/hello', (req, res) => {
  res.json({ message: '¡Hola desde el backend en Render!' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
