import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, Linking, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { API_BASE } from '../apiBase';

export default function CarteRoadTrip() {
  const [loading, setLoading] = useState(true);
  const [stops, setStops] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [showRename, setShowRename] = useState(false);
  const [region, setRegion] = useState<any>({
    latitude: 7.2906,
    longitude: 80.6337,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });
  const [zoom, setZoom] = useState(3);
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTrip = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await fetch(`${API_BASE}/trips/latest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Impossible de récupérer le road trip');
        const data = await res.json();

        let _stops = [];
        if (data.trip.customStops?.length > 0) {
          _stops = data.trip.customStops.map((s: any) => ({
            name: s.name,
            latitude: s.latitude ?? s.coordinates?.lat,
            longitude: s.longitude ?? s.coordinates?.lng,
            description: s.description ?? '',
          }));
        } else if (data.trip.roadTripId?.stops?.length > 0) {
          _stops = data.trip.roadTripId.stops.map((s: any) => ({
            name: s.name,
            latitude: s.coordinates?.lat,
            longitude: s.coordinates?.lng,
            description: s.description ?? '',
          }));
        }

        setStops(_stops);
        if (_stops.length) {
          setRegion({
            latitude: _stops[0].latitude,
            longitude: _stops[0].longitude,
            latitudeDelta: 3,
            longitudeDelta: 3,
          });
        }
      } catch (e: any) {
        Alert.alert('Erreur', e.message);
      }
      setLoading(false);
    };
    fetchTrip();
  }, []);

  const polylineCoords = stops
    .filter(s => s.latitude && s.longitude)
    .map(s => ({ latitude: s.latitude, longitude: s.longitude }));

  const handleMapPress = (e: any) => {
    const coord = e.nativeEvent.coordinate;
    setStops([
      ...stops,
      {
        name: `Arrêt ${stops.length + 1}`,
        latitude: coord.latitude,
        longitude: coord.longitude,
      },
    ]);
    setSelectedIndex(null);
    setShowRename(false);
  };

  const handleMarkerDragEnd = (index: number, e: any) => {
    const coord = e.nativeEvent.coordinate;
    const newStops = [...stops];
    newStops[index] = { ...newStops[index], latitude: coord.latitude, longitude: coord.longitude };
    setStops(newStops);
  };

  const handleDeleteStop = (index: number) => {
    setStops(prev => prev.filter((_, i) => i !== index));
    setSelectedIndex(null);
    setShowRename(false);
  };

  const handleSave = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const stopsToSave = stops.map(({ name, latitude, longitude, description }) => ({
        name, latitude, longitude, description,
      }));
      const res = await fetch(`${API_BASE}/trips/latest/stops`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ stops: stopsToSave }),
      });
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde');
      Alert.alert('Sauvegardé', 'Tes étapes personnalisées ont été sauvegardées !');
      router.replace('/home');
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    }
  };

  const handleZoom = (incr: number) => {
    setZoom(prev => {
      let next = prev + incr;
      if (next < 1) next = 1.5;
      if (next > 10) next = 10;
      setRegion((old: any) => ({
        ...old,
        latitudeDelta: 3 / next,
        longitudeDelta: 3 / next,
      }));
      return next;
    });
  };

  const handleRecenter = () => {
    if (stops.length > 0) {
      mapRef.current?.animateToRegion({
        latitude: stops[0].latitude,
        longitude: stops[0].longitude,
        latitudeDelta: 3 / zoom,
        longitudeDelta: 3 / zoom,
      }, 500);
    }
  };

  const handleRename = () => {
    if (selectedIndex !== null && editName.trim()) {
      const newStops = [...stops];
      newStops[selectedIndex].name = editName.trim();
      setStops(newStops);
      setShowRename(false);
      setEditName('');
      setSelectedIndex(null);
    }
  };

  const handleOpenSingleStop = (stop: any) => {
    if (!stop) return;
    let url = '';
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${stop.latitude},${stop.longitude}&dirflg=d`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=${stop.latitude},${stop.longitude}`;
    }
    Linking.openURL(url).catch(() => {
      Alert.alert('Erreur', 'Impossible d’ouvrir l’application Maps.');
    });
  };

  const handleOpenFullItinerary = () => {
    if (stops.length === 0) {
      Alert.alert('Erreur', 'Aucune étape à afficher.');
      return;
    }
    if (Platform.OS === 'ios') {
      let url = `http://maps.apple.com/?saddr=${stops[0].latitude},${stops[0].longitude}`;
      if (stops.length > 1) {
        url += `&daddr=`;
        url += stops
          .slice(1)
          .map(s => `${s.latitude},${s.longitude}`)
          .join('+to:');
      }
      Linking.openURL(url);
    } else {
      let url = `https://www.google.com/maps/dir/?api=1&travelmode=driving`;
      url += `&origin=${stops[0].latitude},${stops[0].longitude}`;
      url += `&destination=${stops[stops.length - 1].latitude},${stops[stops.length - 1].longitude}`;
      if (stops.length > 2) {
        const waypoints = stops
          .slice(1, -1)
          .map(s => `${s.latitude},${s.longitude}`)
          .join('|');
        url += `&waypoints=${encodeURIComponent(waypoints)}`;
      }
      Linking.openURL(url);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          initialRegion={region}
          region={region}
          onPress={handleMapPress}
        >
          {polylineCoords.length >= 2 && (
            <Polyline coordinates={polylineCoords} strokeColor="#27ae60" strokeWidth={4} />
          )}
          {stops.map((stop, idx) =>
            stop.latitude && stop.longitude ? (
              <Marker
                key={idx}
                coordinate={{ latitude: stop.latitude, longitude: stop.longitude }}
                title={stop.name}
                description={stop.description}
                draggable
                onDragEnd={e => handleMarkerDragEnd(idx, e)}
                onPress={() => {
                  setSelectedIndex(idx);
                  setShowRename(false);
                }}
                onCalloutPress={() => {
                  setSelectedIndex(idx);
                  setShowRename(false);
                }}
              />
            ) : null
          )}
        </MapView>

        {/* Barre flottante de boutons + sauvegarder */}
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            left: 16,
            right: 16,
            backgroundColor: '#1a2335',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 12,
            elevation: 10,
            paddingVertical: 12,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: 'center', flexGrow: 1 }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#2980b9",
                borderRadius: 18,
                paddingVertical: 10,
                paddingHorizontal: 18,
                marginRight: 10,
              }}
              onPress={handleOpenFullItinerary}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Itinéraire Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleZoom(1)} style={{ marginHorizontal: 4, backgroundColor: '#222', borderRadius: 18, padding: 10 }}>
              <Text style={{ fontSize: 18, color: '#fff' }}>＋</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleZoom(-1)} style={{ marginHorizontal: 4, backgroundColor: '#222', borderRadius: 18, padding: 10 }}>
              <Text style={{ fontSize: 18, color: '#fff' }}>－</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRecenter} style={{ marginHorizontal: 4, backgroundColor: '#fff', borderRadius: 18, padding: 10, borderWidth: 1, borderColor: '#aaa' }}>
              <Image source={{ uri: "https://cdn-icons-png.flaticon.com/512/287/287221.png" }} style={{ width: 26, height: 26 }} />
            </TouchableOpacity>
            {selectedIndex !== null && stops[selectedIndex] && (
              <>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#27ae60",
                    borderRadius: 18,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    marginLeft: 8,
                  }}
                  onPress={() => {
                    setEditName(stops[selectedIndex].name);
                    setShowRename(true);
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Renommer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#e74c3c",
                    borderRadius: 18,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    marginLeft: 8,
                  }}
                  onPress={() => handleDeleteStop(selectedIndex)}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Supprimer</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#1abc9c",
                    borderRadius: 18,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    marginLeft: 8,
                  }}
                  onPress={() => handleOpenSingleStop(stops[selectedIndex])}
                >
                  <Text style={{ color: "#fff", fontSize: 15 }}>Arrêt seul</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Sauvegarder */}
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                borderRadius: 18,
                paddingVertical: 10,
                paddingHorizontal: 20,
                marginLeft: 20,
              }}
              onPress={handleSave}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Sauvegarder</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {showRename && selectedIndex !== null && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: "#eee", padding: 8, marginHorizontal: 16, borderRadius: 8, marginBottom: 10 }}>
            <TextInput
              style={{ backgroundColor: "#fff", flex: 1, borderRadius: 8, paddingHorizontal: 8, marginRight: 6 }}
              value={editName}
              onChangeText={setEditName}
              placeholder="Nouveau nom"
              autoFocus
            />
            <TouchableOpacity onPress={handleRename} style={{ marginLeft: 8, backgroundColor: '#27ae60', padding: 8, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>OK</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowRename(false)} style={{ marginLeft: 8, backgroundColor: '#e74c3c', padding: 8, borderRadius: 8 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Annuler</Text>
            </TouchableOpacity>
          </View>
        )}

        
        {stops.length === 0 && (
          <Text style={{ textAlign: 'center', color: 'red', marginTop: 8 }}>
            Aucune étape à afficher
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}