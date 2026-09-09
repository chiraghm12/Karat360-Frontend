import { useState } from "react";
import { Link, Navigate } from "react-router";
import {
    IoMdEye,
    IoMdEyeOff,
    MdMailOutline,
    MdOutlineLock,
    FiAlertCircle,
} from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import ToastMessage from "../common/ToastMessage";
import { publicApi } from "../../services/api";
import RingLoader from "../common/RingLoader";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../slice/user/userSlice";

const SignInForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const { login } = useAuth();

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
            return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        // if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    const signInHandle = async (e) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        setEmailError(emailError);
        setPasswordError(passwordError);
        if (emailError || passwordError) {
            return;
        }
        setLoading(true);
        try {
            // Dummy Login
            console.log("Dummy login triggered for:", email);
            const mockToken = "dummy-access-token";
            await login(mockToken);
            dispatch(setUserInfo({ id: 1, email: email, name: "Admin" }));
            ToastMessage.success("Login Successful");
            setIsSubmitted(true);
        } catch (error) {
            console.error("Login error:", error);
            ToastMessage.error(
                error?.response?.data?.detail ||
                error?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return <Navigate to="/shop/dashboard" />;
    }

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar p-6 sm:p-10 justify-center">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-900 text-title-sm dark:text-white sm:text-title-md">
                            Sign In
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Enter your email and password to sign in!
                        </p>
                    </div>

                    {/* Social sign in */}
                    {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
            <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"> */}
                    {/* Google icon */}
                    {/* <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path fill="#4285F4" d="M18.75 10.19...Z" />
                <path fill="#34A853" d="M10.18 18.75...Z" />
                <path fill="#FBBC05" d="M5.1 11.73...Z" />
                <path fill="#EB4335" d="M10.18 4.63...Z" />
              </svg>
              Sign in with Google
            </button>

            <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"> */}
                    {/* X (Twitter) icon */}
                    {/* <svg width="21" height="20" fill="none" viewBox="0 0 21 20">
                <path className="fill-current" d="M15.67 1.875H18.43L12.4...Z" />
              </svg>
              Sign in with X
            </button>
          </div> */}

                    {/* Or divider */}
                    {/* <div className="relative py-3 sm:py-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                Or
              </span>
            </div>
          </div> */}

                    {/* Form */}
                    <form onSubmit={signInHandle}>
                        <div className="space-y-6">
                            <div>
                                <Label htmlFor="email">
                                    Email <span className="text-error-500">*</span>
                                </Label>
                                <Input
                                    placeholder="info@gmail.com"
                                    type="email"
                                    name="email"
                                    id="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setEmailError("");
                                    }}
                                    iconLeft={
                                        <MdMailOutline className="size-5 fill-gray-500 dark:fill-gray-400" />
                                    }
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
                            </div>

                            <div>
                                <Label htmlFor="password">
                                    Password <span className="text-error-500">*</span>
                                </Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        id="password"
                                        name="password"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setPasswordError("");
                                        }}
                                        iconLeft={
                                            <MdOutlineLock className="size-5 fill-gray-500 dark:fill-gray-400" />
                                        }
                                        error={!!passwordError}
                                    />
                                    <span
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                    >
                                        {showPassword ? (
                                            <IoMdEye className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        ) : (
                                            <IoMdEyeOff className="fill-gray-500 dark:fill-gray-400 size-5" />
                                        )}
                                    </span>
                                </div>
                                {passwordError && (
                                    <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                        <FiAlertCircle
                                            name="AlertCircle"
                                            size={14}
                                            className="mr-1"
                                        />
                                        {passwordError}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                                        Keep me logged in
                                    </span>
                                </div>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <div>
                                <Button
                                    className="w-full"
                                    size="sm"
                                    type="submit"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <RingLoader className="h-5 w-5 mr-2 text-white" /> Signing
                                            in...
                                        </span>
                                    ) : (
                                        "Sign in"
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Sign up link */}
                    <div className="mt-5">
                        <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
