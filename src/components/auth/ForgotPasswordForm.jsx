import { useState } from "react";
import { Link, Navigate } from "react-router";
import { TbLogout2, FiAlertCircle } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import ToastMessage from "../common/ToastMessage";
import RingLoader from "../common/RingLoader";
import { publicApi } from "../../services/api";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [loading, setLoading] = useState(false); // Loading state

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
            return "Enter a valid email address";
        return "";
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        const errorMsg = validateEmail(email);
        setEmailError(errorMsg);
        if (errorMsg) {
            return;
        }
        setLoading(true); // Set loading to true
        try {
            // Simulate API call for forgot password
            const response = await publicApi.post("user/forgot-password/", {
                email: email,
            });
            ToastMessage.success("Password reset link sent to your email");
            setIsSubmitted(true);
        } catch (error) {
            // Optionally handle error
            console.error("Forgot password error:", error);
            ToastMessage.error(
                error?.response?.data?.detail || error?.response?.data?.email[0] ||
                error?.message ||
                "An error occurred while sending the reset link"
            );
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    if (isSubmitted) {
        return <Navigate to="/signin" />;
    }

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Forgot Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email to reset your password!
                        </p>
                    </div>

                    <form onSubmit={handleForgotPassword}>
                        <Label htmlFor="email">
                            Email <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError("");
                            }}
                            error={!!emailError}
                        />
                        {emailError && (
                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                <FiAlertCircle
                                    name="AlertCircle"
                                    size={14}
                                    className="mr-1"
                                />
                                {emailError}
                            </p>
                        )}
                        <Button type="submit" className="mt-4 w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <RingLoader /> Sending...
                                </span>
                            ) : (
                                "Send Reset Link"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/signin"
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <Button
                                variant="outline"
                                className="w-full"
                                startIcon={<TbLogout2 className="inline-block mr-2 w-4 h-4" />}
                            >
                                {/* <TbLogout2 className="inline-block mr-2 w-4 h-4" /> */}
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
