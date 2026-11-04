/**
 * Confirmation Modal Component
 *
 * Reusable modal for confirming destructive actions.
 * Professional design with danger/warning variants.
 */

import React, { useEffect } from "react";
import { Info, Trash2, TriangleAlert } from "lucide-react";

// ==================== TYPES ====================

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

// ==================== VARIANT STYLES ====================

const variantStyles = {
  danger: {
    Icon: Trash2,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  warning: {
    Icon: TriangleAlert,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    Icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
};

// ==================== COMPONENT ====================

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const styles = variantStyles[variant];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, isLoading, onClose]);

  // Prevent body scroll when modal is open
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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white border border-mist-300 rounded-2xl shadow-xl max-w-md w-full p-6">
          {/* Icon */}
          <div
            className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${styles.iconBg} mb-4`}
          >
            <styles.Icon
              className={`h-6 w-6 ${styles.iconColor}`}
              aria-hidden="true"
            />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-navy-800 text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-sm text-mist-600 text-center mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-mist-300 rounded-lg text-sm font-medium text-navy-800 bg-mist-100 hover:bg-mist-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${styles.confirmButton}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
