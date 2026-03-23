'use client'

import { ApiErrorResponse } from "@/types/types";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface CancelAppointmentParams {
    appointmentId: string,
    handleFetchData: () => void
}

export function useCancelAppointment() {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancelAppointment = async ({ appointmentId, handleFetchData }: CancelAppointmentParams) => {
        try {
            setIsCancelling(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/${appointmentId}/reject`, {
                withCredentials: true
            });

            if (response.data.success) {
                toast.success(response.data.message || "Appointment rejected");
                handleFetchData();
            }
        } catch (error: any) {
            if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const apiError = error.response?.data;
                toast.error(apiError?.error[0]?.message || "Something went wrong");
            }
        } finally {
            setIsCancelling(false);
        }
    }

    return { handleCancelAppointment, isCancelling };
}