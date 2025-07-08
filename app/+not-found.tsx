import React from 'react';
import { View, Text } from 'react-native';

export default function NotFound() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Cette page n'existe pas 😢</Text>
    </View>
  );
}