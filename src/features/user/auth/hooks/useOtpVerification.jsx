import { useState, useCallback } from "react"

export const useOtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isBlocked, setIsBlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const startResendTimer = useCallback(() => {
    setCanResend(false);
    setResendTimer(60);

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setMessage("Please enter complete 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const success = Math.random() > 0.3; // 70% success rate for demo

      if (success) {
        setMessage("Email verified successfully!");
        setAttempts(0);
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= 3) {
          setIsBlocked(true);
          setMessage(
            "Too many failed attempts. Please try again after 1 hour."
          );
        } else {
          setMessage("Invalid OTP. Please try again.");
        }
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("OTP sent successfully!");
      startResendTimer();
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    otp,
    isLoading,
    message,
    canResend,
    resendTimer,
    isBlocked,
    handleOtpChange,
    handleKeyDown,
    handleVerify,
    handleResend,
    startResendTimer,
  };
};