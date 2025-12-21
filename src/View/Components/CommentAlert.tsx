import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const CommentAlert = () => {
  return (
    <View style={styles.alertContainer}>
      <Text style={styles.alertText}>
        Comment should not contain insults, trash talking etc.
      </Text>
      <View style={styles.triangle} />
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    backgroundColor: 'blue',
    borderRadius: 10,
    padding: 10,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    zIndex: 2,
    elevation: 3,
    position: 'relative',
  },
  alertText: {
    fontSize: 14,
    color: '#333',
  },
  triangle: {
    position: 'absolute',
    right: -10,
    top: 10,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: '#fff',
  },
});

export default CommentAlert;
