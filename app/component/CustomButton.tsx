import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Feather, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

type CustomButtonProps = {
  label: string;
  onPress: () => void;
  icon?: string;
  iconLib?: 'Feather' | 'MaterialIcons' | 'FontAwesome5';
  color?: string;
  style?: any;
  isLight?: boolean;
  danger?: boolean;
};

export default function CustomButton({
  label,
  onPress,
  icon = 'send',
  iconLib = 'Feather',
  color = '#222',
  style = {},
  isLight = false,
  danger = false,
}: CustomButtonProps) {
  let IconComponent: any = Feather;
  if (iconLib === 'MaterialIcons') IconComponent = MaterialIcons;
  if (iconLib === 'FontAwesome5') IconComponent = FontAwesome5;

  // Style pill pour light mode
  const pillLight = isLight
    ? {
        container: {
          backgroundColor: danger ? '#e74c3c' : '#fff',
          borderRadius: 999,
          paddingVertical: 8,
          paddingHorizontal: 18,
          shadowColor: '#b3d7f7',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          elevation: 1,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'flex-start',
          marginVertical: 8,
        },
        label: {
          color: danger ? '#fff' : '#427AA1',
          fontWeight: '600' as '600',
          fontSize: 16,
          marginRight: 10,
        },
        iconCircle: {
          backgroundColor: danger ? '#c0392b' : '#427AA1',
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
        },
        icon: '#fff',
      }
    : {
        container: {},
        label: { color: '#fff' },
        iconCircle: {},
        icon: color,
      };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        pillLight.container,
        style,
        { alignSelf: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }
      ]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          pillLight.label,
          { textAlign: 'center', flex: 1 }
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
      <View style={[styles.iconCircle, pillLight.iconCircle]}>
        <IconComponent name={icon} size={20} color={pillLight.icon} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#3B556D',
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    color: '#fff',
    fontWeight: '500' as '500',
    fontSize: 16,
    marginRight: 10,
  },
  iconCircle: {
    backgroundColor: '#0B162C',
    borderRadius: 999,
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
});