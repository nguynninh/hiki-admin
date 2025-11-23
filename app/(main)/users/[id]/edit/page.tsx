"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";

const UserEditPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    return (
        <div className="space-y-4">
            <Card className="p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Edit User {id}</h1>

                <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" placeholder="Enter first name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" placeholder="Enter last name" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email address" />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button>Save Changes</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default UserEditPage;
