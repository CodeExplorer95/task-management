import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { produce } from 'immer';
import React, { useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ScreenParamList,
  Screens,
} from '../../../Adapter/Navigation/screenTypes';
import { useProfileController } from '../../../Controller/API/useProfileController';
import { ColorName } from '../../../Controller/Color/ColorName';
import { useColor } from '../../../Controller/Color/useColor';
import { useProfileModel } from '../../../Model/ProfileModel/useProfileModel';
import { images } from '../../../Utils/ImagePath';
import { useOrientation } from '../../../Utils/useOrientation';
import { validator } from '../../../Utils/validator';
import Background from '../../Components/Background';
import { BlankSpace } from '../../Components/BlankSpace';
import { Button, ButtonVariant } from '../../Components/Button';
import { FontsVariant } from '../../Components/FontsVariant';
import { InputField, InputVariant } from '../../Components/InputField';
type Props = NativeStackScreenProps<ScreenParamList, Screens.Signin>;

const Signin = ({ navigation }: Props) => {
  const [isPrivacyPressed, setIsPrivacyPressed] = useState(false);

  const profileModel = useProfileModel();

  const profileController = useProfileController(profileModel);
  const [onSubmitLoader, setOnSubmitLoader] = useState<boolean>(false);

  const { wp, hp, figmaH, figmaW } = useOrientation();
  styles(wp, hp, figmaW, figmaH);
  const colors = useColor();

  const OnSigninClick = async () => {
    let hasError = false;

    if (validator.isEmpty(profileModel.getEmail())) {
      profileModel.setEmailInfo(
        produce(draft => {
          draft.isRequired = true;
        }),
      );
      hasError = true;
    }

    if (validator.isEmpty(profileModel.getPassword())) {
      profileModel.setPasswordInfo(
        produce(draft => {
          draft.isRequired = true;
        }),
      );
      hasError = true;
    } else if (profileModel.getPassword().length < 6) {
      profileModel.setPasswordInfo(
        produce(draft => {
          draft.isValidate = false;
          draft.isRequired = false;
        }),
      );
      hasError = true;
    }

    if (hasError) return;

    if (
      !profileModel.emailInfo.isValidate ||
      !profileModel.passwordInfo.isValidate
    ) {
      return;
    }

    setOnSubmitLoader(true);
    const response = await profileController.signinWithEmailandpassword();
    console.log('data of signup screen', response);
    if (response) {
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
    }
    setOnSubmitLoader(false);
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <Background
        isFullHeightEnabled
        isFullWidthEnabled={false}
        removeBottomGap
        removeTopGap
        style={{ justifyContent: 'flex-start' }}
      >
        <View style={{ flex: 1 }}>
          <BlankSpace height={figmaH(80)} />
          <Text
            style={{
              color: colors[ColorName.primary_001],
              fontSize: figmaW(24),
              fontWeight: '400',
            }}
          >
            Signup for the best experience
          </Text>
          <BlankSpace height={figmaH(8)} />
          <Text
            style={{
              color: colors[ColorName.secondary_098],
              fontSize: figmaW(12),
              fontWeight: '400',
              lineHeight: figmaH(20),
            }}
          >
            At our app, we take the security of your information seriously.At
            our app, we take the security of your information seriously.
          </Text>
          <BlankSpace height={figmaH(60)} />
          <InputField
            placeHolder={'Enter your email address'}
            placeholderTextColorName={colors[ColorName.secondary_101]}
            width={figmaW(343)}
            height={figmaH(55)}
            backgroundColor={colors[ColorName.secondary_003]}
            variant={InputVariant.PRIMARY}
            inputTextSize={wp(3.38)}
            textAlign={'left'}
            leftIcon={images.email}
            textColor={colors[ColorName.secondary_100]}
            borderRadius={figmaW(16)}
            keyboardType={'email-address'}
            value={profileModel.getEmail()}
            multiline={false}
            onChangeText={text => {
              if (text === '') {
                profileModel.setEmailInfo(
                  produce(draft => {
                    draft.isRequired = true;
                    draft.email = text;
                    draft.isValidate = false;
                  }),
                );
                return;
              }

              if (validator.isEmail(text)) {
                profileModel.setEmailInfo(
                  produce(draft => {
                    draft.email = text;
                    draft.isValidate = true;
                    draft.isRequired = false;
                  }),
                );
              } else {
                profileModel.setEmailInfo(
                  produce(draft => {
                    draft.email = text;
                    draft.isValidate = false;
                    draft.isRequired = false;
                  }),
                );
              }
            }}
          />
          {profileModel.emailInfo.isRequired &&
          profileModel.emailInfo.email.length === 0 ? (
            <Text
              style={{
                fontSize: wp(3.8),
                color: colors[ColorName.secondary_010],
                fontFamily: FontsVariant.Medium,
              }}
            >
              Email is required
            </Text>
          ) : null}
          {profileModel.emailInfo.email.length > 0 &&
          !profileModel.emailInfo.isValidate ? (
            <Text
              style={{
                fontSize: wp(3.8),
                color: colors[ColorName.secondary_010],
                fontFamily: FontsVariant.Medium,
              }}
            >
              Please provide a valid email
            </Text>
          ) : null}
          <BlankSpace height={hp(1.11)} />

          <BlankSpace height={figmaH(16)} />

          <InputField
            placeHolder={'Enter your password'}
            placeholderTextColorName={colors[ColorName.secondary_101]}
            width={figmaW(343)}
            height={figmaH(55)}
            backgroundColor={colors[ColorName.secondary_003]}
            variant={InputVariant.PRIMARY}
            inputTextSize={wp(3.38)}
            textAlign={'left'}
            textColor={colors[ColorName.secondary_100]}
            borderRadius={figmaW(16)}
            keyboardType={'default'}
            value={profileModel.getPassword()}
            leftImage={true}
            secureTextEntry={true}
            showPasswordEye={true}
            multiline={false}
            onChangeText={text => {
              if (text === '') {
                profileModel.setPasswordInfo(
                  produce(draft => {
                    draft.isRequired = true;
                    draft.password = text;
                    draft.isValidate = false;
                  }),
                );
                return;
              }

              profileModel.setPasswordInfo(
                produce(draft => {
                  draft.password = text;
                  draft.isValidate = text.length >= 6;
                  draft.isRequired = false;
                }),
              );
            }}
          />
          <BlankSpace height={figmaH(10)} />
          {profileModel.passwordInfo.isRequired &&
          profileModel.passwordInfo.password.length === 0 ? (
            <Text
              style={{
                fontSize: wp(3.8),
                color: colors[ColorName.secondary_010],
                fontFamily: FontsVariant.Medium,
              }}
            >
              Password is required
            </Text>
          ) : null}
          {profileModel.passwordInfo.password.length > 0 &&
          !profileModel.passwordInfo.isValidate ? (
            <Text
              style={{
                fontSize: wp(3.8),
                color: colors[ColorName.secondary_010],
                fontFamily: FontsVariant.Medium,
              }}
            >
              Password must be at least 6 characters
            </Text>
          ) : null}
          <Pressable
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: Screens.Signup,
                    },
                  ],
                }),
              );
            }}
            android_ripple={{
              color: colors[ColorName.primary_001] + '33',
              borderless: false,
            }}
            style={({ pressed }) => [
              {
                alignSelf: 'flex-end',
                paddingVertical: figmaH(12),
                paddingHorizontal: figmaW(24),
              },
              pressed && { opacity: 0.6 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Create your account"
          >
            <Text
              style={{
                color: colors[ColorName.primary_001],
                fontSize: figmaW(16),
              }}
            >
              Create your account
            </Text>
          </Pressable>

          <BlankSpace height={figmaH(48)} />
          <View
            style={{
              width: figmaW(343),
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <BlankSpace
              width={figmaW(153)}
              height={figmaH(1)}
              backgroundColor={colors[ColorName.secondary_095]}
            />
            <Text
              style={{
                fontSize: figmaW(14),
                fontWeight: '400',
                color: colors[ColorName.secondary_095],
              }}
            >
              or
            </Text>
            <BlankSpace
              width={figmaW(153)}
              height={figmaH(1)}
              backgroundColor={colors[ColorName.secondary_095]}
            />
          </View>
          <BlankSpace height={figmaH(18)} />
          <TouchableOpacity
            style={{
              width: figmaW(60),
              height: figmaH(60),
              borderRadius: figmaW(120),
              backgroundColor: colors[ColorName.secondary_003],
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
          >
            <Image
              source={images.googleLogo}
              style={{ width: figmaW(41), height: figmaH(41) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <BlankSpace height={figmaH(27)} />
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: figmaW(11),
                color: colors[ColorName.secondary_098],
                textAlign: 'center',
                lineHeight: figmaH(18),
              }}
            >
              By continuing, you agree to our
              <Text
                onPressIn={() => setIsPrivacyPressed(true)}
                onPressOut={() => setIsPrivacyPressed(false)}
                onPress={() => {
                  console.log('Privacy Policy Clicked');
                }}
                style={{
                  color: isPrivacyPressed
                    ? colors[ColorName.secondary_098]
                    : colors[ColorName.primary_001], //
                  textDecorationLine: 'underline',
                  fontSize: figmaW(11),
                }}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
          <BlankSpace height={figmaH(50)} />
          <Button
            height={figmaH(54)}
            width={figmaW(343)}
            title="signin"
            variant={ButtonVariant.primary_2}
            titleColor="white"
            style={{
              backgroundColor: colors[ColorName.primary_001],
              borderRadius: figmaW(50),
              alignSelf: 'center',
            }}
            // onPress={() => {
            //   navigation.navigate(Screens.Otp);
            // }}
            onPress={OnSigninClick}
            isLoading={onSubmitLoader}
          />
          <BlankSpace height={figmaH(16)} />
        </View>
      </Background>
    </Pressable>
  );
};
export default Signin;

const styles = (
  wp: (v: number) => number,
  hp: (v: number) => number,
  figmaW: (v: number) => number,
  figmaH: (v: number) => number,
) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: figmaW(10),
    },

    bannerImage: {
      width: figmaW(40),
      height: figmaH(40),
      borderRadius: figmaW(8),
    },

    bannerText: { color: '#000', fontSize: figmaW(14) },

    logo: { height: hp(10), width: wp(50) },
  });
