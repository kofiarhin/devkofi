import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    admin: null,
    isChecked: false,
  },
  reducers: {
    setAdmin(state, action) {
      state.admin = action.payload;
    },
    clearAdmin(state) {
      state.admin = null;
    },
    setChecked(state) {
      state.isChecked = true;
    },
  },
});

export const { setAdmin, clearAdmin, setChecked } = authSlice.actions;
export default authSlice.reducer;
