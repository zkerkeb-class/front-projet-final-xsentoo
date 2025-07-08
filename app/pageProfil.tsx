import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import CustomButton from './component/CustomButton';
import useDarkMode from '../hooks/useDarkMode';
import { API_BASE } from '../apiBase';

const bg = require('../assets/bg.jpg');
const bgMorning = require('../assets/bgMorning.jpg');

const lightPalette = {
  background: { backgroundColor: '#F7FAFC' },
  header: { backgroundColor: '#EBF2FA', borderBottomColor: '#B3D7F7' },
  headerTitle: { color: '#06668C' },
  card: { backgroundColor: 'rgba(255,255,255,0.65)', borderColor: '#b3d7f7', shadowColor: '#4a90e2' },
  sectionTitle: { color: '#4a90e2' },
  label: { color: '#06668C' },
  input: { backgroundColor: '#f4f8fb', color: '#223a5e', borderColor: '#b3d7f7', shadowColor: '#b3d7f7' },
  button: {
    backgroundColor: '#5FC2BA',
    borderColor: '#5FC2BA',
    shadowColor: '#3B556D',
    shadowOpacity: 0.17,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 7,
    elevation: 2,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5, textTransform: 'uppercase' },
  tripCard: { backgroundColor: '#eaf6fb', borderColor: '#b3d7f7' },
  tripTitle: { color: '#223a5e' },
  tripSub: { color: '#4a90e2' },
  tripLabel: { color: '#06668C' },
  tripSection: { color: '#4a90e2' },
  tripStory: { color: '#223a5e' },
};

const darkPalette = {
  background: { backgroundColor: '#0e1524' },
  header: { backgroundColor: 'rgba(30,44,80,0.95)', borderBottomColor: '#232c4a' },
  headerTitle: { color: '#fff' },
  card: { backgroundColor: '#1a2335', borderColor: '#232c4a', shadowColor: '#132040' },
  sectionTitle: { color: '#2ef48c' },
  label: { color: '#2ef48c' },
  input: { backgroundColor: '#232b3a', color: '#fff', borderColor: '#273a5a' },
  button: { backgroundColor: '#3B556D', borderColor: '#3B556D', shadowColor: '#191e2e' },
  buttonText: { color: '#fff' },
  tripCard: { backgroundColor: '#181f2a', borderColor: '#232c4a' },
  tripTitle: { color: '#fff' },
  tripSub: { color: '#bbb' },
  tripLabel: { color: '#aaa' },
  tripSection: { color: '#bbb' },
  tripStory: { color: '#fff' },
};

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#0e1524' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingHorizontal: 24,
    paddingBottom: 18,
    backgroundColor: 'rgba(30,44,80,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#232c4a',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 10,
  },
  headerBack: {
    marginRight: 18,
    backgroundColor: '#222a36',
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    letterSpacing: 1,
  },
  card: {
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    shadowColor: '#132040',
    shadowOpacity: 0.21,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 7,
    borderWidth: 1.5,
    borderColor: '#232c4a',
  },
  sectionTitle: {
    color: '#2ef48c',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  label: { color: '#aaa', fontSize: 15, marginBottom: 2 },
  input: {
    borderRadius: 10,
    marginVertical: 4,
    padding: 12,
    fontSize: 16,
    borderWidth: 1.2,
  },
  tripCard: {
    borderRadius: 18,
    marginBottom: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 8,
    elevation: 3,
  },
  tripTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 2,
  },
  tripSub: { color: '#bbb', fontSize: 15 },
  tripLabel: { color: '#aaa', marginBottom: 5, fontSize: 14 },
  tripSection: { color: '#bbb', marginBottom: 3, fontWeight: 'bold', fontSize: 15 },
  tripStory: { color: '#fff', marginTop: 7, fontStyle: "italic", fontSize: 15 },
});

export default function PageProfil() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isLight = !darkMode;
  const palette = isLight ? lightPalette : darkPalette;

  // States (exemple, adapte selon ton backend)
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState({ old: '', new: '' });
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [tripStory, setTripStory] = useState('');
  const [savingStory, setSavingStory] = useState(false);
  const [deletingStoryId, setDeletingStoryId] = useState<string | null>(null);
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const url = `${API_BASE}/user/me`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('API CALL:', url, 'Status:', res.status);
      if (!res.ok) {
        const text = await res.text();
        console.log('Response:', text);
        throw new Error('Impossible de charger le profil');
      }
      const data = await res.json();
      setUser(data.user);
      setEditName(data.user.name);
      setEditEmail(data.user.email);
      setTrips(data.trips || []);
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, []);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleEditProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName, email: editEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur update');
      Alert.alert('Succès', 'Profil mis à jour');
      fetchProfile();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleEditPassword = async () => {
    if (!editPassword.old || !editPassword.new) {
      Alert.alert('Erreur', 'Champs requis');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE}/user/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: editPassword.old, newPassword: editPassword.new }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur mot de passe');
      Alert.alert('Succès', 'Mot de passe modifié');
      setEditPassword({ old: '', new: '' });
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    }
  };

  const handleEditTripStory = async (tripId: string) => {
    if (!tripStory.trim()) {
      Alert.alert('Erreur', 'Le texte de l\'histoire ne peut pas être vide.');
      return;
    }
    setSavingStory(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_BASE}/trips/story`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ tripId, story: tripStory }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur sauvegarde histoire');
      Alert.alert('Succès', 'Histoire enregistrée');
      setEditingTripId(null);
      setTripStory('');
      fetchProfile();
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setSavingStory(false);
    }
  };

  const handleDeleteTripStory = async (tripId: string) => {
    Alert.alert(
      'Confirmation',
      'Supprimer l’histoire de ce voyage ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive', onPress: async () => {
            setDeletingStoryId(tripId);
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`${API_BASE}/trips/story`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ tripId, story: '' }),
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data.message || 'Erreur suppression histoire');
              Alert.alert('Succès', 'Histoire supprimée');
              setEditingTripId(null);
              setTripStory('');
              fetchProfile();
            } catch (err: any) {
              Alert.alert('Erreur', err.message);
            } finally {
              setDeletingStoryId(null);
            }
          }
        }
      ]
    );
  };

  const handleDeleteTrip = async (tripId: string) => {
    Alert.alert(
      'Supprimer ce voyage',
      'Confirmer la suppression définitive de ce voyage ? (Action irréversible)',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer', style: 'destructive', onPress: async () => {
            setDeletingTripId(tripId);
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await fetch(`${API_BASE}/trips/${tripId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
              });

              let data = null;
              try {
                data = await res.json();
              } catch {
                throw new Error("Erreur serveur : réponse inattendue ou non supportée.");
              }

              if (!res.ok) throw new Error(data?.message || 'Erreur suppression voyage');
              Alert.alert('Voyage supprimé', 'Ce voyage a bien été supprimé.');
              fetchProfile();
            } catch (err: any) {
              Alert.alert('Erreur', err.message);
            } finally {
              setDeletingTripId(null);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' }}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  return (
    <ImageBackground source={darkMode ? bg : bgMorning} style={[styles.background, palette.background]} resizeMode="cover">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flex: 1 }}>
          {/* HEADER */}
          <View style={[styles.header, palette.header]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
              <Text style={{ color: '#27ae60', fontSize: 22, fontWeight: 'bold' }}>←</Text>
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
              <Text style={[styles.headerTitle, palette.headerTitle]}>Profil</Text>
            </View>
          </View>
          <ScrollView style={{ padding: 18, paddingTop: 10 }} contentContainerStyle={{ paddingBottom: 60 }}>
            {/* PROFIL INFOS */}
            <View style={[styles.card, palette.card]}>
              <Text style={[styles.sectionTitle, palette.sectionTitle]}>Mes infos</Text>
              <Text style={[styles.label, palette.label]}>Nom</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                style={[styles.input, palette.input]}
                placeholder="Nom"
                placeholderTextColor={isLight ? "#4a90e2" : "#666"}
              />
              <Text style={[styles.label, palette.label]}>Email</Text>
              <TextInput
                value={editEmail}
                onChangeText={setEditEmail}
                style={[styles.input, palette.input]}
                placeholder="Email"
                placeholderTextColor={isLight ? "#4a90e2" : "#666"}
                autoCapitalize="none"
              />
              <CustomButton
                label="Sauvegarder Profil"
                icon="save"
                iconLib="Feather"
                onPress={handleEditProfile}
                isLight={isLight}
                style={{ alignSelf: 'center' }}
              />
            </View>

            {/* CHANGER MOT DE PASSE */}
            <View style={[styles.card, palette.card]}>
              <Text style={[styles.sectionTitle, palette.sectionTitle]}>Modifier mot de passe</Text>
              <TextInput
                placeholder="Ancien mot de passe"
                secureTextEntry
                value={editPassword.old}
                onChangeText={t => setEditPassword({ ...editPassword, old: t })}
                style={[styles.input, palette.input]}
                placeholderTextColor={isLight ? "#4a90e2" : "#666"}
              />
              <TextInput
                placeholder="Nouveau mot de passe"
                secureTextEntry
                value={editPassword.new}
                onChangeText={t => setEditPassword({ ...editPassword, new: t })}
                style={[styles.input, palette.input]}
                placeholderTextColor={isLight ? "#4a90e2" : "#666"}
              />
              <CustomButton
                label="Modifier mot de passe"
                icon="key"
                iconLib="Feather"
                onPress={handleEditPassword}
                isLight={isLight}
                style={{ alignSelf: 'center' }}
              />
            </View>

            {/* MES VOYAGES */}
            <Text style={[styles.sectionTitle, palette.sectionTitle]}>Mes voyages</Text>
            {trips.length === 0 && (
              <Text style={{ color: isLight ? '#427AA1' : '#888', fontStyle: 'italic', marginBottom: 18 }}>Aucun voyage trouvé.</Text>
            )}
            {trips.map(trip => (
              <View key={trip._id} style={[styles.tripCard, palette.tripCard]}>
                <Text style={[styles.tripTitle, palette.tripTitle]}>{trip.destination}</Text>
                <Text style={[styles.tripSub, palette.tripSub]}>
                  {trip.days} jours, {trip.people} personnes
                </Text>
                <Text style={[styles.tripLabel, palette.tripLabel]}>Départ : {trip.departureCountry || 'NC'}</Text>
                <Text style={[styles.tripSection, palette.tripSection]}>Histoire :</Text>
                {editingTripId === trip._id ? (
                  <>
                    <TextInput
                      style={[{ borderRadius: 8, padding: 10, minHeight: 60, fontSize: 15 }, palette.input]}
                      multiline
                      value={tripStory}
                      onChangeText={setTripStory}
                      placeholder="Raconte ton road trip ici..."
                      placeholderTextColor={isLight ? "#4a90e2" : "#666"}
                    />
                    <TouchableOpacity
                      style={{
                        backgroundColor: '#27ae60',
                        borderRadius: 8,
                        padding: 11,
                        marginTop: 7,
                        alignItems: 'center',
                        opacity: savingStory ? 0.7 : 1,
                      }}
                      disabled={savingStory}
                      onPress={() => handleEditTripStory(trip._id)}
                    >
                      <Text style={{ color: '#fff', fontSize: 15 }}>
                        {savingStory ? 'Enregistrement...' : 'Sauvegarder histoire'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ backgroundColor: '#999', borderRadius: 8, padding: 11, marginTop: 7, alignItems: 'center' }}
                      onPress={() => { setEditingTripId(null); setTripStory(''); }}
                    >
                      <Text style={{ color: '#222', fontSize: 15 }}>Annuler</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <CustomButton
                      label={trip.story ? 'Modifier mon histoire' : 'Ajouter une histoire'}
                      icon={trip.story ? 'edit' : 'plus'}
                      iconLib="Feather"
                      isLight={isLight}
                      onPress={() => { setEditingTripId(trip._id); setTripStory(trip.story || ''); }}
                      style={{ alignSelf: 'center' }}
                    />
                    {trip.story && (
                      <CustomButton
                        label={deletingStoryId === trip._id ? 'Suppression...' : "Supprimer l'histoire"}
                        icon="trash"
                        iconLib="Feather"
                        isLight={isLight}
                        onPress={() => handleDeleteTripStory(trip._id)}
                        style={{
                          alignSelf: 'center',
                          marginTop: 7,
                          opacity: deletingStoryId === trip._id ? 0.5 : 1,
                          // Optionnel : largeur comme les autres boutons
                        }}
                        danger // <-- à ajouter dans CustomButton pour gérer la couleur rouge
                      />
                    )}
                  </>
                )}
                {trip.story && editingTripId !== trip._id && (
                  <Text style={[styles.tripStory, palette.tripStory]}>{trip.story}</Text>
                )}
                {/* === SUPPRIMER LE VOYAGE === */}
                <CustomButton
                  label={deletingTripId === trip._id ? 'Suppression...' : "Supprimer ce voyage"}
                  icon="trash-2"
                  iconLib="Feather"
                  isLight={isLight}
                  onPress={() => handleDeleteTrip(trip._id)}
                  style={{
                    alignSelf: 'center',
                    opacity: deletingTripId === trip._id ? 0.5 : 1,
                  }}
                />
              </View>
            ))}

            {/* BOUTON DECONNEXION */}
            <CustomButton
              label="Se déconnecter"
              icon="log-out"
              iconLib="Feather"
              isLight={isLight}
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                router.replace('/login');
              }}
              style={{ alignSelf: 'center' }}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}