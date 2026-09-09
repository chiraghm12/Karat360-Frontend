import React, { useEffect } from "react";
import { FaRegTrashCan } from "../../icons";

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <div
                className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm transition-opacity duration-300 ease-out"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-6 max-w-sm w-full shadow-2xl z-10 transform scale-100 transition-all duration-300 ease-out flex flex-col items-center text-center animate-[zoomIn_0.2s_ease-out]">

                {/* Warning Circular Icon */}
                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 flex items-center justify-center mb-4 ring-8 ring-red-50/50 dark:ring-red-500/5 transform hover:scale-105 transition-transform duration-300">
                    <FaRegTrashCan className="size-6" />
                </div>

                {/* Text Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white/90 leading-tight">
                    {title}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2.5 leading-relaxed">
                    {message}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3 w-full mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 border border-gray-250/20 dark:border-gray-700/50 rounded-xl transition-all duration-200"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-xl transition-all duration-200 shadow-md shadow-red-500/10"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Zoom In Animation Style */}
            <style>{`
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
        </div>
    );
};

export default ConfirmModal;
