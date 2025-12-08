"use client";

import bannerAPI from "@/apis/bannerAPI";
import BannerForm from "@/components/forms/BannerForm";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const CreateBannerPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await bannerAPI.create(data);
            toast.success(t("banner:created_success", { defaultValue: "Banner created successfully" }));
            router.push("/banners");
        } catch (error) {
            console.error(error);
            toast.error(t("banner:create_failed", { defaultValue: "Failed to create banner" }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <BannerForm
            title={t("banner:create_banner", { defaultValue: "Create Banner" })}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default CreateBannerPage;
