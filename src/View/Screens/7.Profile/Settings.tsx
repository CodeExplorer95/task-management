import {
  CommonActions,
  useTheme as useNavTheme,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import {
  ScreenParamList,
  Screens,
} from '../../../Adapter/Navigation/screenTypes';
import { useProfileController } from '../../../Controller/API/useProfileController';
import { ThemeType } from '../../../Controller/Theme/themeSlice';
import { useTheme } from '../../../Controller/Theme/useTheme';
import { useProfileModel } from '../../../Model/ProfileModel/useProfileModel';
import { useOrientation } from '../../../Utils/useOrientation';

type Props = NativeStackScreenProps<ScreenParamList, Screens.Settings>;

export default function Settings({ navigation }: Props) {
  const { colors } = useNavTheme();
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const { wp, hp, figmaW, figmaH } = useOrientation();
  const s = styles(wp, hp, figmaW, figmaH);

  const theme = useTheme();

  useEffect(() => {
    const current = theme.getCurrentTheme();
    setIsDark(current === ThemeType.DARK);
  }, [theme]);

  const toggleTheme = (val: boolean) => {
    setIsDark(val);
    // update Redux theme so NavigationContainers picks it up immediately
    theme.changeTheme(val ? ThemeType.DARK : ThemeType.LIGHT);
  };

  const profileModel = useProfileModel();
  const profileController = useProfileController(profileModel);

  const handleLogout = async () => {
    try {
      await profileController.signout();

      Alert.alert('Signed out successfully');
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.Signin,
            },
          ],
        }),
      );
    } catch (e) {
      console.error('Signout error', e);
      Alert.alert('Signout failed');
    }
  };

  return (
    <View style={[s.page, { backgroundColor: colors.background }]}>
      <View style={s.row}>
        <Text style={[s.label, { color: colors.text }]}>Dark theme</Text>
        <Switch value={!!isDark} onValueChange={v => toggleTheme(v)} />
      </View>

      <View style={s.row}>
        <Pressable
          style={[s.logoutBtn, s.logoutBtnDanger]}
          onPress={handleLogout}
        >
          <Text style={s.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = (
  wp: (v: number) => number,
  hp: (v: number) => number,
  figmaW: (v: number) => number,
  figmaH: (v: number) => number,
) =>
  StyleSheet.create({
    page: { flex: 1, padding: figmaW(16) },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: figmaH(18),
    },
    label: { fontSize: figmaW(16) },
    logoutBtn: {
      paddingVertical: figmaH(12),
      paddingHorizontal: figmaW(16),
      borderRadius: figmaW(8),
    },
    logoutBtnDanger: { backgroundColor: '#E53935' },
    logoutText: {
      color: '#fff',
      fontWeight: '600' as any,
      fontSize: figmaW(14),
    },
  });
