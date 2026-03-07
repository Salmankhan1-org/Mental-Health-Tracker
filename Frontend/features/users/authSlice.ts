import { createSlice, PayloadAction } from "@reduxjs/toolkit"



export interface User {
  id: string
  name: string
  email: string
  profileImage?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}


const initialState: AuthState = {
  user: null,
  loading: true,
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    clearUser(state) {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setLoading } = authSlice.actions
export default authSlice.reducer