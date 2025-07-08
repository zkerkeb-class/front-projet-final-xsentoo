// app/index.tsx
import { useEffect } from 'react';
import { router } from 'expo-router';
import { InteractionManager } from 'react-native';

export default function Index() {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      router.replace('/login'); // ou '/home' selon le token
    });

    return () => task.cancel();
  }, []);

  return null;
}