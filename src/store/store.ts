import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./reducers/cartSlice";
import productSlice from "./reducers/productSlice";
import userSlice from "./reducers/userSlice";
import areaSlice from "./reducers/areaSlice";
import companySlice from "./reducers/companySlice";

import servicesSlice  from "./reducers/servicesSlice";
import storage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  // Agrega companySlice si quieres que persista entre sesiones
  whitelist: ["userSlice", "cartSlice", "productSlice", "companySlice, servicesSlice"], 
};

const rootReducer = combineReducers({
  cartSlice,
  productSlice,
  userSlice,
  areaSlice,
  companySlice,
  servicesSlice ,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
