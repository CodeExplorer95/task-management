import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../Adapter/Redux/Store/Store';
export enum ThemeType {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}
// Define a type for the slice state
interface ThemeState {
  themePreference: ThemeType;
}

// Define the initial state using that type
const initialState: ThemeState = {
  themePreference: ThemeType.LIGHT,
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    updateTheme: (state, action: PayloadAction<ThemeType>) => {
      if (state.themePreference !== action.payload) {
        state.themePreference = action.payload;
      }
    },
  },
});

export const {updateTheme} = themeSlice.actions;

export const selectTheme = (state: RootState): ThemeType =>
  state.theme.themePreference;

export default themeSlice.reducer;
