import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './App.css';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  const [ipInfo, setIpInfo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Obtener información de la IP
  useEffect(() => {
    axios.get('http://ip-api.com/json/')
      .then((response) => {
        setIpInfo(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener información de la IP:', error);
      });
  }, []);

  // Obtener ubicación exacta del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setLoading(false);
        },
        (error) => {
          console.error('Error al obtener la ubicación:', error);
          setLoading(false);
        }
      );
    } else {
      console.error('La geolocalización no está soportada en este navegador.');
      setLoading(false);
    }
  }, []);

  return (
    <div className="app-container">
      <div className="api-card">
        <h1 className="api-title">Geolocalización en Tiempo Real</h1>

        <div className="api-section">
          <h2 className="api-subtitle">🌐 Información de la IP</h2>
          <div className="api-box">
            {ipInfo && ipInfo.status === 'success' ? (
              <div className="api-data">
                <p><strong>País:</strong> <span>{ipInfo.country}</span></p>
                <p><strong>Ciudad:</strong> <span>{ipInfo.city}</span></p>
                <p><strong>Proveedor:</strong> <span>{ipInfo.isp}</span></p>
                <p><strong>Latitud/Longitud (IP):</strong> <span>{ipInfo.lat}, {ipInfo.lon}</span></p>
              </div>
            ) : (
              <p>No se pudo obtener la información de la IP.</p>
            )}
          </div>
        </div>

        <div className="api-section">
          <h2 className="api-subtitle">📍 Tu Ubicación Exacta</h2>
          <div className="map-container">
            {loading ? (
              <p className="loading-text">Solicitando permiso para acceder a tu ubicación...</p>
            ) : userLocation ? (
              <MapContainer
                center={[userLocation.lat, userLocation.lon]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={[userLocation.lat, userLocation.lon]}>
                  <Popup>
                    Aquí estás (ubicación exacta).
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <p className="error-text">Permite el acceso a tu ubicación para ver el mapa.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
