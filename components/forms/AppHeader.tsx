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
        <header style={{
            backgroundColor: "#f7f7f7",
            margin: "5px",
            padding: "5px",
            borderRadius: "8px",
        }}>
            <div className="flex items-center justify-between">
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