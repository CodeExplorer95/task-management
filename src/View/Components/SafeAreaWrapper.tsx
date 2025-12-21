/** If any component overflow from screen , than we have wrap the whole component with this wrapper */

import React, { JSX, type PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeArea } from './UseSafeArea';
export const SafeAreaWrapper: React.FC<
  PropsWithChildren<{ style?: object }>
> = ({ children, style }): JSX.Element => {
  const insets = useSafeArea();

  const safeAreaStyle = StyleSheet.create({
    mainContainer: {
      flex: 1,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.right,
    },
  });

  return <View style={[safeAreaStyle.mainContainer, style]}>{children}</View>;
};
