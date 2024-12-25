'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'; // For redirection
import Cookies from "js-cookie"; // To access tokens in cookies

import { IoClose } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";

import SendOtpForm from "../module/SendOtpForm";
import CheckOtpForm from "../module/CheckOtpForm";

import styles from './Auth.module.css';
import ModalContainer from "../partials/containers/ModalContainer";

function Auth({ isModalOpen, setIsModalOpen }) {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(90); // Initial timer value in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);

  const router = useRouter();

  useEffect(() => {
    let interval;
    if (isTimerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false); // Disable the timer when it reaches 0
      setStep(1);
    }
    return () => clearInterval(interval); // Cleanup interval
  }, [isTimerActive, timer]);

  const startTimer = () => {
    setTimer(90); // Reset timer to 90 seconds
    setIsTimerActive(true); // Activate timer
  };

  useEffect(() => {
    const token = Cookies.get("accessToken"); // Get the token from cookies
    if (token) {
      router.push('/'); // Redirect to home if token exists
    }
  }, [router]); // Run once on mount

  return (
    <ModalContainer isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} >
      <div className={styles.modalbox}>
        {step === 1 ? (<div className={styles.close} onClick={() => setIsModalOpen(false)}><IoClose /></div>) : (
          <div className={styles.close} onClick={() => setStep(1)}><BiArrowBack /></div>
        )}
        {step === 1 &&
          <SendOtpForm
            setStep={setStep}
            mobile={mobile}
            setMobile={setMobile}
            timer={timer}
            isTimerActive={isTimerActive}
            startTimer={startTimer} />}
        {step === 2 &&
          <CheckOtpForm
            code={code}
            setCode={setCode}
            mobile={mobile}
            setStep={setStep}
            timer={timer}
            isTimerActive={isTimerActive} />}
      </div>
    </ModalContainer>
  );
}

export default Auth;
