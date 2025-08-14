// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface AuthSlice {
//   email: string;
//   fullName: string;
//   token: string;
// }

// const initialState: AuthSlice = {
//   email: "",
//   fullName: "",
//   token: "",
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     getauth(state, action: PayloadAction<AuthSlice>) {
//       state.email = action.payload.email;
//       state.fullName = action.payload.fullName;
//       state.token = action.payload.token;
//     },
//   },
// });

// export const { getauth } = authSlice.actions;
// export default authSlice.reducer;
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { RootState } from "../store";

export const CODE_VERIFIER_KEY = "codeVerifier";

export interface User {
  id: number;
  accessToken: string;
  refreshToken: string;
  email: string;
  gender?: string;
  fullName: string;
  age?: number;
  country?: string;
  city?: string;
  phoneNumber?: string;
  imageUrl?: string;
  healthConditions?: string[];
  dietaryRestrictions?: string[];
  activityLevel?: string;
  height?: number;
  weight?: number;
  profilePicture?: File | null;
  energy?: {
    BMR: number;
    TDEE: number;
    perMeal: number;
  };
}

interface AuthState {
  user?: User;
  isLoggedIn: boolean;
}
const initialState: AuthState = { isLoggedIn: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.log("Setting user", action.payload);
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
      // clear code verifier if user is logged in.
      if (action.payload) localStorage.removeItem(CODE_VERIFIER_KEY);
    },
    resetAuth(state) {
      state.isLoggedIn = false;
      state.user = undefined;
    },
    updateEnergy(
      state,
      action: PayloadAction<{ BMR: number; TDEE: number; perMeal: number }>
    ) {
      if (state.user) {
        state.user = {
          ...state.user!,
          energy: action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

const selectAuth = (state: RootState) => state.auth;

export const getUser = () => createSelector([selectAuth], (auth) => auth.user);

export const { setUser, setIsLoggedIn, resetAuth, updateUser, updateEnergy } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
