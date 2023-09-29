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
    },
    updatePendingState: state => {
      state.isLoading = true;
    },
    updateFulfilledState: (state, action) => {
      state.isLoading = false;
      state.isError = null;
      state.userInfo = action.payload;
    },
    updateRejectedState: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
    logoutPendingState: state => {
      state.isLoading = true;
    },
    logoutFulfilledState: state => {
      state.isLoading = false;
      state.isError = null;
      state.userInfo = null;
    },
    logoutRejectedState: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    },
    deleteAccountPendingState: state => {
      state.isLoading = true;
    },
    deleteAccountFulfilledState: state => {
      state.isLoading = false;
      state.isError = null;
      state.userInfo = null;
    },
    deleteAccountRejectedState: (state, action) => {
      state.isLoading = false;
      state.isError = action.payload;
    }
  }
});

export const {
  loginPendingState,
  loginFulfilledState,
  loginRejectedState,
  updateFulfilledState,
  updatePendingState,
  updateRejectedState,
  deleteAccountFulfilledState,
  deleteAccountPendingState,
  deleteAccountRejectedState,
  logoutFulfilledState,
  logoutPendingState,
  logoutRejectedState
} = authSlice.actions;
export default authSlice.reducer;
