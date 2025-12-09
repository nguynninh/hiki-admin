"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2, X } from "lucide-react";
import TableComponent from "@/components/forms/TableComponent";
import attributeAPI from "@/apis/attributeAPI";
import { useDebounce } from 'use-debounce';

const AttributesPage = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<any>({ attributes: [], paginations: {} });
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebounce(search, 500);

    useEffect(() => {
        fetchData();
    }, [page, limit, debouncedSearch]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const query = `?page=${page}&limit=${limit}&search=${debouncedSearch}`;
            const res = await attributeAPI.getList(query);
            if (res.data) {
                setData(res.data);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('common:error_fetching_data', { defaultValue: 'Error fetching data' }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm(t('common:confirm_delete'))) return;
        try {
            await attributeAPI.remove(id);
            toast.success(t('common:deleted_success'));
            fetchData();
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        }
    };

    const columns = [
        {
            key: "name",
            title: t("attribute:name", { defaultValue: "Name" }),
        },
        {
            key: "values",
            title: t("attribute:values", { defaultValue: "Values" }),
            render: (item: any) => (
                <div className="flex flex-wrap gap-1">
                    {item.values && item.values.map((v: any) => (
                        <span key={v.id} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                            {v.value}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: "actions",
            title: t("common:actions", { defaultValue: "Actions" }),
            render: (item: any) => (
                <div className="flex gap-2">
                    <CreateAttributeDialog attribute={item} onSaved={fetchData} />
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} className="text-red-500" />
                    </Button>
                </div>
            ),
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    {t('common:attributes', { defaultValue: "Attributes" })}
                </h1>
                <CreateAttributeDialog onSaved={fetchData} />
            </div>

            <TableComponent
                data={data.attributes || []}
                columns={columns}
                pagination={{
                    page: data.paginations?.page || 1,
                    limit: data.paginations?.limit || 10,
                    totalItems: data.paginations?.totalItems || 0,
                    totalPages: data.paginations?.totalPages || 1,
                    nextPage: data.paginations?.nextPage || false,
                    previousPage: data.paginations?.previousPage || false
                }}
                updateQuery={(q) => {
                    if (q.page) setPage(q.page);
                    if (q.limit) setLimit(q.limit);
                    // TableComponent passes { q: value } for search
                    if (q.q !== undefined) setSearch(q.q);
                }}
                showSearch
                isRefresh
            />
        </div>
    );
};

interface CreateAttributeDialogProps {
    onSaved: () => void;
    attribute?: any;
}

const CreateAttributeDialog = ({ onSaved, attribute }: CreateAttributeDialogProps) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [values, setValues] = useState<string[]>([]);
    const [newValue, setNewValue] = useState("");

    useEffect(() => {
        if (attribute && open) {
            setName(attribute.name);
            setValues(attribute.values ? attribute.values.map((v: any) => v.value) : []);
        } else if (!attribute && open) {
            setName("");
            setValues([]);
        }
    }, [attribute, open]);

    const handleAddValue = () => {
        if (newValue.trim()) {
            if (!values.includes(newValue.trim())) {
                setValues([...values, newValue.trim()]);
            }
            setNewValue("");
        }
    };

    const handleRemoveValue = (val: string) => {
        setValues(values.filter(v => v !== val));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Include pending value if any
            let finalValues = [...values];
            if (newValue.trim() && !values.includes(newValue.trim())) {
                finalValues.push(newValue.trim());
            }

            const payload = { name, finalValues }; // Wait, backend expects 'values'
            const apiPayload = { name, values: finalValues };

            if (attribute) {
                await attributeAPI.update(attribute.id, apiPayload);
                toast.success(t('attribute:updated', { defaultValue: 'Attribute updated' }));
            } else {
                await attributeAPI.create(apiPayload);
                toast.success(t('attribute:created', { defaultValue: 'Attribute created' }));
            }
            setOpen(false);
            if (!attribute) {
                setName("");
                setValues([]);
                setNewValue("");
            }
            onSaved();
        } catch (error: any) {
            toast.error(error.message || t('common:error_occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {attribute ? (
                    <Button variant="ghost" size="icon">
                        <Edit size={16} />
                    </Button>
                ) : (
                    <Button>
                        <Plus size={18} className="mr-2" />
                        {t('attribute:create', { defaultValue: "Create Attribute" })}
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {attribute
                            ? t('attribute:edit', { defaultValue: "Edit Attribute" })
                            : t('attribute:create_new', { defaultValue: "Create New Attribute" })}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="attr_name">{t('attribute:name', { defaultValue: "Name" })}</Label>
                        <Input
                            id="attr_name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="e.g. Color, Size"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>{t('attribute:values', { defaultValue: "Values" })}</Label>
                        <div className="flex gap-2">
                            <Input
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                placeholder="Add value e.g. Red"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddValue();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddValue} size="icon" variant="secondary">
                                <Plus size={18} />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {values.map((val) => (
                                <div key={val} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                                    {val}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveValue(val)}
                                        className="text-gray-500 hover:text-red-500"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
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

export default AttributesPage;
