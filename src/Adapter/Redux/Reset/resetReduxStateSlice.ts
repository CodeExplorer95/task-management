import {createSlice} from '@reduxjs/toolkit';

export const resetReduxStateSlice = createSlice({
  name: 'resetRedux',
  initialState: {},
  reducers: {
    resetReduxState: () => {},
  },
});

export default resetReduxStateSlice.reducer;
