// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./redux/auth-slice";
// import { api } from "../api/api";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [api.reducerPath]: api.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(api.middleware),
// });

// export type RootState = ReturnType<typeof store.getState>;

// export type AppDispatch = typeof store.dispatch;

import storage from "redux-persist/lib/storage"

import { persistCombineReducers, persistStore } from "redux-persist";
import { Action, configureStore } from "@reduxjs/toolkit";

import { authReducer, resetAuth, User } from "./redux/auth-slice";
import { apiSlice } from "../api/api";

export const globalState: { user?: User } = { user: undefined };

const persistConfig = {
    key: "root",
    storage,
  };

  
  const rootReducer={
    auth:authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,

  }

  const persistedReducer = persistCombineReducers(persistConfig, rootReducer);

  const store=configureStore({
    reducer:persistedReducer,
    middleware:getDefaultMiddleware=>getDefaultMiddleware({serializableCheck: false, immutableCheck: false})
    .prepend((_: unknown) => (next: unknown) => (action: unknown) => clearOnLogOut(action as Action, next as Function))
    .concat(apiSlice.middleware),

  })

  function clearOnLogOut(action: Action, next: Function) {
    if (action.type === "CLEAR_APP") {
      persistor.purge().then(() => {
        globalState.user = undefined;
        next(resetAuth());
        localStorage.clear();
      });
    }
    return next(action);
  }

  export const persistor = persistStore(store);
export { store };


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type StoreType = typeof store;
