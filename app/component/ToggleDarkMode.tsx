import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type ToggleDarkModeProps = {
  darkMode: boolean;
  onToggle: () => void;
  colorDark?: string;
  colorLight?: string;
};

export default function ToggleDarkMode({
  darkMode,
  onToggle,
  colorDark = '#2ef48c',
  colorLight = '#4a90e2',
}: ToggleDarkModeProps) {
  return (
    <TouchableOpacity onPress={onToggle} style={styles.button}>
      <Text style={[
        styles.icon,
        { color: darkMode ? colorDark : colorLight }
      ]}>
        {darkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});