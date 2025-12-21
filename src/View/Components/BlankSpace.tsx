import React from 'react';
import {
  ColorValue,
  DimensionValue,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

type BlankSpaceProp = {
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
};

export const BlankSpace: React.FC<BlankSpaceProp> = ({
  style,
  height,
  width,
  backgroundColor,
}) => {
  return <View style={[{ height, width, backgroundColor }, style]} />;
};
