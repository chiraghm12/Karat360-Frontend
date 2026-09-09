import { toast } from "react-hot-toast";
import { MdCheckCircle, MdError } from "react-icons/md";

/**
 * Usage:
 * import ToastMessage from "../common/ToastMessage";
 * ToastMessage.success("Message");
 * ToastMessage.error("Message");
 */
const ToastMessage = {
    success: (message, options = {}) =>
        toast.success(message, {
            duration: 5000,
            icon: <MdCheckCircle size={28} color="#22c55e" style={{ minWidth: 28, minHeight: 28, zIndex: 99999 }} />,
            style: {
                border: "1px solid #4ade80",
                padding: "16px",
                color: "#166534",
                ...options.style,
            },
            ariaProps: {
                role: "status",
                "aria-live": "polite",
                ...options.ariaProps,
            },
            ...options,
        }),
    error: (message, options = {}) =>
        toast.error(message, {
            duration: 3000,
            icon: <MdError size={28} color="#ef4444" style={{ minWidth: 28, minHeight: 28, zIndex: 99999 }} />,
            style: {
                border: "1px solid #ef4444",
                padding: "16px",
                color: "#991b1b",
                ...options.style,
            },
            ariaProps: {
                role: "alert",
                "aria-live": "assertive",
                ...options.ariaProps,
            },
            ...options,
        }),
};

export default ToastMessage;
