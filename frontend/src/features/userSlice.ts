import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  value: string | null;
}

const initialState: UserState = {
  value: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;