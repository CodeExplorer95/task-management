// import { animated, useSpring } from '@react-spring/native';
import React, {PropsWithChildren, useEffect, useState} from 'react';
import {BackHandler, Platform, Pressable, View, Keyboard} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {BlankSpace} from './BlankSpace';
import {useColor} from '../../Controller/Color/useColor';
import {useOrientation} from '../../Utils/useOrientation';
import {useSafeArea} from './UseSafeArea';
import {BlurView} from '@react-native-community/blur';

const DEFAULT_DURATION = 200;

export enum AnimationType {
  bottomToTop = 'bottomToTop',
  center = 'center',
  rightToLeft = 'rightToLeft',
}

type ModalProp = {
  visible: boolean;
  animationType: AnimationType; // by default center
  onBackDropPress?: () => void;
  disableDrag?: boolean;
  duration?: number;
  zIndex?: number;
  isModalClosingAnimation?: boolean; // by default true
  isblur: boolean;
  positionvalue?: string;
};

export const NativeModal: React.FC<PropsWithChildren<ModalProp>> = ({
  children,
  onBackDropPress,
  visible,
  animationType,
  duration,
  zIndex,
  isblur = false,
  isModalClosingAnimation = true,
  disableDrag,
  positionvalue,
}) => {
  const colors = useColor();
  const {hp, wp} = useOrientation();
  const safe = useSafeArea();
  const childLife = useSharedValue(hp(100));
  const backgroundSharedOpacity = useSharedValue(0.8);
  const deviceHeight = hp(100);
  const [keyboardHeight, setkeyboardHeight] = useState<number>(346);

  useEffect(() => {
    if (visible) {
      childLife.value = withTiming(0, {duration: duration ?? DEFAULT_DURATION});
    } else {
      childLife.value = hp(100);
    }

    Keyboard.addListener('keyboardDidShow', e => {
      setkeyboardHeight(e.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', e => {
      setkeyboardHeight(0);
      console.log(e);
    });
  });

  useEffect(() => {
    // if(keyboardHeight){
    //     if(keyboardHeight > 0) return
    //
    // }
  });

  // const animatedStylesForChild = useAnimatedStyle(() => {
  //   if (animationType === AnimationType.center) {
  //     return {transform: [{scale: 1}]};
  //   } else {
  //     return {transform: [{translateY: childLife.value}]};
  //   }
  // });

  const animatedStylesForChild = useAnimatedStyle(() => {
    if (animationType === AnimationType.center) {
      return {transform: [{scale: 1}]};
    } else if (animationType === AnimationType.rightToLeft) {
      return {transform: [{translateX: childLife.value}]};
    } else {
      return {transform: [{translateY: childLife.value}]};
    }
  });

  const animatedOpacityStyle = useAnimatedStyle(() => {
    if (visible) {
      return {
        opacity: withTiming(backgroundSharedOpacity.value, {
          duration: duration ?? DEFAULT_DURATION,
        }),
      };
    } else {
      return {opacity: 0};
    }
  }, [visible]);

  //there is no modal closing animation implemented
  const modalCloseHandler = () => {
    if (animationType === AnimationType.bottomToTop) {
      // await Promise.all([...apiAnimation.start({ translateY: hp(100) }), ...apiAnimation.start({ opacity: 0 })]);
    } else if (animationType === AnimationType.center) {
      // await Promise.all([...apiAnimation.start({ scale: 0 }), ...apiAnimation.start({ opacity: 0 })]);
    }
  };

  useEffect(() => {
    const listner = () => {
      if (onBackDropPress) {
        onBackDropPress();
      }
      return true;
    };
    if (visible) {
      BackHandler.addEventListener('hardwareBackPress', listner);
    } else {
      BackHandler.removeEventListener('hardwareBackPress', listner);
    }
    return () => BackHandler.removeEventListener('hardwareBackPress', listner);
  }, [visible]);

  const gesture = Gesture.Pan()
    .onEnd(() => {
      const halfHeight = deviceHeight / 2;
      const percentCovered = (childLife.value / halfHeight) * 100;
      if (percentCovered > 40) {
        childLife.value = deviceHeight;
        if (onBackDropPress) {
          const end = runOnJS(onBackDropPress);
          end();
        }
      } else {
        childLife.value = 0;
      }
    })
    .onChange(event => {
      if (!disableDrag) {
        if (event.translationY > 0) {
          childLife.value = event.translationY;
        }
      }
    });
  return visible ? (
    <View
      style={{
        position: 'absolute',
        justifyContent:
          animationType === AnimationType.center ? 'center' : 'flex-end',
        alignItems: 'center',
        zIndex: zIndex ?? 1,
        alignSelf: 'center',
      }}>
      <Pressable
        hitSlop={hp(2)}
        onPress={() => {
          if (onBackDropPress) {
            childLife.value = hp(100);
            if (isModalClosingAnimation) {
              modalCloseHandler();
            }
            onBackDropPress();
          }
        }}>
        {isblur ? (
          <BlurView
            style={{
              width: wp(100) + safe.left + safe.right,
              height: hp(100) + safe.top + safe.bottom,
              position: AnimationType.center ? 'relative' : 'absolute',
              // position: 'absolute',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            blurType="light" // You can change this to "light", "xlight", etc.
            blurAmount={9} // Adjust the intensity of the blur
          />
        ) : (
          <Animated.View
            style={[
              {
                width: wp(100) + safe.left + safe.right,
                height: hp(100) + safe.top + safe.bottom,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
              },
              animatedOpacityStyle,
            ]}
          />
        )}
      </Pressable>

      <Animated.View
        style={[
          {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          },
          animatedStylesForChild,
        ]}>
        <GestureDetector gesture={gesture}>
          <View
            style={{
              width: wp(100),
              height: hp(3),
              backgroundColor: 'transparent',
              zIndex: 4,
              position: positionvalue ? positionvalue : 'absolute',
              top: 0,
            }}
          />
        </GestureDetector>

        {children}
        {Platform.OS === 'ios' ? <BlankSpace height={wp(20)} /> : null}
        {Keyboard.isVisible() ? <BlankSpace height={keyboardHeight} /> : null}
      </Animated.View>
    </View>
  ) : null;
};
