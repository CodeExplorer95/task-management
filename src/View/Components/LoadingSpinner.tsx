import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { ColorName } from '../../Controller/Color/ColorName';
import { useColor } from '../../Controller/Color/useColor';

const LoadingSpinner: React.FC<{ size?: 'small' | 'large' | number }> = ({
  size = 'large',
}) => {
  const colors = useColor();
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={size}
        color={colors[ColorName.default_002] || '#355DEE'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default LoadingSpinner;
