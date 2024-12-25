'use client';

import { useState } from 'react';
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { isValidMobile } from '@/utils/phoneValidation';

import styles from './OtpForm.module.css';
import { useSendOtp } from '@/utils/auth';


function SendOtpForm({ setStep, setMobile, mobile, timer, isTimerActive, startTimer }) {
    const [error, setError] = useState("");

    // Use the custom hook
    const { mutate: sendOtp, isLoading } = useSendOtp();

    const submitHandler = (e) => {
        e.preventDefault();

        // Validate the mobile number
        if (!isValidMobile(mobile)) {
            setError('شماره وارد شده معتبر نمیباشد');
            return;
        }

        setError("");

        // If the timer is active, prevent resending
        if (isTimerActive) {
            setError("لطفاً منتظر بمانید تا تایمر تمام شود");
            return;
        }

        // Trigger the OTP sending
        sendOtp(
            { mobile },
            {
                onSuccess: (response) => {
                    // Log the entire response for clarity
                    console.log('API response:', response);

                    // Check if the response indicates success
                    if (response?.data?.message === 'کد اعتبارسنجی ارسال شد.') {
                        console.log('OTP sent successfully:', response.data);
                        setStep(2); // Move to the next step
                        startTimer(); // Start the countdown timer
                    } else {
                        console.error('Unexpected response format or failure:', response.data);
                        setError("خطایی در ارسال کد رخ داده است");
                    }
                },
                onError: (error) => {
                    console.error('Error sending OTP:', error.response?.data || error.message);
                    setError("خطایی در ارسال کد رخ داده است");
                },
            }
        );

    };

    return (
        <div className={styles.inputContainer}>
            <form onSubmit={submitHandler}>
                <h2 style={{ marginTop: "59px", textAlign: "center" }}>ورود به تورینو</h2>
                <div className={styles.inputBox}>
                    <label htmlFor="input">شماره موبایل خود را وارد کنید</label>
                    <input
                        type="text"
                        id="input"
                        placeholder={digitsEnToFa('0912***4567')}
                        onChange={(e) => setMobile(e.target.value)}
                    />
                    {!!error && <p className={styles.error}>{error}</p>}
                    <button
                        className={styles.submit}
                        type="submit"
                        disabled={isLoading || isTimerActive}
                    >
                        {isLoading ? 'در حال ارسال...' : 'ارسال'}
                    </button>
                    {isTimerActive && (
                        <p className={styles.timer}>
                            لطفاً {digitsEnToFa(Math.floor(timer / 60))}:
                            {digitsEnToFa(timer % 60 < 10 ? `0${timer % 60}` : timer % 60)} صبر کنید
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default SendOtpForm;
