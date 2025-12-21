import { useNetInfo } from '@react-native-community/netinfo';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { JSX, useEffect } from 'react';
import { Image, View } from 'react-native';
import {
  ScreenParamList,
  Screens,
} from '../../../Adapter/Navigation/screenTypes';
import { useProfileController } from '../../../Controller/API/useProfileController';
import { useProfileModel } from '../../../Model/ProfileModel/useProfileModel';
import { images } from '../../../Utils/ImagePath';
import { useOrientation } from '../../../Utils/useOrientation';
import Background from '../../Components/Background';

type Props = NativeStackScreenProps<ScreenParamList, Screens.Splash>;
const Splash = ({ navigation }: Props): JSX.Element => {
  const { wp, hp } = useOrientation();
  const profileModel = useProfileModel();
  const profileController = useProfileController(profileModel);

  const netInfo = useNetInfo();
  console.log(netInfo.isConnected, 'checking net info');

  useEffect(() => {
    const timeout = setTimeout(() => {
      splashHandler();
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  const splashHandler = async () => {
    const isExistingUser = await profileController.splashFunctionality();
    if (isExistingUser) {
      navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: Screens.Bottomnavigation,
            },
          ],
        }),
      );
    } else {
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
    }
  };

  return (
    <Background
      isFullHeightEnabled={true}
      isFullWidthEnabled={true}
      removeBottomGap={true}
      removeTopGap={true}
      backgroundColor="#F5F5F5"
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          source={images.spalshlogo}
          style={{
            height: hp(20),
            width: wp(60),
          }}
          resizeMode="contain"
        />
      </View>
    </Background>
  );
};

export default Splash;
