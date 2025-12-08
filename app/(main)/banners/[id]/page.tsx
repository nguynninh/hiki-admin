"use client";

import bannerAPI from "@/apis/bannerAPI";
import BannerForm from "@/components/forms/BannerForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { use as useReact } from "react";
import { toast } from "sonner";

const EditBannerPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const { t } = useTranslation();
    const router = useRouter();
    // Using simple unwrapping since params is a Promise in recent Next.js versions
    const { id } = useReact(params);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await bannerAPI.getDetail(id);
                if (res && res.data) {
                    setInitialData(res.data.banner);
                }
            } catch (error) {
                toast.error(t("banner:fetch_failed", { defaultValue: "Failed to load banner" }));
                router.push("/banners");
            } finally {
                setIsFetching(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    const handleSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            await bannerAPI.update(id, data);
            toast.success(t("banner:updated_success", { defaultValue: "Banner updated successfully" }));
            router.push("/banners");
        } catch (error) {
            console.error(error);
            toast.error(t("banner:update_failed", { defaultValue: "Failed to update banner" }));
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <BannerForm
            title={t("banner:edit_banner", { defaultValue: "Edit Banner" })}
            initialData={initialData}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
    );
};

export default EditBannerPage;
