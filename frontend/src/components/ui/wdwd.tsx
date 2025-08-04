import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg" | "fatter";
  shadow?: boolean;
  rounded?: "none" | "md" | "full" | "fat";
  animated?: boolean;
};

export const buttonBaseStyles =
  "cursor-pointer font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200";

export const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-100 focus:ring-blue-300",
  outline:
    "border border-blue-600 text-blue-600 bg-transparent hover:bg-blue-600 hover:text-white focus:ring-blue-400",
};

export const sizes = {
  sm: "text-sm px-4 py-2",
  md: "text-base px-6 py-3",
  lg: "text-lg px-8 py-4",
  fatter: "text-lg px-10 py-5",
};

const roundedClasses = {
  none: "rounded-none",
  md: "rounded-lg",
  full: "rounded-full",
  fat: "rounded-2xl",
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  shadow = false,
  rounded = "md",
  animated = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonBaseStyles} ${variants[variant]} ${sizes[size]} ${
        roundedClasses[rounded]
      } ${shadow ? "shadow-lg" : ""} ${animated ? "bounce-transform" : ""} ${className}`}
      {...props}
    />
  );
}