export interface TableColumn {
    key: string;
    label: string;
    dataIndex: string;
    sortable?: boolean;
    align?: 'left' | 'center' | 'right';
    type: 'text' | 'select' | 'number' | 'email' | 'tel' | 'tags' | 'file' | 'checkbox';
    displayLength: number;
}