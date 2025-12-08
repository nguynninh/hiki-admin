"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination as PaginationModel } from "@/models/Pagination";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { Download, ListFilterPlus, Plus, RefreshCw, Upload, ChevronDown } from "lucide-react";
import { InputSearchComponent } from "@/components/forms";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterConfig {
    key: string;
    title: string;
    options: FilterOption[];
    value?: string;
    defaultValue?: string;
}

interface Props {
    columns: any;
    data: any;
    pagination: PaginationModel;
    updateQuery: (query: any) => void;
    typeList?: 'checkbox' | 'stt';
    showSearch?: boolean;
    isRefresh?: boolean;
    handleDeleteAll?: (ids: string[]) => void;
    renderAction?: (item: any) => React.ReactNode;
    handleImport?: () => void;
    handleExport?: () => void;
    handleAddNew?: () => void;
    changeColumns?: boolean;
    filters?: FilterConfig[];
}

const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash % 360);
    const saturation = 65 + (Math.abs(hash) % 20);
    const lightness = 55 + (Math.abs(hash) % 15);

    return { hue, saturation, lightness };
};

const LiquidGlassTag = ({ text }: { text: string }) => {
    const { hue, saturation, lightness } = getColorFromString(text);

    return (
        <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-1"
            style={{
                background: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.15)`,
                border: `1px solid hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                boxShadow: `0 4px 6px hsla(${hue}, ${saturation}%, ${lightness}%, 0.1), inset 0 1px 1px hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.2)`,
                color: `hsl(${hue}, ${saturation}%, ${lightness - 25}%)`,
                transition: 'all 0.2s ease',
            }}>
            {text}
        </span>
    );
};

const TableComponent = (props: Props) => {
    const {
        columns,
        data,
        pagination,
        updateQuery,
        renderAction,
        changeColumns,
        handleImport,
        handleExport,
        handleAddNew,
        handleDeleteAll,
        isRefresh,
        showSearch,
        filters,
    } = props;
    const { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map((c: any) => c.key));

    const handleColumnToggle = (columnKey: string) => {
        setVisibleColumns((prev) =>
            prev.includes(columnKey)
                ? prev.filter((key) => key !== columnKey)
                : [...prev, columnKey]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const currentIds = data.map((item: any) => item.id);
        if (e.target.checked) {
            setSelectedRows((prev) => [...new Set([...prev, ...currentIds])]);
        } else {
            setSelectedRows((prev) => prev.filter((id) => !currentIds.includes(id)));
        }
    };

    const handleSelectRow = (id: string) => {
        setSelectedRows((prev) =>
            prev.includes(id)
                ? prev.filter((rowId) => rowId !== id)
                : [...prev, id]
        );
    };

    const isAllSelected = data.length > 0 && data.every((item: any) => selectedRows.includes(item.id));

    return (
        <div className="space-y-4 p-6 rounded-3xl bg-card/40 border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {filters ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-white/20 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                                    <ListFilterPlus className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-60">
                                {filters.map((filter) => (
                                    <DropdownMenuSub key={filter.key}>
                                        <DropdownMenuSubTrigger>
                                            <span className="flex-1">{filter.title}</span>
                                            {(filter.value || filter.defaultValue) && (
                                                <span className="text-xs text-muted-foreground mr-2">
                                                    {filter.options.find(opt => opt.value === (filter.value || filter.defaultValue))?.label}
                                                </span>
                                            )}
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuRadioGroup
                                                    value={filter.value || filter.defaultValue}
                                                    onValueChange={(value) => updateQuery({ [filter.key]: value, page: 1 })}>
                                                    {filter.options.map((option) => (
                                                        <DropdownMenuRadioItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </DropdownMenuRadioItem>
                                                    ))}
                                                </DropdownMenuRadioGroup>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            className="bg-white/20 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                            <ListFilterPlus className="w-4 h-4" />
                        </Button>
                    )}
                    {showSearch &&
                        <InputSearchComponent
                            onChange={(value) => updateQuery({ q: value })}
                            shape="square" />}
                    {isRefresh &&
                        <Button
                            variant="outline"
                            onKeyDown={(e) => {
                                if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
                                    e.preventDefault();
                                    updateQuery({ page: 1 });
                                }
                            }}
                            autoFocus
                            onClick={() => updateQuery({ page: 1 })}
                            className="bg-white/20 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                            <RefreshCw className="w-4 h-4" />
                        </Button>}
                </div>
                <div className="flex justify-end items-center gap-2">
                    {handleImport && <Button
                        variant="outline"
                        onClick={handleImport}
                        className="bg-white/20 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                        <Upload className="w-4 h-4" />
                    </Button>}
                    {handleExport && <Button
                        variant="outline"
                        onClick={handleExport}
                        className="bg-white/20 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                        <Download className="w-4 h-4" />
                    </Button>}
                    {handleAddNew && <Button
                        variant="outline"
                        onClick={handleAddNew}
                        className="bg-white/20 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        {t('common:add_new')}
                    </Button>}
                    {changeColumns &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto border border-gray-200 bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white text-muted-foreground dark:text-gray-300 transition-all duration-300">
                                    {t('common:columns')} <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {columns.map((column: any) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.key}
                                        className="capitalize"
                                        checked={visibleColumns.includes(column.key)}
                                        onCheckedChange={() => handleColumnToggle(column.key)}>
                                        {column.title}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>}
                </div>
            </div>
            <div className="rounded-xl overflow-hidden border border-white/20 dark:border-white/5 bg-white/20 dark:bg-white/5">
                <Table>
                    <TableHeader className="bg-white/20 dark:bg-white/5 hover:bg-white/30 dark:hover:bg-white/5">
                        <TableRow>
                            {props.typeList === 'checkbox' && (
                                <TableHead className="w-[50px] text-center">
                                    <input
                                        type="checkbox"
                                        className="accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </TableHead>
                            )}
                            {props.typeList === 'stt' && (
                                <TableHead className="w-[50px] text-center">{t('common:stt')}</TableHead>
                            )}
                            {columns.filter((col: any) => visibleColumns.includes(col.key)).map((column: any) => (
                                <TableHead key={column.key} className="text-muted-foreground dark:text-gray-400 font-medium">{column.title}</TableHead>
                            ))}
                            {renderAction && (
                                <TableHead className="text-left w-[100px] text-muted-foreground dark:text-gray-400 font-medium">{t('common:action')}</TableHead>
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item: any, index: number) => (
                            <TableRow key={item.id} className="border-b border-white/20 dark:border-white/5 hover:bg-white/30 dark:hover:bg-white/5 transition-colors data-[state=selected]:bg-white/40 dark:data-[state=selected]:bg-white/10">
                                {props.typeList === 'checkbox' && (
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center h-full">
                                            <input
                                                type="checkbox"
                                                className="accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                checked={selectedRows.includes(item.id)}
                                                onChange={() => handleSelectRow(item.id)}
                                            />
                                        </div>
                                    </TableCell>
                                )}
                                {props.typeList === 'stt' && (
                                    <TableCell className="text-center">
                                        {(pagination.page - 1) * pagination.limit + index + 1}
                                    </TableCell>
                                )}
                                {columns.filter((col: any) => visibleColumns.includes(col.key)).map((column: any) => (
                                    <TableCell key={column.key} className="text-foreground dark:text-gray-300">
                                        {column.type === "tags" ? (
                                            <div className="flex flex-wrap">
                                                {(item[column.key] as string[]).map((tag, idx) => (
                                                    <LiquidGlassTag key={`${tag}-${idx}`} text={tag} />
                                                ))}
                                            </div>
                                        ) : column.type === "email" ? (
                                            <a
                                                href={`mailto:${item[column.key]}`}
                                                className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                                                {item[column.key]}
                                            </a>
                                        ) : column.type === "image" ? (
                                            <div className="w-20 h-12 rounded-lg overflow-hidden relative border border-white/20">
                                                <img
                                                    src={item[column.key]}
                                                    alt="banner"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/images/placeholder.png'; // Fallback
                                                    }}
                                                />
                                            </div>
                                        ) : column.render ? (
                                            column.render(item)
                                        ) : (
                                            item[column.key]
                                        )}
                                    </TableCell>
                                ))}
                                {renderAction && (
                                    <TableCell className="flex justify-left">
                                        {renderAction(item)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between mx-6 text-muted-foreground dark:text-gray-400">
                {handleDeleteAll &&
                    <Button
                        variant="outline"
                        disabled={selectedRows.length === 0}
                        onClick={() => handleDeleteAll(selectedRows)}
                        className="text-muted-foreground dark:text-gray-400 hover:text-white border-foreground hover:bg-red-500 dark:hover:bg-red-500">
                        {t('common:deleteSelected')}
                        {selectedRows.length > 0 && ` (${selectedRows.length})`}
                    </Button>}
                <Pagination className="flex justify-end">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => pagination.previousPage && updateQuery({ page: pagination.page - 1 })}
                                className={!pagination.previousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {(() => {
                            const totalPages = pagination.totalPages;
                            const currentPage = pagination.page;
                            const items = [];

                            items.push(
                                <PaginationItem key={1}>
                                    <PaginationLink
                                        isActive={currentPage === 1}
                                        onClick={() => updateQuery({ page: 1 })}
                                        className="cursor-pointer">
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                            );

                            if (currentPage > 3) {
                                items.push(
                                    <PaginationItem key="start-ellipsis">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                items.push(
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={currentPage === i}
                                            onClick={() => updateQuery({ page: i })}
                                            className="cursor-pointer">
                                            {i}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }

                            if (currentPage < totalPages - 2) {
                                items.push(
                                    <PaginationItem key="end-ellipsis">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }

                            if (totalPages > 1) {
                                items.push(
                                    <PaginationItem key={totalPages}>
                                        <PaginationLink
                                            isActive={currentPage === totalPages}
                                            onClick={() => updateQuery({ page: totalPages })}
                                            className="cursor-pointer"
                                        >
                                            {totalPages}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }

                            return items;
                        })()}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => pagination.nextPage && updateQuery({ page: pagination.page + 1 })}
                                className={!pagination.nextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
};

export default TableComponent;
