import axios from "axios"
import { AppDispatch } from "@/redux/store"
import { setUser, clearUser, setLoading, User } from "./authSlice"

interface ApiResponse {
  statusCode: number,
  success: boolean,
  error: [],
  message: string,
  data: User
}

export const fetchCurrentUser =
  () => async (dispatch: AppDispatch): Promise<void> => {
    dispatch(setLoading(true))

    try {
      const res = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/users/user/details`,
        {
          withCredentials: true,
        }
      )

      if (res.data.success) {
        dispatch(setUser(res.data.data))
      } else {
        dispatch(clearUser())
      }
    } catch (error) {
      dispatch(clearUser())
    } finally {
      dispatch(setLoading(false))
    }
  }