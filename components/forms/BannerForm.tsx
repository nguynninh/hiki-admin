"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BannerFormProps {
    initialData?: any;
    onSubmit: (data: FormData) => Promise<void>;
    isLoading?: boolean;
    title: string;
}

const BannerForm = ({ initialData, onSubmit, isLoading, title }: BannerFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        link: "",
        priority: 0,
        is_active: "true", // Using string for Select
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                link: initialData.link || "",
                priority: initialData.priority || 0,
                is_active: initialData.is_active !== undefined ? String(initialData.is_active) : "true",
            });
            if (initialData.image_url) {
                setImagePreview(initialData.image_url);
            }
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        data.append("title", formData.title);
        data.append("link", formData.link);
        data.append("priority", formData.priority.toString());
        data.append("is_active", formData.is_active);
        if (imageFile) {
            data.append("image", imageFile);
        }

        await onSubmit(data);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 gap-2" onClick={() => router.back()}>
                    <ChevronLeft className="w-4 h-4" />
                    {t('common:back', { defaultValue: "Back" })}
                </Button>
                <h1 className="text-2xl font-bold mt-2">{title}</h1>
            </div>

            <Card className="bg-white/10 dark:bg-black/20 backdrop-blur-md border-white/20">
                <CardContent className="p-6 space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>{t('banner:image', { defaultValue: "Image" })}</Label>
                            <div className="flex items-center gap-4">
                                <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Upload className="w-8 h-8 mb-2 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm">{t('banner:click_to_upload', { defaultValue: "Click to upload" })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">{t('banner:title', { defaultValue: "Title" })}</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder={t('banner:enter_title', { defaultValue: "Enter banner title" })}
                                required
                                className="bg-transparent"
                            />
                        </div>

                        {/* Link */}
                        <div className="space-y-2">
                            <Label htmlFor="link">{t('banner:link', { defaultValue: "Link (Optional)" })}</Label>
                            <Input
                                id="link"
                                value={formData.link}
                                onChange={(e) => handleChange("link", e.target.value)}
                                placeholder="https://..."
                                className="bg-transparent"
                            />
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">{t('banner:priority', { defaultValue: "Priority" })}</Label>
                            <Input
                                id="priority"
                                type="number"
                                value={formData.priority}
                                onChange={(e) => handleChange("priority", e.target.value)}
                                className="bg-transparent"
                            />
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <Label>{t('banner:status', { defaultValue: "Status" })}</Label>
                            <Select
                                value={formData.is_active}
                                onValueChange={(val) => handleChange("is_active", val)}
                            >
                                <SelectTrigger className="w-full bg-transparent">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">{t('common:active', { defaultValue: "Active" })}</SelectItem>
                                    <SelectItem value="false">{t('common:inactive', { defaultValue: "Inactive" })}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {t('common:save', { defaultValue: "Save" })}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BannerForm;
