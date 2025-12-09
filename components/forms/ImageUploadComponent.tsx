"use client";

import { UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

interface ImageUploadComponentProps {
    onFileChange: (file: File | null) => void;
    preview?: string | null;
    className?: string;
}

const ImageUploadComponent = ({ onFileChange, preview, className }: ImageUploadComponentProps) => {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            // Usually trigger toast error here, but keeping component simple
            return;
        }
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onFileChange(file);
    };

    const removeImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent triggering click on input label
        setPreviewUrl(null);
        onFileChange(null);
    };

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 transition-colors",
                    dragActive ? "border-primary bg-primary/10" : "border-gray-300"
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
                >
                    {previewUrl ? (
                        <div className="relative w-full h-full p-2">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-contain rounded-md"
                            />
                            <button
                                onClick={removeImage}
                                className="absolute top-4 right-4 p-1 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors z-10"
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                            <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">{t('common:click_to_upload', { defaultValue: "Nhấn để tải lên" })}</span> {t('common:or_drag_drop', { defaultValue: "hoặc kéo thả" })}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG hoặc GIF</p>
                        </div>
                    )}
                    <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </label>
            </div>
        </div>
    );
};

export default ImageUploadComponent;
