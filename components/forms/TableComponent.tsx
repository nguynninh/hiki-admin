import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Props {
    columns: any;
    data: any;
}

const TableComponent = (props: Props) => {
    const { columns, data } = props;

    return <Table>
        <TableHeader>
            <TableRow>
                {columns.map((column: any) => (
                    <TableHead key={column.key}>{column.title}</TableHead>
                ))}
            </TableRow>
        </TableHeader>
        <TableBody>
            {data.map((item: any) => (
                <TableRow key={item.key}>
                    {columns.map((column: any) => (
                        <TableCell key={column.key}>{item[column.key]}</TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    </Table>;
};

export default TableComponent;
