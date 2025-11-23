"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeSlash, InfoCircle } from "iconsax-reactjs";
import React from "react";

interface Props {
  value: string;
  placeholder?: string;
  type?:
    | "text"
    | "password"
    | "email"
    | "number"
    | "date"
    | "time"
    | "textarea";
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  prefix?: React.ReactNode;
  variant?: "outlined" | "filled" | "borderless" | "underlined";
  disabled?: boolean;
  error?: string;
  info?: string;
}

const variantClasses = {
  outlined: "border border-input bg-background",
  filled: "border-0 bg-muted",
  borderless: "border-0 bg-transparent",
  underlined: "border-0 border-b border-input rounded-none bg-transparent px-0",
};

const InputComponent = ({
  value,
  placeholder,
  type = "text",
  onChange,
  prefix,
  variant = "outlined",
  disabled,
  error,
  info,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const wrapperClasses = `w-full ${variantClasses[variant]} ${
    prefix ? "pl-10" : ""
  } ${
    error
      ? "border-red-500 ring-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
      : ""
  }`;

  const renderTextInput = () => (
    <>
      <Input
        value={value}
        placeholder={placeholder}
        type="text"
        disabled={disabled}
        onChange={onChange}
        className={wrapperClasses}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
      >
        {info && <InfoCircle size={14} />}
      </button>
    </>
  );

  const renderPasswordInput = () => {
    const actualType = showPassword ? "text" : "password";

    return (
      <>
        <Input
          value={value}
          placeholder={placeholder ?? "••••••••"}
          type={actualType}
          disabled={disabled}
          onChange={onChange}
          className={wrapperClasses}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
        >
          {showPassword ? <EyeSlash size={14} /> : <Eye size={14} />}
        </button>
      </>
    );
  };

  const renderInputByType = () => {
    switch (type) {
      case "password":
        return renderPasswordInput();
      default:
        return renderTextInput();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none z-10">
            {prefix}
          </div>
        )}
        {renderInputByType()}
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default InputComponent;
