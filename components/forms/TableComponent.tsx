import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/models/Pagination";

interface Props {
    columns: any;
    data: any;
    pagination: Pagination;
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

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column: any) => (
                            <TableHead key={column.key}>{column.title}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item: any) => (
                        <TableRow key={item.id}>
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
        </div>
    );
};

export default TableComponent;
