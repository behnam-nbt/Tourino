import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";

export const useSendOtp = () => {
    const mutationFn = (data) => api.post('/auth/send-otp', data);
    return useMutation({ mutationFn });
}

export const useCheckOtp = () => {
    const mutationFn = (data) => api.post("auth/check-otp", data);

    return useMutation({ mutationFn });
};  