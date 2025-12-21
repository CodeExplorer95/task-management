import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React from 'react';
import { StatusBar } from 'react-native';
import { MenuProvider } from 'react-native-popup-menu';
import { ThemeType } from '../../Controller/Theme/themeSlice';
import { Loader } from '../../View/Components/Loader';
import { useAppSelector } from '../Redux/useAppSelector';
import { StackNavigation } from './StackNavigation';

const NavigationContainers = () => {
  const themePref = useAppSelector(state => state.theme.themePreference);
  const isDark = themePref === ThemeType.DARK;
  const navTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#000' : '#fff'}
      />
      <NavigationContainer theme={navTheme}>
        <Loader />
        <MenuProvider>
          <StackNavigation />
        </MenuProvider>
      </NavigationContainer>
    </>
  );
};

export default NavigationContainers;
