import { useState } from "react";
import { Link, Navigate } from "react-router";
import { useSelector } from "react-redux";
import { publicApi } from "../../services/api";
import Label from "../form/Label";
import OTPInput from "../form/input/OTPInput";
import RingLoader from "../common/RingLoader";
import Button from "../ui/button/Button";
import ToastMessage from "../common/ToastMessage";
import { FiAlertCircle } from "../../icons";

const OTPVerificationForm = () => {
    const [otp, setOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [otpError, setOtpError] = useState("");

    const userInfo = useSelector((state) => state.user.userInfo);

    // Validate OTP and email
    const validateOTP = (value) => {
        if (!value || value.trim() === "") return "OTP is required";
        if (value.length !== 6 || !/^[0-9]{6}$/.test(value)) {
            return "OTP must be a 6-digit number";
        }
        return "";
    };

    const validateEmail = (value) => {
        if (!userInfo?.email) return "User Email is required";
        return "";
    };

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        const otpError = validateOTP(otp);
        const emailError = validateEmail(userInfo?.email);
        setOtpError(otpError);
        setEmailError(emailError);
        if (otpError) return;
        if (emailError) {
            ToastMessage.error("Missing user email. Please sign up again.");
            return;
        }

        setLoading(true);
        try {
            const response = await publicApi.post("/user/otp-verify/", {
                otp: otp,
                email: userInfo?.email,
            });
            ToastMessage.success("OTP verified successfully");
            setIsVerified(true);
        } catch (error) {
            console.error("OTP verification error:", error);
            ToastMessage.error(
                error?.response?.data?.detail ||
                error?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Function to handle resend OTP
    const handleResendOTP = async () => {
        if (!userInfo?.email) {
            ToastMessage.error("Missing user email. Please sign up again.");
            return;
        }
        setResendLoading(true);
        try {
            await publicApi.post("/user/resend-otp/", { email: userInfo?.email });
            ToastMessage.success("OTP resent to your email.");
        } catch (error) {
            ToastMessage.error(
                error?.response?.data?.detail ||
                error?.message ||
                "Failed to resend OTP. Please try again."
            );
        } finally {
            setResendLoading(false);
        }
    };

    if (isVerified) {
        return <Navigate to="/signin" />;
    }

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            OTP Verification
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter the OTP sent to your email!
                        </p>
                    </div>

                    <form onSubmit={handleOTPVerification} noValidate>
                        <Label htmlFor="otp">
                            OTP <span className="text-error-500">*</span>
                        </Label>
                        <OTPInput
                            length={6}
                            onChange={(val) => {
                                setOtp(val);
                                if (otpError) setOtpError("");
                            }}
                            error={!!otpError}
                        />
                        {otpError && (
                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                <FiAlertCircle name="AlertCircle" size={14} className="mr-1" />
                                {otpError}
                            </p>
                        )}
                        <Button type="submit" className="mt-4 w-full" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <RingLoader />
                                    Verifying...
                                </span>
                            ) : (
                                "Verify OTP"
                            )}
                        </Button>
                    </form>

                    {/* Resend otp link */}
                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                            Didn't get the code?{" "}
                            <button
                                type="button"
                                className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 bg-transparent border-none p-0 m-0 cursor-pointer transition-colors"
                                disabled={resendLoading}
                                onClick={handleResendOTP}
                            >
                                {resendLoading ? <RingLoader size={18} /> : "Resend"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPVerificationForm;
