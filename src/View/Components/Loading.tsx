import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const Loading = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#3b82f6" />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default Loading;
