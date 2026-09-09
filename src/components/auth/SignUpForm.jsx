import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { IoMdEye, IoMdEyeOff, FiAlertCircle } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import { publicApi } from "../../services/api";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../../slice/user/userSlice";
import RingLoader from "../common/RingLoader";
import ToastMessage from "../common/ToastMessage";

const SignUpForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fnameError, setFirstNameError] = useState("");
    const [lnameError, setLastNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [checkboxError, setCheckboxError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const validateFirstName = (value) => {
        if (!value) return "First Name is required";
        if (value.length < 2) return "First Name must be at least 2 characters";
        return "";
    };

    const validateLastName = (value) => {
        if (!value) return "Last Name is required";
        if (value.length < 2) return "Last Name must be at least 2 characters";
        return "";
    };

    const validateEmail = (value) => {
        if (!value) return "Email is required";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
            return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "Password is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        return "";
    };

    const signUpHandle = async (e) => {
        e.preventDefault();
        const firstNameError = validateFirstName(firstName);
        const lastNameError = validateLastName(lastName);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const checkboxError = isChecked
            ? ""
            : "You must agree to the Terms and Conditions.";
        setFirstNameError(firstNameError);
        setLastNameError(lastNameError);
        setEmailError(emailError);
        setPasswordError(passwordError);
        setCheckboxError(checkboxError);
        if (
            emailError ||
            passwordError ||
            firstNameError ||
            lastNameError ||
            checkboxError
        ) {
            return;
        }
        setLoading(true);
        try {
            const response = await publicApi.post("user/register/", {
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: password,
            });
            dispatch(
                setUserInfo({
                    first_name: firstName,
                    last_name: lastName,
                    email: email,
                })
            );
            ToastMessage.success(
                "Sign Up Successful! Please check your email to verify your account."
            );
            setIsSubmitted(true);
        } catch (error) {
            console.error("Sign Up Error:", error);
            ToastMessage.error("Sign Up Failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isSubmitted) {
        return <Navigate to="/otp-verification" />;
    }

    return (
        <div className="flex flex-col flex-1 w-full overflow-y-auto lg:w-1/2 no-scrollbar">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign Up
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign up!
                        </p>
                    </div>

                    <div>
                        {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"> */}
                        {/* Google Button */}
                        {/* <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"> */}
                        {/* Google Icon SVG */}
                        {/* <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                  <path d="..." fill="#4285F4" />
                  <path d="..." fill="#34A853" />
                  <path d="..." fill="#FBBC05" />
                  <path d="..." fill="#EB4335" />
                </svg>
                Sign up with Google
              </button> */}

                        {/* Twitter/X Button */}
                        {/* <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path d="..." />
                </svg>
                Sign up with X
              </button>
            </div> */}

                        {/* Divider */}
                        {/* <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div> */}

                        <form onSubmit={signUpHandle}>
                            <div className="space-y-5">
                                {/* First/Last Name */}
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="fname">
                                            First Name<span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="fname"
                                            name="fname"
                                            placeholder="Enter your first name"
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                                setFirstNameError("");
                                            }}
                                            error={!!fnameError}
                                        />
                                        {fnameError && (
                                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                                <FiAlertCircle
                                                    name="AlertCircle"
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {fnameError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="sm:col-span-1">
                                        <Label htmlFor="lname">
                                            Last Name<span className="text-error-500">*</span>
                                        </Label>
                                        <Input
                                            type="text"
                                            id="lname"
                                            name="lname"
                                            placeholder="Enter your last name"
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                                setLastNameError("");
                                            }}
                                            error={!!lnameError}
                                        />
                                        {lnameError && (
                                            <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                                <FiAlertCircle
                                                    name="AlertCircle"
                                                    size={14}
                                                    className="mr-1"
                                                />
                                                {lnameError}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <Label htmlFor="email">
                                        Email<span className="text-error-500">*</span>
                                    </Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setEmailError("");
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
                                </div>

                                {/* Password */}
                                <div>
                                    <Label htmlFor="password">
                                        Password<span className="text-error-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter your password"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setPasswordError("");
                                            }}
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

                                {/* Checkbox */}
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        className="w-5 h-5"
                                        checked={isChecked}
                                        onChange={() => {
                                            setIsChecked((prev) => !prev);
                                            setCheckboxError("");
                                        }}
                                    />
                                    <p className="inline-block font-normal text-gray-500 dark:text-gray-400">
                                        By creating an account means you agree to the{" "}
                                        <span className="text-gray-800 dark:text-white/90">
                                            Terms and Conditions,
                                        </span>{" "}
                                        and our{" "}
                                        <span className="text-gray-800 dark:text-white">
                                            Privacy Policy
                                        </span>
                                    </p>
                                </div>
                                {checkboxError && (
                                    <p className="mt-1.5 text-xs text-error-500 flex items-center">
                                        <FiAlertCircle
                                            name="AlertCircle"
                                            size={14}
                                            className="mr-1"
                                        />
                                        {checkboxError}
                                    </p>
                                )}

                                {/* Submit Button */}
                                <div>
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-full px-4 py-3 text-sm font-bold text-gray-950 transition rounded-lg bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md shadow-amber-500/25 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center">
                                                <RingLoader className="h-5 w-5 mr-2 text-white" />
                                                Signing Up...
                                            </span>
                                        ) : (
                                            "Sign Up"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Already have an account?{" "}
                                <Link
                                    to="/signin"
                                    className="font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
