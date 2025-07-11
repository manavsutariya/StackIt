import { useState } from "react"
import { useRouter } from "next/navigation"; 

export const useForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [startValidate, setStartValidate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(email) ? "Please enter a valid email address" : "";
    };

    const handleInputChange = (value) => {
        setEmail(value);
        if (startValidate && error) {
            const newError = validateEmail(value);
            setError(newError);
        }
    };

    const handleBlur = () => {
        setStartValidate(true);
        const newError = validateEmail(email);
        setError(newError);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setStartValidate(true);
            setIsLoading(false);
            return;
        }

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMessage("Password reset link sent to your email address.");
            router.push("/otp-verification?from=forgot-password");
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        error,
        startValidate,
        isLoading,
        message,
        handleInputChange,
        handleBlur,
        handleSubmit,
    };
};