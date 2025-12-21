import React, { PropsWithChildren } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useColor } from '../../Controller/Color/useColor';
import { useOrientation } from '../../Utils/useOrientation';
import { useSafeArea } from './UseSafeArea';

type BackgroundProps = {
  style?: StyleProp<ViewStyle>;
  isFullWidthEnabled?: boolean;
  isFullHeightEnabled?: boolean;
  removeTopGap?: boolean;
  removeBottomGap?: boolean;
  backgroundColor?: string;
  backgroundImage?: ImageSourcePropType; // optional image for full-screen background
  backgroundOpacity?: number; // overlay opacity 0..1
  overlayColor?: string; // optional overlay tint color
  banner?: React.ReactNode;
};

const Background: React.FC<PropsWithChildren<BackgroundProps>> = ({
  children,
  style,
  isFullWidthEnabled = false,
  isFullHeightEnabled = false,
  removeTopGap = false,
  removeBottomGap = false,
  backgroundColor,
  backgroundImage,
  backgroundOpacity = 0.4,
  overlayColor,
  banner,
}) => {
  const { wp, hp } = useOrientation();
  const { hasNotch } = useSafeArea();
  const colors = useColor();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Optional full-screen background image or solid color */}
      {backgroundImage ? (
        <ImageBackground
          source={backgroundImage}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          {/* optional tint overlay */}
          {overlayColor && (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: overlayColor,
                  opacity: backgroundOpacity ?? 0.4,
                },
              ]}
            />
          )}

          {/* MAIN CONTENT */}
          <View
            style={[
              styles.container,
              {
                paddingHorizontal: isFullWidthEnabled ? 0 : wp(5),
                paddingTop: removeTopGap
                  ? 0
                  : isFullHeightEnabled
                  ? 0
                  : hasNotch()
                  ? hp(1)
                  : hp(3),
                paddingBottom: removeBottomGap
                  ? 0
                  : isFullHeightEnabled
                  ? 0
                  : hasNotch()
                  ? hp(3)
                  : hp(3),
              },
              style,
            ]}
          >
            {children}
          </View>

          {/* BOTTOM FIXED BANNER (5% height) */}
          {banner && (
            <View
              style={{
                height: hp(5),
                width: '100%',
                backgroundColor: colors.secondary_002, // change if needed
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {banner}
            </View>
          )}
        </ImageBackground>
      ) : (
        <SafeAreaView
          style={[
            styles.safeArea,
            { backgroundColor: backgroundColor ?? colors.secondary_001 },
          ]}
        >
          {/* MAIN CONTENT */}
          <View
            style={[
              styles.container,
              {
                paddingHorizontal: isFullWidthEnabled ? 0 : wp(5),
                paddingTop: removeTopGap
                  ? 0
                  : isFullHeightEnabled
                  ? 0
                  : hasNotch()
                  ? hp(1)
                  : hp(3),
                paddingBottom: removeBottomGap
                  ? 0
                  : isFullHeightEnabled
                  ? 0
                  : hasNotch()
                  ? hp(3)
                  : hp(3),
              },
              style,
            ]}
          >
            {children}
          </View>

          {/* BOTTOM FIXED BANNER (5% height) */}
          {banner && (
            <View
              style={{
                height: hp(5),
                width: '100%',
                backgroundColor: colors.secondary_002, // change if needed
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {banner}
            </View>
          )}
        </SafeAreaView>
      )}
    </SafeAreaView>
  );
};

export default Background;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
