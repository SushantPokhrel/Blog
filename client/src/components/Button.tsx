import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  ref?: React.RefObject<HTMLButtonElement | null>;
};

const baseStyle = "font-semibold rounded cursor-pointer transition-all";
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  ref,
}) => {
  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
