import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartSlice from "./reducers/cartSlice";
import productSlice from "./reducers/productSlice";
import userSlice from "./reducers/userSlice";
import areaSlice from "./reducers/areaSlice";
import storage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root", // Nombre de la clave que usará el almacenamiento persistente
  storage, // Usamos AsyncStorage
  whitelist: ["userSlice", "cartSlice", "productSlice"], // Aquí agregamos los slices que queremos persistir
};

const rootReducer = combineReducers({
  cartSlice,
  productSlice,
  userSlice,
  areaSlice,
});

// Creamos el reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Usamos el reducer persistido
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Esto evita las alertas por objetos no serializables
    }),
  devTools: true,
});

export const persistor = persistStore(store); // Esto manejará la persistencia

// Exportar el tipo de estado de la tienda
export type RootState = ReturnType<typeof store.getState>;
