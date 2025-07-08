import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, Alert,
  TextInput, ScrollView, TouchableOpacity, ImageBackground,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import ToggleDarkMode from './component/ToggleDarkMode';
import CustomButton from './component/CustomButton';
import useDarkMode from '../hooks/useDarkMode'; // Ajout du hook global
import i18n, { setAppLanguage } from './i18n';
import { API_BASE } from '../apiBase';

const bgNight = require('../assets/bg.jpg');
const bgMorning = require('../assets/bgMorning.jpg');

// === STYLES DIRECTEMENT DANS LE FICHIER ===
const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0B162C',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B162C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
    paddingHorizontal: 24,
    paddingBottom: 18,
    backgroundColor: '#1C2942',
    borderBottomWidth: 1,
    borderBottomColor: '#3B556D',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B556D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#5FC2BA',
    fontWeight: 'bold',
    fontSize: 22,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    paddingBottom: 12,
    backgroundColor: '#0B162C',
  },
  mainCard: {
    backgroundColor: '#1C2942',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#3B556D',
    shadowOpacity: 0.21,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 7,
    borderWidth: 1.5,
    borderColor: '#3B556D',
  },
  tripTitle: {
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 22,
    marginBottom: 4,
    letterSpacing: 0.65,
    textShadowColor: '#0B162C',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  tripSub: {
    color: '#5FC2BA',
    marginBottom: 16,
    fontSize: 17,
    letterSpacing: 0.1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#5FC2BA',
    marginTop: 20,
    marginBottom: 12,
    fontSize: 19,
    letterSpacing: 1,
    textShadowColor: '#3B556D',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  roadTripBox: {
    marginBottom: 16,
    backgroundColor: "#1C2942",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3B556D",
  },
  roadTripTitle: {
    color: "#5FC2BA",
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 2,
  },
  roadTripDesc: {
    color: "#FFFFFF",
    marginBottom: 4,
    fontSize: 15,
  },
  roadTripStep: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  noStep: {
    color: "#e74c3c",
    fontSize: 15,
  },
  itemBox: {
    backgroundColor: '#1C2942',
    borderRadius: 15,
    padding: 18,
    marginBottom: 21,
    shadowColor: '#3B556D',
    shadowOpacity: 0.14,
    shadowOffset: { width: 1, height: 3 },
    shadowRadius: 7,
    elevation: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 0.7,
    borderBottomColor: '#3B556D',
    paddingBottom: 9,
  },
  input: {
    backgroundColor: '#0B162C',
    color: '#FFFFFF',
    borderRadius: 10,
    padding: 9,
    fontSize: 17,
    textAlign: 'right',
    borderWidth: 1.5,
    borderColor: '#3B556D',
    shadowColor: '#3B556D',
    shadowOpacity: 0.09,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  total: {
    color: '#5FC2BA',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 24,
    marginTop: 8,
    textAlign: 'right',
    letterSpacing: 0.8,
    backgroundColor: '#1C2942',
    paddingVertical: 11,
    borderRadius: 13,
    paddingHorizontal: 20,
    shadowColor: '#3B556D',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  button: {
    paddingVertical: 8, // réduit
    borderRadius: 10,   // plus petit
    marginVertical: 6,  // réduit
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5FC2BA',
    borderWidth: 1,
    borderColor: '#5FC2BA',
    shadowColor: '#3B556D',
    shadowOpacity: 0.17,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 7,
    elevation: 2,
  },
  buttonPrimary: {
    backgroundColor: '#5FC2BA',
    shadowColor: '#5FC2BA',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10, // réduit
    elevation: 5,     // réduit
    borderRadius: 12, // réduit
    borderWidth: 0,
  },
  buttonSecondary: {
    backgroundColor: '#3B556D',
    shadowColor: '#3B556D',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, // réduit
    elevation: 4,    // réduit
    borderRadius: 12, // réduit
    borderWidth: 0,
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
    shadowColor: '#e74c3c',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8, // réduit
    elevation: 4,    // réduit
    borderRadius: 12, // réduit
    borderWidth: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15, // réduit
    letterSpacing: 0.5, // réduit
    textTransform: 'uppercase',
    textShadowColor: '#0007',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonSpacing: {
    marginBottom: 19,
    marginTop: 8,
  },
  uniformButton: {
    minWidth: 220, // largeur minimale identique pour tous
    height: 48,    // hauteur identique pour tous
    alignSelf: 'center',
    marginVertical: 8,
  },
});

export default function HomeScreen() {
  // Remplace ton state darkMode local par le hook global :
  const { darkMode, toggleDarkMode } = useDarkMode();
  const isLight = !darkMode;

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [roadTrip, setRoadTrip] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [destination, setDestination] = useState('');
  const [lang, setLang] = useState(i18n.locale.startsWith('fr') ? 'fr' : 'en');

  // Quand on change la langue, on met à jour i18n et le state
  const toggleLang = () => {
    const nextLang = lang === 'fr' ? 'en' : 'fr';
    setAppLanguage(nextLang);
    setLang(nextLang);
  };

  const fetchData = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert(i18n.t('error'), i18n.t('not_authorized'));
      router.replace('/login');
      return;
    }

    try {
      const userRes = await fetch(`${API_BASE}/home`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await userRes.json();
      setUser(userData);

      const tripRes = await fetch(`${API_BASE}/trips/latest`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tripData = await tripRes.json();

      if (tripData.trip) {
        setTrip(tripData.trip);

        if (tripData.trip.roadTripId) {
          if (typeof tripData.trip.roadTripId === 'object') {
            setRoadTrip(tripData.trip.roadTripId);
          } else {
            try {
              const roadTripRes = await fetch(`${API_BASE}/roadtrips/${tripData.trip.roadTripId}`);
              const roadTripData = await roadTripRes.json();
              setRoadTrip(roadTripData);
            } catch (e) {
              setRoadTrip(null);
            }
          }
        } else {
          setRoadTrip(null);
        }

        if (!tripData.trip.items || tripData.trip.items.length === 0) {
          const itemsRes = await fetch(`${API_BASE}/items/${encodeURIComponent(tripData.trip.destination)}`);
          const itemSuggest = await itemsRes.json();
          const suggested = itemSuggest[0]?.items || [];
          const itemsWithQuantities = suggested.map((item: any) => ({
            name: item.name,
            quantity: item.quantity || (item.quantityPerPerson ? item.quantityPerPerson * tripData.trip.people : 1),
            price: 0
          }));

          setItems(itemsWithQuantities);

          await fetch(`${API_BASE}/trips/latest`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: itemsWithQuantities }),
          });
        } else {
          setItems(tripData.trip.items);
        }

        if (tripData.trip.customStops?.length > 0) {
          setSteps(tripData.trip.customStops);
        } else if (
          tripData.trip.roadTripId?.stops?.length > 0 ||
          roadTrip?.stops?.length > 0
        ) {
          const _stops =
            Array.isArray(tripData.trip.roadTripId?.stops)
              ? tripData.trip.roadTripId.stops
              : (Array.isArray(roadTrip?.stops) ? roadTrip.stops : []);
          setSteps(_stops);
        } else {
          setSteps([]);
        }
      } else {
        setTrip(null);
        setRoadTrip(null);
        setItems([]);
        setSteps([]);
      }
    } catch (err: any) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let t = 0;
    items.forEach(i => { t += (i.price || 0) * (i.quantity || 1); });
    setTotal(t);
  }, [items]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = () => {
    setItems([{ name: '', quantity: 1, price: 0 }, ...items]);
  };

  const handleItemChange = (idx: number, key: string, value: string) => {
    const newItems = [...items];
    if (key === 'quantity') {
      newItems[idx][key] = parseInt(value) || 1;
    } else if (key === 'price') {
      newItems[idx][key] = parseFloat(value) || 0;
    } else {
      newItems[idx][key] = value;
    }
    setItems(newItems);
  };

  const handleDeleteItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const saveBudget = async () => {
    const token = await AsyncStorage.getItem('token');
    await fetch(`${API_BASE}/trips/latest`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items, totalBudget: total }),
    });
    Alert.alert(i18n.t('success'), i18n.t('budget_updated'));
  };

  // Palette claire pour le light mode
  const lightPalette = {
    header: { backgroundColor: '#4a90e2', borderBottomColor: '#b3d7f7' },
    avatar: { backgroundColor: '#5dade2' },
    avatarText: { color: '#fff' },
    title: { color: '#fff' },
    mainCard: { backgroundColor: 'rgba(255,255,255,0.65)', borderColor: '#b3d7f7', shadowColor: '#4a90e2' },
    tripTitle: { color: '#223a5e', textShadowColor: '#b3d7f7' },
    tripSub: { color: '#4a90e2' },
    sectionTitle: { color: '#4a90e2', textShadowColor: '#b3d7f7' },
    roadTripBox: { backgroundColor: "#eaf6fb", borderColor: "#b3d7f7" },
    roadTripTitle: { color: "#4a90e2" },
    roadTripDesc: { color: "#223a5e" },
    roadTripStep: { color: "#223a5e" },
    itemBox: { backgroundColor: '#eaf6fb', shadowColor: '#b3d7f7' },
    itemRow: { borderBottomColor: '#b3d7f7' },
    input: { backgroundColor: '#f4f8fb', color: '#223a5e', borderColor: '#b3d7f7', shadowColor: '#b3d7f7' },
    total: { color: '#4a90e2', backgroundColor: '#eaf6fb', shadowColor: '#b3d7f7' },
    button: { backgroundColor: '#4a90e2', borderColor: '#4a90e2', shadowColor: '#5dade2' },
    buttonPrimary: { backgroundColor: '#5dade2', shadowColor: '#5dade2' },
    buttonSecondary: { backgroundColor: '#4a90e2', shadowColor: '#4a90e2' },
    buttonDanger: { backgroundColor: '#e74c3c', shadowColor: '#e74c3c' },
    buttonText: { color: '#fff' },
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ImageBackground source={darkMode ? bgNight : bgMorning} style={{ flex: 1 }} resizeMode="cover">
      <View style={{ flex: 1 }}>
        {/* HEADER MODERNE */}
        <View style={[styles.header, isLight && {
          backgroundColor: '#EBF2FA',
          borderBottomColor: '#B3D7F7'
        }]}>
          <View style={[styles.avatar, isLight && { backgroundColor: '#B3D7F7' }]}>
            <Text style={[styles.avatarText, isLight && { color: '#06668C' }]}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </Text>
          </View>
          <Text style={[styles.title, isLight && { color: '#06668C' }]}>{i18n.t('home')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ToggleDarkMode darkMode={darkMode} onToggle={toggleDarkMode} />
            <TouchableOpacity
              onPress={toggleLang}
              style={{
                marginHorizontal: 10,
                backgroundColor: '#fff',
                borderRadius: 16,
                paddingVertical: 4,
                paddingHorizontal: 12,
                borderWidth: 1,
                borderColor: '#b3d7f7',
              }}
            >
              <Text style={{ color: '#427AA1', fontWeight: 'bold' }}>
                {lang === 'fr' ? 'FR 🇫🇷' : 'EN 🇬🇧'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/pageProfil')}>
              <Text style={{ color: isLight ? '#06668C' : '#2ef48c', fontWeight: 'bold', fontSize: 18 }}>
                {i18n.t('profile')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            style={{ padding: 18, paddingTop: 10 }}
            contentContainerStyle={{ paddingBottom: 60 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* CARD PRINCIPALE */}
            <View style={[styles.mainCard, isLight && lightPalette.mainCard]}>
              <Text style={[styles.tripTitle, isLight && lightPalette.tripTitle]}>
                {i18n.t('welcome', { name: user?.name })}
              </Text>
              <Text style={[styles.tripSub, isLight && lightPalette.tripSub]}>
                {i18n.t('your_email', { email: user?.email })}
              </Text>

              {trip ? (
                <>
                  <Text style={[styles.tripTitle, isLight && lightPalette.tripTitle]}>
                    {i18n.t('last_trip', { destination: trip.destination })}
                  </Text>
                  <Text style={[styles.tripSub, isLight && lightPalette.tripSub]}>
                    {i18n.t('for_people_days', { people: trip.people, days: trip.days })}
                  </Text>

                  {roadTrip ? (
                    <View style={[styles.roadTripBox, isLight && lightPalette.roadTripBox]}>
                      <Text style={[styles.roadTripTitle, isLight && lightPalette.roadTripTitle]}>
                        {i18n.t('customize_trip')} : {roadTrip.name}
                      </Text>
                      <Text style={[styles.roadTripDesc, isLight && lightPalette.roadTripDesc]}>
                        {roadTrip.description}
                      </Text>
                      <Text style={{ color: isLight ? "#4a90e2" : "#bbb", fontWeight: "bold" }}>
                        {i18n.t('steps')} :
                      </Text>
                      {steps?.length > 0 ? steps.map((s, idx) => (
                        <Text key={idx} style={[styles.roadTripStep, isLight && lightPalette.roadTripStep]}>
                          - {s.name}
                        </Text>
                      )) : (
                        <Text style={styles.noStep}>{i18n.t('no_steps')}</Text>
                      )}
                    </View>
                  ) : null}

                  <Text style={[styles.sectionTitle, isLight && lightPalette.sectionTitle]}>
                    {i18n.t('items')} :
                  </Text>

                  <CustomButton
                    label={i18n.t('add_item')}
                    icon="plus"
                    iconLib="Feather"
                    color="#3B556D"
                    onPress={handleAddItem}
                    style={styles.uniformButton}
                    isLight={isLight}
                  />

                  <View style={[styles.itemBox, isLight && lightPalette.itemBox]}>
                    {items.length === 0 && (
                      <Text style={{ color: isLight ? "#4a90e2" : "#fff", fontStyle: "italic", textAlign: "center" }}>
                        {i18n.t('no_items')}
                      </Text>
                    )}
                    {items.map((item, idx) => (
                      <View key={idx} style={[styles.itemRow, { alignItems: 'center' }]}>
                        <TextInput
                          style={[styles.input, isLight && lightPalette.input, { flex: 2, marginRight: 4 }]}
                          placeholder={i18n.t('items')}
                          placeholderTextColor={isLight ? "#4a90e2" : "#888"}
                          value={item.name}
                          onChangeText={val => handleItemChange(idx, 'name', val)}
                        />
                        <TextInput
                          style={[styles.input, isLight && lightPalette.input, { flex: 1, marginRight: 4 }]}
                          placeholder={i18n.t('quantity')}
                          placeholderTextColor={isLight ? "#4a90e2" : "#888"}
                          keyboardType="numeric"
                          value={item.quantity?.toString() || ''}
                          onChangeText={val => handleItemChange(idx, 'quantity', val)}
                        />
                        <TextInput
                          style={[styles.input, isLight && lightPalette.input, { flex: 1, marginRight: 4 }]}
                          placeholder={i18n.t('price') + " €"}
                          placeholderTextColor={isLight ? "#4a90e2" : "#888"}
                          keyboardType="numeric"
                          value={item.price?.toString() || ''}
                          onChangeText={val => handleItemChange(idx, 'price', val)}
                        />
                        <TouchableOpacity onPress={() => handleDeleteItem(idx)} style={{ padding: 4 }}>
                          <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 18 }}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>

                  <Text style={[styles.total, isLight && lightPalette.total]}>
                    {i18n.t('total')} : {total.toFixed(2)} €
                  </Text>

                  <View style={styles.buttonSpacing}>
                    <CustomButton
                      label={i18n.t('save_budget')}
                      icon="save"
                      iconLib="Feather"
                      color="#5FC2BA"
                      isLight={isLight}
                      onPress={saveBudget}
                      style={styles.uniformButton}
                    />
                  </View>

                  <View style={styles.buttonSpacing}>
                    <CustomButton
                      label={i18n.t('customize_trip')}
                      icon="map"
                      iconLib="Feather"
                      color="#5FC2BA"
                      isLight={isLight}
                      onPress={() => {
                        if (steps?.length > 0) {
                          router.push({
                            pathname: '/CarteRoadTrip',
                            params: { stopsJson: JSON.stringify(steps) },
                          });
                        } else {
                          Alert.alert(i18n.t('error'), i18n.t('no_steps'));
                        }
                      }}
                      style={styles.uniformButton}
                    />
                  </View>
                </>
              ) : (
                <Text style={{ color: isLight ? '#223a5e' : '#fff', marginTop: 24, textAlign: 'center' }}>
                  {i18n.t('no_trip')}
                </Text>
              )}
            </View>

            <View style={{ height: 24 }} />

            <View style={styles.buttonSpacing}>
              <CustomButton
                label={i18n.t('plan_trip')}
                icon="calendar"
                iconLib="Feather"
                color="#5FC2BA"
                isLight={isLight}
                onPress={() => router.push('/planifier')}
                style={styles.uniformButton}
              />
            </View>

            <CustomButton
              label={i18n.t('logout')}
              icon="log-out"
              iconLib="Feather"
              color="#e74c3c"
              isLight={isLight}
              onPress={async () => {
                await AsyncStorage.removeItem('token');
                router.replace('/login');
              }}
              style={styles.uniformButton}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}