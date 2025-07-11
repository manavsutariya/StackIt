import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"; 

export const useSignup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({});
    const [startValidate, setStartValidate] = useState({
        fullName: false,
        email: false,
        password: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validateField = (useCallback(
        (name, value) => {
            switch (name) {
                case "fullName":
                    return value.trim().length < 2
                        ? "Full name must be at least 2 characters"
                        : "";
                case "email":
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return !emailRegex.test(value)
                        ? "Please enter a valid email address"
                        : "";
                case "password":
                    return value.length < 8
                        ? "Password must be at least 8 characters"
                        : "";
                case "confirmPassword":
                    return value !== formData.password ? "Passwords do not match" : "";
                default:
                    return "";
            }
        },
        [formData.password])
    );

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Real-time validation only if field was startValidate and has error
        if (startValidate[name]) {
            const error = validateField(name, value);
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (name) => {
        setStartValidate((prev) => ({ ...prev, [name]: true }));

        const error = validateField(name, formData[name]);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        // Validate all fields
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setStartValidate(
                Object.keys(formData).reduce(
                    (acc, key) => ({ ...acc, [key]: true }),
                    {}
                )
            );
            setIsLoading(false);
            return;
        }

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock response
            /*
const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
});

const obj = await response.json();
*/

            const obj = {
                success: true,
                data: { user: { id: 1, email: formData.email, name: formData.fullName } },
                error: { email: "Email already exists" }
            };

            if (obj.success) {
                setMessage(
                    "Account created successfully! Please check your email for verification."
                );
                router.push("/otp-verification?from=signup");
            } else {
                setMessage(
                    "Email already exists. Please use a different email address."
                );
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            // Simulate Google OAuth
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setMessage("Google signup successful!");
        } catch (error) {
            setMessage("Google signup failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        startValidate,
        isLoading,
        message,
        handleInputChange,
        handleBlur,
        handleSubmit,
        handleGoogleSignup,
    };
};