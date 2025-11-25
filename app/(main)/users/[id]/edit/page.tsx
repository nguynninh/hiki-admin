"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import handleAPI from "@/apis/handleAPI";
import UserModel from "@/models/UserModel";
import RoleModel from "@/models/RoleModel";
import { useTranslation } from "react-i18next";
import { InputComponent, SelectComponent } from "@/components/forms";
import { toast } from "sonner";

const UserEditPage = () => {
    const params = useParams();
    const router = useRouter();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [roles, setRoles] = useState<RoleModel[]>([]);
    const [user, setUser] = useState<UserModel>({
        id: "",
        firstname: "",
        lastname: "",
        fullname: "",
        email: "",
        password: "",
        roles: [],
        avatar: "",
        created_at: new Date(),
        updated_at: new Date(),
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchRoles = async () => {
            const response = await handleAPI(`/roles`);
            setRoles(response.data.roles);
        };

        fetchRoles();

        const fetchUser = async () => {
            const response = await handleAPI(`/users/${params.id}`);
            setUser(response.data.user);
        };

        fetchUser();
    }, [params.id]);

    const handleChange = (val: any, key: string) => {
        setUser((prev) => ({
            ...prev,
            [key]: val,
        }));
        setErrors((prev) => ({ ...prev, [key]: "" }));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors: { [key: string]: string } = {};

        if (!user.firstname) {
            newErrors.firstname = t('user:firstname_required');
            isValid = false;
        }

        if (!user.lastname) {
            newErrors.lastname = t('user:lastname_required');
            isValid = false;
        }

        if (!user.email) {
            newErrors.email = t('user:email_required');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            newErrors.email = t('user:email_invalid');
            isValid = false;
        }

        if (user.password && user.password.length < 8) {
            newErrors.password = t('user:password_min_length');
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        setLoading(true);
        if (!validateForm()) return;

        try {
            const response: any = await handleAPI(`/users/${params.id}`, {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                password: user.password,
                roles: user.roles.map((role: any) => role.name),
            }, "put");

            toast.success(response.message);
            router.back();
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    {t('user:users_edit')}
                    {" "}
                    {user?.lastname} {user?.firstname}
                </h1>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">{t('user:firstname')}</Label>
                            <InputComponent
                                value={user.firstname ?? ""}
                                onChange={(e) => handleChange(e.target.value, "firstname")}
                                placeholder={t('user:firstname_placeholder')}
                                error={errors.firstname}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastname">{t('user:lastname')}</Label>
                            <InputComponent
                                value={user.lastname ?? ""}
                                onChange={(e) => handleChange(e.target.value, "lastname")}
                                placeholder={t('user:lastname_placeholder')}
                                error={errors.lastname}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">{t('user:email')}</Label>
                        <InputComponent
                            value={user.email ?? ""}
                            onChange={(e) => handleChange(e.target.value, "email")}
                            type="email"
                            placeholder={t('user:email_placeholder')}
                            error={errors.email}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">{t('user:password')}</Label>
                        <InputComponent
                            value={user.password ?? ""}
                            onChange={(e) => handleChange(e.target.value, "password")}
                            type="password"
                            placeholder={t('user:password_placeholder')}
                            error={errors.password}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">{t('user:roles')}</Label>
                        <SelectComponent
                            value={user?.roles?.length > 0 ? (typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name) : ""}
                            onValueChange={(val) => handleChange([val], "roles")}
                            options={roles.map(role => ({ label: t(`user:${role.name.toLowerCase()}`), value: role.name }))}
                            placeholder={t('user:roles')}
                        />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={() => router.back()}>{t('common:cancel')}</Button>
                        <Button onClick={handleSave}>{t('common:save')}</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserEditPage;
