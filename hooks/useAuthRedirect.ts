// app/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { router, usePathname } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAuthRedirect() {
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');

      // Si l'utilisateur n'est pas connecté et essaie d'aller sur une page protégée
      if (!token && pathname !== '/login' && pathname !== '/register') {
        router.replace('/login');
      }

      // Si l'utilisateur est connecté et essaie d'aller sur login/register
      if (token && (pathname === '/login' || pathname === '/register')) {
        router.replace('/home');
      }
    };

    checkAuth();
  }, [pathname]);
}