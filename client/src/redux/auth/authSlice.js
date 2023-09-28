import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  isError: null,
  isLoading: null
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginPendingState: state => {
      state.isLoading = true;
    },
    loginFulfilledState: (state, action) => {
      state.isLoading = false;
      state.isError = false;
      state.userInfo = action.payload;
    },
    loginRejectedState: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    }
  }
});

export const { loginPendingState, loginFulfilledState, loginRejectedState } = authSlice.actions;
export default authSlice.reducer;
