// hooks/useLogout.ts
'use client'

import { clearUser } from '@/features/users/authSlice';
import { ApiErrorResponse } from '@/types/types';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner';

export function useLogout() {
  const router = useRouter()
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/logout`,{
        withCredentials: true
      });

      if(response?.data?.success){
        dispatch(clearUser());
        router.push('/accounts/auth');
        toast.success(response.data.message);
      }
    } catch (error: unknown) {
        console.log(error);
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiError = error.response?.data

            toast.error(apiError?.error[0].message);
        }
    }
  }

  return logout
}