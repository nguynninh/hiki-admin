"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/models/Pagination";
import { Button } from "@/components/ui/button";

interface Props {
    columns: any;
    data: any;
    pagination: Pagination;
    typeList?: 'checkbox' | 'stt'
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
    const { columns, data, pagination } = props;
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {props.typeList === 'checkbox' && (
                            <TableHead className="w-full flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    className="accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </TableHead>
                        )}
                        {props.typeList === 'stt' && (
                            <TableHead className="w-[50px]">STT</TableHead>
                        )}
                        {columns.map((column: any) => (
                            <TableHead key={column.key}>{column.title}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item: any, index: number) => (
                        <TableRow key={item.id}>
                            {props.typeList === 'checkbox' && (
                                <TableCell className="w-full flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        className="flex items-center justify-center accent-primary h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        checked={selectedRows.includes(item.id)}
                                        onChange={() => handleSelectRow(item.id)}
                                    />
                                </TableCell>
                            )}
                            {props.typeList === 'stt' && (
                                <TableCell className="text-center">
                                    {(pagination.page - 1) * pagination.limit + index + 1}
                                </TableCell>
                            )}
                            {columns.map((column: any) => (
                                <TableCell key={column.key}>
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
                                    ) : (
                                        item[column.key]
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="flex justify-between mx-6">
                <Button>
                    Xóa đã chọn {selectedRows.length}
                </Button>
                
            </div>
        </div>
    );
};

export default TableComponent;
