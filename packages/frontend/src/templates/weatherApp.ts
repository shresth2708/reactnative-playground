export const weatherAppTemplate = `import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    // Simulated weather data
    setTimeout(() => {
      setWeather({
        temp: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 3)],
        humidity: Math.floor(Math.random() * 40) + 40,
        wind: Math.floor(Math.random() * 20) + 5
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌤️ Weather App</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city name"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={fetchWeather}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4ECDC4" style={styles.loader} />
      ) : weather ? (
        <View style={styles.weatherCard}>
          <Text style={styles.cityName}>{city}</Text>
          <Text style={styles.temp}>{weather.temp}°C</Text>
          <Text style={styles.condition}>{weather.condition}</Text>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{weather.humidity}%</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{weather.wind} km/h</Text>
            </View>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchBox: {
    flexDirection: 'row',
    padding: 20,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  searchBtn: {
    backgroundColor: '#4ECDC4',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 50,
  },
  weatherCard: {
    margin: 20,
    backgroundColor: '#16213e',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 10,
  },
  temp: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginVertical: 20,
  },
  condition: {
    fontSize: 20,
    color: '#a0a0a0',
    marginBottom: 30,
  },
  details: {
    flexDirection: 'row',
    gap: 40,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#a0a0a0',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});`;
