import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },

    resetUser(state, action) {
      state.user = null;
    },
  },
});

export const selectUser = (state) => state.user.user;
export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
