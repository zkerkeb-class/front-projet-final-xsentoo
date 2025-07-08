import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../apiBase';

const bg = require('../assets/bg.jpg');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: 'rgba(14,21,36,0.45)', // <--- opacité plus faible
  },
  title: {
    color: '#2ef48c',
    fontWeight: 'bold',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 1,
  },
  label: {
    color: '#2ef48c',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#232b3a',
    color: '#fff',
    borderRadius: 10,
    marginVertical: 4,
    padding: 12,
    fontSize: 16,
    borderWidth: 1.2,
    borderColor: '#273a5a',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2ef48c',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
    shadowColor: '#2ef48c',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#1a2335',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.7,
  },
  secondaryButton: {
    backgroundColor: '#232b3a',
    borderRadius: 18,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.2,
    borderColor: '#273a5a',
  },
  secondaryButtonText: {
    color: '#2ef48c',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default function LoginScreen() {
  useAuthRedirect(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('🔵 Réponse serveur :', data);

      if (!res.ok) {
        // Affiche le message du backend, par exemple "Compte bloqué"
        Alert.alert('Erreur', data.message || 'Erreur');
        return;
      }

      await AsyncStorage.setItem('token', data.token);
      Alert.alert('Connexion réussie ✅');
      router.replace('/home');
    } catch (err: any) {
      console.log('❌ Erreur dans handleLogin :', err);
      Alert.alert('Erreur', err.message);
    }
  };

  return (
    <ImageBackground source={bg} style={{ flex: 1 }} resizeMode="cover">
      <View style={styles.container}>
        <Text style={styles.title}>Connexion</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          placeholder="Votre email"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder="Votre mot de passe"
          placeholderTextColor="#888"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Se connecter</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.secondaryButtonText}>Créer un compte</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}