import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ActivityIndicator,
} from 'react-native';

import {FontsVariant} from './FontsVariant';
import {Colors} from '../../Utils/Colors';
import {useOrientation} from '../../Utils/useOrientation';

export enum ButtonVariant {
  default = 'default',
  primary_1 = 'primary_v1',
  primary_2 = 'primary_v2',
}

type ButtonPropType = {
  variant: ButtonVariant;
  onPress: () => void;
  title: string;
  width: number;
  height: number;
  titleSize?: number;
  titleFont?: string;
  titleSpacing?: number;
  titleColor?: string;
  icon?: boolean;
  style?: StyleProp<ViewStyle>;
  isButtonDisabled?: boolean;
  isLoading?: boolean;
  isRightIconShown?: boolean;
  isLeftIconShown?: boolean;
  imageVariant?: boolean;
};

export const Button: React.FC<ButtonPropType> = ({
  width,
  height,
  onPress,
  variant,
  title,
  titleColor,
  style,
  isLoading = false,
  isButtonDisabled = false, // default is not disabled
}): JSX.Element => {
  const {backgroundColor, color, borderColor} =
    getButtonVariantProperty(variant);
  const {wp, hp} = useOrientation();

  return (
    <TouchableOpacity
      style={[
        buttonStyle.mainContainer,
        {
          backgroundColor: isButtonDisabled ? Colors.grey : backgroundColor, // Change background if disabled
          borderColor: isButtonDisabled ? Colors.grey : borderColor ?? backgroundColor, // Change border if disabled
          width,
          height,
          flexDirection: 'row',
          borderRadius: wp(3),
          borderWidth: 1.5,
          opacity: isButtonDisabled ? 0.5 : 1, // Make the button semi-transparent when disabled
        },
        style,
      ]}
      onPress={() => {
        if (!isButtonDisabled && !isLoading) {
          onPress();
        }
      }}
      disabled={isButtonDisabled} // Prevent press event when disabled
    >
      {isLoading ? (
        <ActivityIndicator size={'large'} color={Colors.green} />
      ) : (
        <Text
          style={{
            textAlign: 'center',
            color: titleColor ? titleColor : Colors.white,
            fontSize: wp(3.38),
            fontFamily: FontsVariant.ExtraBold,
          }}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const buttonStyle = StyleSheet.create({
  mainContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    top: 3,
    color: 'red',
  },
});

function getButtonVariantProperty(buttonVariant: ButtonVariant) {
  switch (buttonVariant) {
    case ButtonVariant.default:
      return {
        backgroundColor: Colors.darkPurple,
        color: Colors.white,
      };
    case ButtonVariant.primary_1:
      return {
        backgroundColor: Colors.transparent,
        borderColor: Colors.darkPurple,
      };
    case ButtonVariant.primary_2:
      return {
        backgroundColor: Colors.transparent,
        color: Colors.darkPurple,
        borderColor: Colors.white,
      };
  }
}
