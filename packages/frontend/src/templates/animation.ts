export const animationTemplate = `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [scale, setScale] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);

  const animate = () => {
    setScale(scale === 1 ? 1.5 : 1);
    setRotation(rotation + 45);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Animation Demo</Text>
      
      <View 
        style={[
          styles.box,
          {
            transform: [
              { scale },
              { rotate: rotation + 'deg' }
            ],
            transition: 'all 0.3s ease'
          }
        ]}
      >
        <Text style={styles.boxText}>Animate Me!</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={animate}>
        <Text style={styles.buttonText}>Trigger Animation</Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.infoText}>Scale: {scale.toFixed(1)}x</Text>
        <Text style={styles.infoText}>Rotation: {rotation}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  box: {
    width: 150,
    height: 150,
    backgroundColor: '#4ecca3',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#e94560',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  info: {
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    marginVertical: 4,
    textAlign: 'center',
  },
});`;
