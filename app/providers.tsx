"use client";

import { Provider } from "react-redux";
import store from "../redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import { addUser } from "@/redux/reducers/userReducer";
import { localDataNames } from "@/constants/appInfos";
import handleAPI from "@/apis/handleAPI";
import { SpinComponent } from "@/components/forms";

function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const auth = useSelector((state: any) => state.authReducer.data);

    useEffect(() => {
        const getLocalAuth = () => {
            const res = localStorage.getItem(localDataNames.authData);
            if (res) {
                const auth = JSON.parse(res);
                dispatch(addAuth(auth));
            } else {
                setLoading(false);
            }
        };

        getLocalAuth();
    }, []);

    useEffect(() => {
        const handleGetMe = async () => {
            try {
                if (!auth?.access_token) {
                    setLoading(false);
                    return;
                }

                setLoading(true);
                const res = await handleAPI('/users/me');
                dispatch(addUser(res.data.user));
            } catch (error: any) {
                if (error.code === 401) {
                    await handleRefreshToken();
                    await handleGetMe();
                } else {
                    localStorage.removeItem(localDataNames.authData);
                    dispatch(addAuth({}));
                }
            } finally {
                setLoading(false);
            }
        };

        const handleRefreshToken = async () => {
            try {
                if (!auth?.refresh_token) return;

                setLoading(true);
                const res = await handleAPI('/auth/refresh', {
                    method: 'POST',
                    data: {
                        refresh_token: auth.refresh_token
                    }
                });

                dispatch(addAuth(res.data.auth));
            } catch (error) {
                localStorage.removeItem(localDataNames.authData);
                dispatch(addAuth({}));
            }
        };

        handleGetMe();
    }, [auth?.access_token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <SpinComponent />
            </div>
        );
    }

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>{children}</AuthProvider>
        </Provider>
    );
}
