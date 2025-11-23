"use client";
import { AvatarComponent, InputSearchComponent } from "@/components/forms";
import UserModel from "@/models/UserModel";
import { BellRing } from "lucide-react";

const AppHeader = ({
    user
}: {
    user: UserModel
}) => {
    return (
        <header className="w-full" style={{
            backgroundColor: "#f7f7f7",
            padding: "5px 15px",
            borderRadius: "8px",
        }}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <InputSearchComponent />
                </div>
                <div className="flex items-center gap-2">
                    <button>
                        <BellRing />
                    </button>
                    <AvatarComponent
                        image={user.avatar}
                        name={user.firstname + " " + user.lastname}
                        email={user.email} />
                </div>
            </div>
        </header>
    );
}

export default AppHeader;