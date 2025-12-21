import {useSafeAreaInsets} from 'react-native-safe-area-context';
export const useSafeArea = () => {
  const {top, bottom, left, right} = useSafeAreaInsets();
  const hasNotch = (): boolean => {
    return top || bottom || left || right ? true : false;
  };
  return {top, bottom, left, right, hasNotch};
};
