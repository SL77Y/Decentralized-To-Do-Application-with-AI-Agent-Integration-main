import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  className = "",
  ...props
}) => {
  const baseStyles = `
    relative inline-flex items-center justify-center
    rounded-lg font-medium
    transform transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    hover:-translate-y-0.5 active:translate-y-0
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
  `;

  const variants = {
    primary: `
      bg-blue-600 hover:bg-blue-700 
      text-white
      focus:ring-blue-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-gray-600 hover:bg-gray-700 
      text-white
      focus:ring-gray-500
      shadow-sm hover:shadow-md
    `,
    outline: `
      border-2 border-blue-600 
      text-blue-600 hover:bg-blue-50
      focus:ring-blue-500
    `,
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const loading = isLoading ? "relative !text-transparent transition-none" : "";

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${loading}
        ${className}
      `}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {children}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
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
        </div>
      )}
    </button>
  );
};
