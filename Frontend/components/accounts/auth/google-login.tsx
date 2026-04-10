"use-client"

import React from 'react'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios';
import { auth, googleProvider} from '../../../helper/firebase';
import { signInWithPopup } from 'firebase/auth';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '@/features/users/authSlice';
import { useRouter } from 'next/navigation';
import { ApiErrorResponse } from '@/types/types';
import { ToastFunction } from '@/helper/toast-function';
 
function GoogleLogin() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const payload = {
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/users/create-account`,
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if(response?.data?.success){
        const userData = response.data.data;
        dispatch(setUser(userData))
        if (userData.role === "student") {
           if(!userData?.onboardingCompleted){
            router.push("/onboarding")
           }
           router.push("/student/dashboard");
        } else if (userData.role === "counsellor") {
          router.push("/counsellor/dashboard")
        } else if (userData.role === "admin") {
          router.push("/admin/dashboard")
        }
        toast.success(response.data.message);
      }
    } catch (error:any) {
       ToastFunction('error', error);
    }
  };
  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center shadow-lg gap-3 border border-slate-300 cursor-pointer rounded-lg py-2 hover:bg-slate-50 transition"
    >
      <FcGoogle size={20} />
      Continue with Google
    </button>
  )
}

export default GoogleLogin