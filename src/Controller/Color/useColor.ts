import { useEffect, useState } from 'react';
import { ThemeType } from '../Theme/themeSlice';
import { useTheme } from '../Theme/useTheme';
import { ColorObject } from './ColorName';
import { dark } from './dark';
import { light } from './light';
export const useColor = () => {
  const [allColors, setAllColors] = useState<ColorObject>(light);
  const theme = useTheme();
  // console.log(allColors, 'checking');
  useEffect(() => {
    if (theme.getCurrentTheme() === ThemeType.LIGHT) {
      setAllColors(light);
    } else {
      setAllColors(dark);
    }
  }, [theme.getCurrentTheme()]);
  return allColors;
};
