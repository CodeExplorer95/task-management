import { useEffect, useState } from 'react';
import { Dimensions, PixelRatio, ScaledSize } from 'react-native';
const FIGMA_WIDTH = 390;
const FIGMA_HEIGHT = 812;

export const useOrientation = () => {
  const getScreenData = (window: ScaledSize) => {
    const { width, height } = window;

    return {
      width,
      height,
      isPortrait: height >= width,
    };
  };

  const [screenData, setScreenData] = useState(
    getScreenData(Dimensions.get('window')),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(getScreenData(window));
    });

    return () => subscription.remove();
  }, []);

  // Percentage based width
  const wp = (percent: number): number =>
    PixelRatio.roundToNearestPixel((screenData.width * percent) / 100);

  // Percentage based height
  const hp = (percent: number): number =>
    PixelRatio.roundToNearestPixel((screenData.height * percent) / 100);

  // Figma → responsive width (absolute px)
  const figmaW = (value: number): number =>
    PixelRatio.roundToNearestPixel((screenData.width / FIGMA_WIDTH) * value);

  // Figma → responsive height (absolute px)
  const figmaH = (value: number): number =>
    PixelRatio.roundToNearestPixel((screenData.height / FIGMA_HEIGHT) * value);

  return {
    wp,
    hp,
    figmaW,
    figmaH,
    screenWidth: screenData.width,
    screenHeight: screenData.height,
    isPortrait: screenData.isPortrait,
  };
};
