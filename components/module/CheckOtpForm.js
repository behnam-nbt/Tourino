'use client';

import { useState } from "react";

import OtpInput from "react18-input-otp";

import { setTokens } from '@/utils/tokenHandler';
import { digitsEnToFa } from "@persian-tools/persian-tools";
import { useCheckOtp } from "@/utils/auth";

import styles from './OtpForm.module.css';

function CheckOtpForm({ code, setCode, mobile, setStep, timer, isTimerActive }) {
  const [error, setError] = useState("");
  // Use the custom hook
  const { mutate: checkOtp, isLoading } = useCheckOtp();

  const submitHandler = (e) => {
    e.preventDefault();
  
    checkOtp(
      { mobile, code }, // Request payload
      {
        onSuccess: (response) => {
          // Extract accessToken and refreshToken from the response
          const { accessToken, refreshToken } = response.data;
  
          if (accessToken && refreshToken) {
            setTokens({ accessToken, refreshToken }); // Store the tokens
            window.location.href = '/profile'; // Redirect on success
          } else {
            setError('خطا در احراز هویت')
          }
        },
        onError: () => {
          setError("کد تایید معتبر نمی باشد");
          setCode("");
        },
      }
    );
  };
  

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className={styles.modalTitle}>
          <h2>کد تایید را وارد کنید</h2>
          <p>کد تایید به شماره {digitsEnToFa(mobile)} ارسال شد.</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", direction: "ltr", marginTop: "1rem" }}>
          <OtpInput
            value={code}
            onChange={(value) => setCode(value)}
            numInputs={6}
            inputStyle={{
              border: "1px solid silver",
              borderRadius: "5px",
              width: "49px",
              height: "45px",
              marginRight: "5px",
              justifyContent: "center"
            }}
          />
        </div>
        {!!error && <p className={styles.error}>{error}</p>}
        {isTimerActive && (
          <p className={styles.timer}>
            ارسال مجدد کد: {digitsEnToFa(Math.floor(timer / 60))}:
            {digitsEnToFa(timer % 60 < 10 ? `0${timer % 60}` : timer % 60)}
          </p>
        )}
        <button
          className={styles.submit}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'در حال ارسال...' : 'ورود به تورینو'}
        </button>
      </form>
    </div>
  );
}

export default CheckOtpForm;
