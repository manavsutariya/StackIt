import { useState, useCallback } from "react"

export const useLogin = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });
    const [startValidate, setStartValidate] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");

    const validateField = useCallback((name, value) => {
        switch (name) {
            case "email":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(value)
                    ? "Please enter a valid email address"
                    : "";
            case "password":
                return value.length < 1 ? "Password is required" : "";
            default:
                return "";
        }
    }, []);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (startValidate[name] && errors[name]) {
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
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // const success = Math.random() > 0.2; // 80% success rate for demo
            const obj = {
                success: true,
                data: { user: { id: 1, email: formData.email, name: formData.fullName } },
                error: { email: "Email already exists" }
            };

            if (obj.success) {
                setMessage("Login successful!");
            } else {
                setMessage("Invalid email or password. Please try again.");
            }
        } catch (error) {
            setMessage("Something went wrong. Please try again.");
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
    };
};