import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('darkMode').then(val => {
      if (val !== null) setDarkMode(val === 'true');
    });
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      AsyncStorage.setItem('darkMode', (!prev).toString());
      return !prev;
    });
  };

  const setDark = (value: boolean) => {
    setDarkMode(value);
    AsyncStorage.setItem('darkMode', value.toString());
  };

  return { darkMode, toggleDarkMode, setDark };
}