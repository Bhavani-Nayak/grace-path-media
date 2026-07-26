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
  return (
    <div
      className={`rounded-card liquid-glass p-6 text-center ${className}`}
      role="alert"
    >
      <p className="text-red-400 mb-2">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm text-[var(--color-accent-warm)] hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
