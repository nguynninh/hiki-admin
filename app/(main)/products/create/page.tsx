"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import productAPI from "@/apis/productAPI";
import categoryAPI from "@/apis/categoryAPI";
import attributeAPI from "@/apis/attributeAPI";
import fileAPI from "@/apis/fileAPI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { ImageUploadComponent } from "@/components/forms";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const CreateProductPage = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [mode, setMode] = useState<'single' | 'multi'>('single');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        brand: '',
        category_id: '',
        price: '',
        stock: '',
    });

    const [selectedAttributes, setSelectedAttributes] = useState<any[]>([]);
    const [variants, setVariants] = useState<any[]>([]);

    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (mode === 'multi') {
            if (selectedAttributes.length === 0) {
                const initAttr = { name: 'Attribute', values: [] };
                setSelectedAttributes([initAttr]);
            }
        }
    }, [mode]);

    const handleAttributeChange = (newAttributes: any[]) => {
        setSelectedAttributes(newAttributes);
        generateCartesianVariants(newAttributes);
    };

    const generateCartesianVariants = (attributes: any[]) => {
        const validAttributes = attributes.filter(a => a.name && a.values.length > 0);

        if (validAttributes.length === 0) {
            setVariants([]);
            return;
        }

        const cartesian = (args: any[]): any[] => {
            const r: any[] = [];
            const max = args.length - 1;
            function helper(arr: any, i: number) {
                for (let j = 0, l = args[i].values.length; j < l; j++) {
                    const a = { ...arr, [args[i].name]: args[i].values[j].value };
                    if (i === max) r.push(a);
                    else helper(a, i + 1);
                }
            }
            helper({}, 0);
            return r;
        };

        const combinations = cartesian(validAttributes);

        const newVariants = combinations.map(combo => {
            const signature = JSON.stringify(combo);
            const existing = variants.find(v => JSON.stringify(v.attributes) === signature);

            return {
                attributes: combo,
                price: existing ? existing.price : formData.price,
                stock: existing ? existing.stock : formData.stock,
                image: existing ? existing.image : null
            };
        });

        setVariants(newVariants);
    };

    const updateVariant = (index: number, key: string, value: any) => {
        const newVars = [...variants];
        newVars[index][key] = value;
        setVariants(newVars);
    };

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getList();
            if (res.data && res.data.categories) {
                setCategories(res.data.categories);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (file: File | null) => {
        setImageFile(file);
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttrs = [...selectedAttributes];
        newAttrs.splice(index, 1);
        handleAttributeChange(newAttrs);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let mainImageId = null;
            if (imageFile) {
                const uploadRes = await fileAPI.upload(imageFile);
                if (uploadRes.data && uploadRes.data.fileRecord) {
                    mainImageId = uploadRes.data.fileRecord.id;
                }
            }

            const finalVariants = [];

            if (mode === 'multi') {
                // 1. Create all attributes/values first
                const attributeMap: any = {};

                for (const attrGroup of selectedAttributes) {
                    const values = attrGroup.values.map((v: any) => v.value).filter((v: string) => v.trim() !== '');
                    if (values.length === 0) continue;

                    const res = await attributeAPI.create({ name: attrGroup.name, values });
                    if (res.data) {
                        const serverAttr = res.data;
                        const vMap: any = {};
                        serverAttr.values.forEach((v: any) => vMap[v.value] = v.id);
                        attributeMap[attrGroup.name] = { id: serverAttr.id, valueMap: vMap };
                    }
                }

                for (const v of variants) {
                    const variantAttrs = [];

                    for (const [attrName, attrVal] of Object.entries(v.attributes)) {
                        const info = attributeMap[attrName];
                        if (info && info.valueMap[attrVal as string]) {
                            variantAttrs.push({
                                attribute_id: info.id,
                                attribute_value_id: info.valueMap[attrVal as string]
                            });
                        }
                    }

                    if (variantAttrs.length > 0) {
                        finalVariants.push({
                            price: parseFloat(v.price) || 0,
                            stock: parseInt(v.stock) || 0,
                            image: mainImageId,
                            attributes: variantAttrs
                        });
                    }
                }

            } else {
                finalVariants.push({
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock) || 0,
                    image: mainImageId
                });
            }

            if (mode === 'multi' && finalVariants.length === 0) {
                toast.error(t('product:no_variants_error', { defaultValue: 'Vui lòng đảm bảo đã chọn thuộc tính và giá trị hợp lệ.' }));
                setIsLoading(false);
                return;
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                brand: formData.brand,
                category_id: formData.category_id,
                variants: finalVariants
            };

            await productAPI.create(payload);
            toast.success(t('product:created', { defaultValue: 'Tạo sản phẩm thành công' }));
            router.push('/products');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t('common:error_occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {t('product:create_new', { defaultValue: "Tạo sản phẩm mới" })}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white/50 dark:bg-black/20 p-6 rounded-xl border space-y-4">
                    <h2 className="font-semibold text-lg">{t('common:basic_info', { defaultValue: 'Thông tin cơ bản' })}</h2>
                    <div className="space-y-2">
                        <Label>{t('common:image', { defaultValue: "Hình ảnh" })}</Label>
                        <ImageUploadComponent onFileChange={handleFileChange} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t('product:name', { defaultValue: "Tên sản phẩm" })}</Label>
                            <Input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="brand">{t('product:brand', { defaultValue: "Thương hiệu" })}</Label>
                            <Input id="brand" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">{t('product:category', { defaultValue: "Danh mục" })}</Label>
                        <Select onValueChange={(val) => handleChange('category_id', val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={t('product:select_category', { defaultValue: "Chọn danh mục" })} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">{t('product:description', { defaultValue: "Mô tả" })}</Label>
                        <Textarea id="description" value={formData.description} onChange={(e: any) => handleChange('description', e.target.value)} />
                    </div>
                </div>

                <div className="bg-card rounded-lg border p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-semibold">{t('product:product_data', { defaultValue: 'Dữ liệu sản phẩm' })}</h2>

                    <div className="flex items-center gap-4 border-b pb-4">
                        <Button
                            type="button"
                            variant={mode === 'single' ? 'default' : 'outline'}
                            onClick={() => setMode('single')}
                            className={cn("w-full md:w-auto", mode === 'single' && "bg-primary text-primary-foreground")}
                        >
                            {t('product:single_attribute', { defaultValue: 'Một thuộc tính' })}
                        </Button>
                        <Button
                            type="button"
                            variant={mode === 'multi' ? 'default' : 'outline'}
                            onClick={() => setMode('multi')}
                            className={cn("w-full md:w-auto", mode === 'multi' && "bg-primary text-primary-foreground")}
                        >
                            {t('product:multi_attribute', { defaultValue: 'Nhiều thuộc tính' })}
                        </Button>
                    </div>

                    {mode === 'single' && (
                        <div className="grid grid-cols-2 gap-6 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <Label htmlFor="price">{t('product:price', { defaultValue: 'Giá bán' })} <span className="text-red-500">*</span></Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="0"
                                    value={formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    required={mode === 'single'}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stock">{t('product:stock', { defaultValue: 'Tồn kho' })}</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    placeholder="0"
                                    value={formData.stock}
                                    onChange={(e) => handleChange('stock', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'multi' && (
                        <div className="space-y-8 animate-in fade-in duration-300">

                            <div className="space-y-6">
                                <h3 className="font-semibold text-base flex items-center gap-2">
                                    1. {t('product:define_attributes', { defaultValue: 'Định nghĩa thuộc tính' })}
                                    <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
                                        {t('product:define_hint', { defaultValue: 'Thêm thuộc tính và các giá trị tương ứng (VD: Màu sắc: Đỏ, Xanh...)' })}
                                    </span>
                                </h3>

                                {selectedAttributes.map((attrGroup, groupIdx) => (
                                    <div key={groupIdx} className="border rounded-xl p-4 space-y-4 bg-background/50 relative group">
                                        <button type="button" onClick={() => handleRemoveAttribute(groupIdx)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity">
                                            <X size={18} />
                                        </button>
                                        <div className="flex items-center gap-4">
                                            <div className="bg-muted px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap min-w-[100px] text-center">
                                                {t('product:attribute_name', { defaultValue: 'Tên thuộc tính' })}
                                            </div>
                                            <Input
                                                value={attrGroup.name}
                                                onChange={(e) => {
                                                    const newAttrs = [...selectedAttributes];
                                                    newAttrs[groupIdx].name = e.target.value;
                                                    handleAttributeChange(newAttrs);
                                                }}
                                                className="max-w-[300px] font-medium"
                                                placeholder="Ví dụ: Màu sắc, Kích thước..."
                                            />
                                        </div>

                                        {/* Values Input Area */}
                                        <div className="pl-[116px] space-y-3">
                                            <div className="flex flex-wrap gap-2">
                                                {attrGroup.values.map((valObj: any, valIdx: number) => (
                                                    <div key={valIdx} className="flex items-center gap-1 bg-white border shadow-sm px-3 py-1.5 rounded-full text-sm animate-in fade-in zoom-in-95">
                                                        {valObj.value}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newAttrs = [...selectedAttributes];
                                                                newAttrs[groupIdx].values.splice(valIdx, 1);
                                                                handleAttributeChange(newAttrs);
                                                            }}
                                                            className="ml-2 text-muted-foreground hover:text-red-500"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}

                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        placeholder={t('product:add_value_placeholder', { defaultValue: "Nhập giá trị (vd: Đỏ, XL) rồi Enter..." })}
                                                        className="w-[250px] h-9 text-sm"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const val = (e.target as HTMLInputElement).value.trim();
                                                                if (val) {
                                                                    const newAttrs = [...selectedAttributes];
                                                                    // Check dupe
                                                                    if (!newAttrs[groupIdx].values.find((v: any) => v.value === val)) {
                                                                        newAttrs[groupIdx].values.push({ value: val });
                                                                        handleAttributeChange(newAttrs);
                                                                    }
                                                                    (e.target as HTMLInputElement).value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleAttributeChange([...selectedAttributes, { name: '', values: [] }])}
                                    className="w-full border-dashed py-6"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> {t('product:add_attribute_group', { defaultValue: 'Thêm thuộc tính khác' })}
                                </Button>
                            </div>

                            {variants.length > 0 && (
                                <div className="space-y-4 pt-4 border-t">
                                    <h3 className="font-semibold text-base flex justify-between items-center">
                                        <span>2. {t('product:variant_list', { defaultValue: 'Danh sách biến thể (Kho)' })} ({variants.length})</span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            {t('product:auto_generated', { defaultValue: 'Tự động tạo dựa trên thuộc tính đã chọn' })}
                                        </span>
                                    </h3>

                                    <div className="rounded-lg border bg-card overflow-hidden">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-muted/30">
                                                    <TableHead>{t('common:variant', { defaultValue: 'Tên biến thể' })}</TableHead>
                                                    <TableHead className="w-[150px]">{t('product:price', { defaultValue: 'Giá bán' })}</TableHead>
                                                    <TableHead className="w-[150px]">{t('product:stock', { defaultValue: 'Tồn kho' })}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {variants.map((variant, idx) => (
                                                    <TableRow key={idx}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-wrap gap-2">
                                                                {Object.entries(variant.attributes).map(([key, val]: any) => (
                                                                    <span key={key} className="bg-secondary px-2 py-1 rounded text-xs">
                                                                        <span className="opacity-50 mr-1">{key}:</span>{val}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                value={variant.price}
                                                                onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                                                placeholder="0"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                value={variant.stock}
                                                                onChange={(e) => updateVariant(idx, 'stock', e.target.value)}
                                                                placeholder="0"
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('common:save', { defaultValue: "Lưu sản phẩm" })}
                </Button>
            </form>
        </div>
    );
};

export default CreateProductPage;
