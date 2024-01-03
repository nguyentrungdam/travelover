import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../slices/accountSlice";
import userReducer from "../slices/userSlice";
import tourReducer from "../slices/tourSlice";
import orderReducer from "../slices/orderSlice";
import hotelzReducer from "../slices/zhotelSlice";
import vehiclezReducer from "../slices/zvehicleSlice";
import discountReducer from "../slices/discountSlice";
import hotelReducer from "../slices/hotelSlice";
import commissionReducer from "../slices/commissionSlice";
// import productReducer from "../slices/productSlice";
// import categoryReducer from "../slices/categorySlice";
// import cartReducer from "../slices/cartSlice";
// import userReducer from "../slices/userSlice";
// import orderReducer from "../slices/orderSlice";
// import storage from "redux-persist/lib/storage";
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";

// const persistConfig = {
//   key: "root",
//   version: 1,
//   storage,
// };

// const rootReducer = combineReducers({
//   account: accountReducer,
//   cart: cartReducer,
//   product: productReducer,
//   category: categoryReducer,
//   user: userReducer,
//   order: orderReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: {
    account: accountReducer,
    user: userReducer,
    tour: tourReducer,
    order: orderReducer,
    discount: discountReducer,
    commission: commissionReducer,
    hotel: hotelReducer,
    hotelz: hotelzReducer,
    vehiclez: vehiclezReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
