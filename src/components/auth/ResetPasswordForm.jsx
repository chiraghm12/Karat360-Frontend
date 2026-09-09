import { useState } from "react";
import { Link, Navigate } from "react-router";
import { TbLogout2, FiAlertCircle } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { publicApi } from "../../services/api";
import RingLoader from "../common/RingLoader";
import { useLocation } from "react-router-dom";
import ToastMessage from "../common/ToastMessage";

const ResetPasswordForm = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    // const [error, setError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Validation functions like SignUpForm
    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        let hasError = false;
        const newPwdError = validatePassword(newPassword);
        const confirmPwdError = validatePassword(confirmPassword);
        setNewPasswordError(newPwdError);
        setConfirmPasswordError(confirmPwdError);
        if (newPwdError || confirmPwdError) {
            hasError = true;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        }
        if (hasError) return;

        // If no errors, proceed with password reset
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get("token");
        if (!token) {
            ToastMessage.error("Invalid or missing token");
            return;
        }
        const uid = queryParams.get("uid");
        if (!uid) {
            ToastMessage.error("Invalid or missing user ID");
            return;
        }
        setLoading(true);
        try {
            console.log("Resetting password for UID:", uid, "with token:", token);
            const response = await publicApi.post("/user/reset-password/", {
                new_password: newPassword,
                confirm_new_password: confirmPassword,
                token: token,
                uid: uid,
            });
            ToastMessage.success("Password reset successfully");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Reset password error:", error);
            ToastMessage.error(
                error?.response?.data?.detail ||
                error?.response?.data?.non_field_errors[0] ||
                error?.message ||
                "Failed to reset password. Please try again."
            );
        } finally {
            setLoading(false);
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
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword}>
                        <Label htmlFor="newPassword">
                            New Password <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                if (newPasswordError) setNewPasswordError("");
                            }}
                            error={!!newPasswordError}
                        />
                        {newPasswordError && (
                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                <FiAlertCircle name="AlertCircle" size={14} className="mr-1" />
                                {newPasswordError}
                            </p>
                        )}
                        <Label htmlFor="confirmPassword" className="mt-4">
                            Confirm Password <span className="text-error-500">*</span>
                        </Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) setConfirmPasswordError("");
                            }}
                            error={!!confirmPasswordError}
                        />

                        {confirmPasswordError && (
                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                <FiAlertCircle name="AlertCircle" size={14} className="mr-1" />
                                {confirmPasswordError}
                            </p>
                        )}
                        <Button type="submit" className="mt-4 w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <RingLoader /> Saving...
                                </span>
                            ) : (
                                "Save New Password"
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
                                Back to Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordForm;
