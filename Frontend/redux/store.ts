import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/users/authSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// optional but recommended types
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch