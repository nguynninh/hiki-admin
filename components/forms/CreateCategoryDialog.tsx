"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, Edit } from "lucide-react";
import categoryAPI from "@/apis/categoryAPI";

interface CreateCategoryDialogProps {
    onCategoryCreated: () => void;
    category?: any; // If provided, mode is 'edit'
}

const CreateCategoryDialog = ({ onCategoryCreated, category }: CreateCategoryDialogProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");

    useEffect(() => {
        if (category && open) {
            setName(category.name);
            setSlug(category.slug);
        } else if (!category && open) {
            setName("");
            setSlug("");
        }
    }, [category, open]);

    const handleNameChange = (val: string) => {
        setName(val);
        if (!category) { // Only auto-generate slug on create
            const slugVal = val.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            setSlug(slugVal);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (category) {
                await categoryAPI.update(category.id, { name, slug });
                toast.success(t('category:updated', { defaultValue: 'Category updated' }));
            } else {
                await categoryAPI.create({ name, slug });
                toast.success(t('category:created', { defaultValue: 'Category created' }));
            }
            setOpen(false);
            if (!category) {
                setName("");
                setSlug("");
            }
            onCategoryCreated();
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {category ? (
                    <Button variant="ghost" size="icon">
                        <Edit size={16} />
                    </Button>
                ) : (
                    <Button variant="outline" size="icon" type="button">
                        <Plus size={18} />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {category
                            ? t('category:edit', { defaultValue: "Edit Category" })
                            : t('category:create_new', { defaultValue: "Create New Category" })}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="cat_name">{t('category:name', { defaultValue: "Name" })}</Label>
                        <Input
                            id="cat_name"
                            value={name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat_slug">{t('category:slug', { defaultValue: "Slug" })}</Label>
                        <Input
                            id="cat_slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {t('common:save', { defaultValue: "Save" })}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryDialog;
