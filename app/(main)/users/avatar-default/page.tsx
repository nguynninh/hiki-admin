'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Upload, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import AvatarDefaultModal from '@/models/AvatarDefaultModal';
import handleAPI from '@/apis/handleAPI';
import { useTranslation } from 'react-i18next';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const AvatarDefaultPage = () => {
    const [avatars, setAvatars] = useState<AvatarDefaultModal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<AvatarDefaultModal | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        fetchAvatars();
    }, []);

    const fetchAvatars = async () => {
        try {
            const res = await handleAPI("/users/avatar-defaults", {}, 'get');
            setAvatars(res.data.avatar_defaults);
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
            const formData = new FormData();
            formData.append('file', file);

            const res: any = await handleAPI("/users/avatar-defaults", formData, 'post');
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
            const res: any = await handleAPI(`/users/avatar-defaults/${id}`, {}, 'delete');
            toast.success(res.message);
            setSelectedAvatar(null);
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
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {avatars.map((avatar) => (
                            <div
                                key={avatar.id}
                                onClick={() => setSelectedAvatar(avatar)}
                                className="group relative aspect-square rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
                                style={{
                                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)",
                                }}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 z-0"></div>

                                <div className="absolute inset-2 z-10 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                                    <img
                                        src={avatar.url}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                            </div>
                        ))}

                        <div
                            className="group relative aspect-square rounded-2xl border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl"
                            style={{
                                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                            }}
                            onClick={() => document.getElementById('avatar-upload')?.click()}>
                            <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300 mb-2 shadow-inner">
                                <Plus className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors duration-300" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">{t("user:users_avatar-default_add_new")}</span>
                        </div>
                    </div>

                    <Dialog open={!!selectedAvatar} onOpenChange={(open) => !open && setSelectedAvatar(null)}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>{selectedAvatar?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center justify-center p-4">
                                <div className="relative w-64 h-64 rounded-xl overflow-hidden border border-white/20 shadow-2xl">
                                    <img
                                        src={selectedAvatar?.url}
                                        alt={selectedAvatar?.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="sm:justify-between">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setSelectedAvatar(null)}
                                >
                                    {t("common:close")}
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => selectedAvatar && handleDelete(selectedAvatar.id)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    {t("common:delete")}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
};

export default AvatarDefaultPage;