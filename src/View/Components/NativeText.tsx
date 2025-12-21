import React from 'react';
import {Text, TextProps} from 'react-native';
import {FontsVariant} from './FontsVariant';
import {useOrientation} from '../../Utils/useOrientation';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface NativeTextProps extends TextProps {
  text: string;
  textSize?: number;
  textColor?: string;
  textFamily?: string;
}
const SIZE_FACTOR = 1;
export const NativeText: React.FC<NativeTextProps> = props => {
  const {hp} = useOrientation();

  return (
    <Text
      {...props}
      style={[
        props.style,
        {
          fontSize: props.textSize
            ? props.textSize * SIZE_FACTOR
            : hp(16) * SIZE_FACTOR,
          color: props.textColor ?? Colors.secondary_100,
          fontFamily: props.textFamily ?? FontsVariant.Medium,
        },
      ]}>
      {props.text}
      {/* {translation.translate(props.text.toLowerCase().trim())} */}
      {/* {translation.translate(props?.text?.trim())} */}
    </Text>
  );
};
