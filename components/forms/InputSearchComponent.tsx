"use client";

import { Search } from "lucide-react";
import { useEffect, useRef } from "react";

interface Props {
    placeholder?: string;
    shape?: "circle" | "square";
    onChange?: (value: string) => void;
}

const InputSearchComponent = (props: Props) => {
    const { placeholder, shape, onChange } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "f") {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <div className="relative w-full max-w-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-neutral-500" />
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                className={`h-10 w-full bg-neutral-100 pl-10 pr-12 text-sm outline-none placeholder:text-neutral-500 focus:ring-2 focus:ring-neutral-200 ${shape === "square" ? "rounded" : "rounded-full"}`}
                onChange={(e) => onChange?.(e.target.value)}
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-neutral-200 px-1.5 font-mono text-[10px] font-medium text-neutral-500 opacity-100">
                    <span className="text-xs">⌘</span>F
                </kbd>
            </div>
        </div>
    );
};

export default InputSearchComponent;