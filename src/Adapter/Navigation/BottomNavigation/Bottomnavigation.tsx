/* eslint-disable react-native/no-inline-styles */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ColorName } from '../../../Controller/Color/ColorName';
import { useColor } from '../../../Controller/Color/useColor';
import { images } from '../../../Utils/ImagePath';
import { useOrientation } from '../../../Utils/useOrientation';
// import Settings from '../../../View/Screens/7.Settings/Settings';
import Settings from '../../../View/Screens/7.Profile/Settings';
import { Screens } from '../screenTypes';

const Bottom = createBottomTabNavigator();

const TAB_CONFIG = {
  [Screens.Tasks]: { label: 'Tasks', icon: 'tasks' },
  [Screens.Settings]: { label: 'Settings', icon: 'Settings' },
};

const ICON_MAP = {
  Settings: images.profile,
  tasks: images.home,
};

const Bottomnavigation = () => {
  const { wp, hp } = useOrientation();
  const colors = useColor();

  const headerStyles = StyleSheet.create({
    headerStyle: {
      shadowOpacity: 0,
      elevation: 0,
    },
    headerBackIcon: {
      fontSize: wp(6),
    },
  });

  const renderTabBarIcon = useCallback(
    ({ focused, route }: { focused: boolean; route: any }) => {
      const activeColor = colors[ColorName.default_002] || '#355DEE';
      const inactiveColor = colors[ColorName.secondary_008] || '#777777';
      const iconSize = wp(6);
      const tabConfig = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];

      return (
        <Image
          source={ICON_MAP[tabConfig?.icon as keyof typeof ICON_MAP]}
          style={{
            width: iconSize,
            height: iconSize,
            tintColor: focused ? activeColor : inactiveColor,
            resizeMode: 'contain',
          }}
        />
      );
    },
    [wp, colors],
  );

  const renderTabBarLabel = useCallback(
    ({ focused, route }: { focused: boolean; route: any }) => {
      const activeColor = colors[ColorName.default_002] || '#355DEE';
      const inactiveColor = colors[ColorName.secondary_008] || '#777777';
      const tabConfig = TAB_CONFIG[route.name as keyof typeof TAB_CONFIG];

      return (
        <Text
          style={{
            fontSize: wp(2.8),
            color: focused ? activeColor : inactiveColor,
            fontWeight: focused ? '600' : '400',
            marginTop: wp(0.3),
          }}
        >
          {tabConfig?.label}
        </Text>
      );
    },
    [wp, colors],
  );

  const renderHeaderLeft = useCallback(
    ({ _tintColor, navigation }: any) => (
      <TouchableOpacity
        style={{ paddingLeft: wp(4), paddingRight: wp(2) }}
        onPress={() => navigation?.goBack()}
      >
        <Text style={headerStyles.headerBackIcon}>←</Text>
      </TouchableOpacity>
    ),
    [wp, headerStyles.headerBackIcon],
  );

  return (
    <Bottom.Navigator
      screenOptions={({ route, navigation }) => {
        return {
          tabBarIcon: ({ focused }) => renderTabBarIcon({ focused, route }),
          tabBarLabel: ({ focused }) => renderTabBarLabel({ focused, route }),
          tabBarItemStyle: {
            paddingVertical: hp(0.5),
          },
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: headerStyles.headerStyle,
          headerTitle: TAB_CONFIG[route.name as keyof typeof TAB_CONFIG]?.label,
          headerLeft: props => renderHeaderLeft({ ...props, navigation }),
          tabBarHideOnKeyboard: true,
        };
      }}
    >
      <Bottom.Screen
        name={Screens.Tasks}
        component={require('../../../View/Screens/5.Tasks/Tasks').default}
      />
      <Bottom.Screen name={Screens.Settings} component={Settings} />
    </Bottom.Navigator>
  );
};

export default Bottomnavigation;
