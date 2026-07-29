import { sanitizeErrorForUI } from "@/lib/error-utils";

interface ErrorMessageProps {
  message: string;
  className?: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  message,
  className = "",
  onRetry,
}: ErrorMessageProps) {
  const cleanMessage = sanitizeErrorForUI(message);

  return (
    <div
      className={`rounded-card liquid-glass p-6 text-center ${className}`}
      role="alert"
    >
      <p className="text-red-500 font-medium mb-2">{cleanMessage}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-semibold text-[#c5a059] hover:underline cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
