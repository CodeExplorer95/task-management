import React, { JSX, useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorName, ColorObject } from '../../Controller/Color/ColorName';
import { useColor } from '../../Controller/Color/useColor';
import { images } from '../../Utils/ImagePath';
import { useOrientation } from '../../Utils/useOrientation';
import { FontsVariant } from './FontsVariant';

import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';

export enum InputVariant {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
}

type InputProp = {
  width: number;
  height: number;
  variant: InputVariant;
  inputTextSize?: number;
  onChangeText?: (inputType: string) => void;
  placeHolder?: string;
  inputTextFont?: string;
  value?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  rightIcon?: JSX.Element;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  style?: object;
  isSideDishSearch?: boolean;
  textAlign?: 'left' | 'center' | 'right' | undefined;
  onPress?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
  borderRadius?: number;
  textAlignVertical?: 'center' | 'auto' | 'top' | 'bottom' | undefined;
  alignSelf?: string;
  showPasswordEye?: boolean;
  paddingVertical?: number;
  onEndEditing?: () => void;
  passMargin?: number;
  leftImage?: boolean;
  leftIcon?: ImageSourcePropType;

  searchIcon?: ImageSourcePropType;
  _searchIcon?: ImageSourcePropType;
  backgroundColor?: string;
  placeholderTextColorName?: string;
  textColor?: string;
  refdata?: React.Ref<TextInput>;
  onKeyPress?: any;

  enableCountryPicker?: boolean;
};

export const InputField: React.FC<InputProp> = ({
  width,
  height,
  value,
  variant,
  onChangeText,
  secureTextEntry,
  placeHolder,
  keyboardType,
  inputTextSize,
  inputTextFont,
  editable,
  maxLength,
  onFocus,
  onBlur,
  style,
  multiline,
  numberOfLines,
  borderRadius,
  textAlignVertical,
  paddingVertical,
  onEndEditing,
  passMargin,
  leftImage,
  _searchIcon,
  leftIcon,
  backgroundColor,
  placeholderTextColorName,
  textAlign,
  textColor,
  refdata,
  showPasswordEye,
  alignSelf,
  onKeyPress,

  enableCountryPicker,
}) => {
  const { hp, wp } = useOrientation();
  const colors = useColor();

  const [isSecureTextEntryEnable, setIsSecureTextEntryEnable] =
    useState<boolean>(secureTextEntry ?? false);

  const [isFocused, setIsFocused] = useState(false);

  const [countryCode, setCountryCode] = useState<CountryCode>('GB');
  const [callingCode, setCallingCode] = useState('44');

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCallingCode(country.callingCode[0]);
  };

  useEffect(() => {
    setIsSecureTextEntryEnable(secureTextEntry ?? false);
  }, [secureTextEntry]);

  const { color, placeholderTextColor } = getInputVariantProperty(
    variant,
    colors,
  );

  return (
    <View
      style={[
        inputStyles.inputsContainer,
        {
          backgroundColor: backgroundColor
            ? backgroundColor
            : colors[ColorName.secondary_099],

          paddingHorizontal: wp(5),
          borderRadius: borderRadius ?? wp(3.5),
          width,
          height,
          justifyContent: 'space-between',

          borderWidth: 1.5,
          borderColor: isFocused
            ? colors[ColorName.default_002]
            : colors[ColorName.secondary_010],
        },
      ]}
    >
      {leftImage && (
        <TouchableOpacity>
          <Image
            source={leftIcon ? leftIcon : images.password}
            resizeMode="contain"
            style={{
              width: wp(5),
              height: wp(5),
            }}
          />
        </TouchableOpacity>
      )}

      {/* render leftIcon if provided (ImageSourcePropType or JSX) */}
      {leftIcon &&
        ((leftIcon as any).uri || typeof leftIcon === 'number' ? (
          <TouchableOpacity>
            <Image
              source={leftIcon as ImageSourcePropType}
              resizeMode="contain"
              style={{ width: wp(5), height: wp(5), marginLeft: wp(2) }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ marginLeft: wp(2) }}>{leftIcon as JSX.Element}</View>
        ))}

      <View
        style={{
          flexDirection: 'row',
          marginTop: wp(passMargin && Platform.OS === 'ios' ? passMargin : 0),
          alignItems: 'center',
          flex: 1,
          height,
        }}
      >
        {enableCountryPicker && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <CountryPicker
              withFilter
              withFlag
              withCallingCode
              withEmoji
              countryCode={countryCode}
              onSelect={onSelect}
            />
            <Text
              style={{
                marginLeft: wp(2),
                marginRight: wp(2),
                color: textColor ?? colors[ColorName.secondary_001],
              }}
            >
              +{callingCode}
            </Text>
          </View>
        )}

        <TextInput
          scrollEnabled={false}
          style={[
            {
              color: textColor ?? color,
              height,
              fontSize: inputTextSize ? inputTextSize : 15,
              flex: 1,
              fontFamily: inputTextFont ?? FontsVariant.Medium,
              paddingVertical: paddingVertical ?? hp(0),
              marginVertical: wp(5),
              alignSelf: alignSelf,
            },
            style,
          ]}
          placeholder={placeHolder}
          autoCapitalize="none"
          placeholderTextColor={
            placeholderTextColorName
              ? placeholderTextColorName
              : placeholderTextColor
          }
          value={value}
          keyboardType={keyboardType}
          secureTextEntry={isSecureTextEntryEnable}
          onFocus={() => {
            setIsFocused(true);
            onFocus && onFocus();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
          editable={editable ?? true}
          maxLength={maxLength}
          multiline={secureTextEntry ? false : multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={textAlignVertical}
          onEndEditing={onEndEditing}
          textAlign={textAlign}
          onChangeText={onChangeText}
          ref={refdata}
          onKeyPress={onKeyPress}
        />
        {showPasswordEye && (
          <Pressable
            hitSlop={wp(3)}
            style={{
              height: hp(6),
              marginLeft: wp(3),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setIsSecureTextEntryEnable(!isSecureTextEntryEnable)}
          >
            <Image
              source={isSecureTextEntryEnable ? images.hide : images.show}
              style={{
                height: wp(4),
                width: wp(4),
                tintColor: textColor ?? colors[ColorName.secondary_001],
              }}
              resizeMode={'contain'}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const inputStyles = StyleSheet.create({
  inputsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

function getInputVariantProperty(
  inputVariant: InputVariant,
  colors: ColorObject,
) {
  switch (inputVariant) {
    case InputVariant.PRIMARY:
      return {
        color: colors[ColorName.secondary_001],
        placeholderTextColor: colors[ColorName.secondary_001],
      };
    case InputVariant.SECONDARY:
      return {
        color: colors[ColorName.secondary_100],
        placeholderTextColor: colors[ColorName.secondary_100],
      };
  }
}
