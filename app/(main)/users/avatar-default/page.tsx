'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AvatarDefaultModal from '@/models/AvatarDefaultModal';
import handleAPI from '@/apis/handleAPI';
import { useTranslation } from 'react-i18next';

const AvatarDefaultPage = () => {
    const [avatars, setAvatars] = useState<AvatarDefaultModal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        fetchAvatars();
    }, []);

    const fetchAvatars = async () => {
        try {
            const res = await handleAPI("/users/avatar-default", {}, 'get');
            setAvatars(res.data.avatars);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const res: any = await handleAPI("/users/avatar-default", { file }, 'post');
            toast.success(res.message);
            fetchAvatars();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res: any = await handleAPI(`/users/avatar-default/${id}`, {}, 'delete');
            toast.success(res.message);
            fetchAvatars();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-8 space-y-8 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        {t("user:users_avatar-default")}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {t("user:users_avatar-default_description")}
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <Button
                        className="relative bg-background/80 backdrop-blur-xl border border-white/20 text-foreground hover:bg-background/90 transition-all duration-300"
                        onClick={() => document.getElementById('avatar-upload')?.click()}
                        disabled={isUploading}>
                        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {t("user:users_avatar-default_upload")}
                    </Button>
                    <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUpload}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            className="group relative aspect-square rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl z-0"></div>

                            <div className="absolute inset-2 z-10 rounded-xl overflow-hidden bg-white/5">
                                <img
                                    src={avatar.id}
                                    alt={avatar.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full w-10 h-10 bg-red-500/80 hover:bg-red-600 border border-white/20 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                    onClick={() => handleDelete(avatar.id)}>
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    <div
                        className="group relative aspect-square rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors duration-300 flex flex-col items-center justify-center cursor-pointer bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                        onClick={() => document.getElementById('avatar-upload')?.click()}>
                        <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-2">
                            <Plus className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">{t("user:users_avatar-default_add_new")}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AvatarDefaultPage;