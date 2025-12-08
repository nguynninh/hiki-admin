export default interface AvatarDefaultModel {
    id: string;
    url: string;
    name: string;
    created_by: string;
    created_at: string;
    updated_at?: string;
    deleted_at?: string | null;
}