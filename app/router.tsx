"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import { localDataNames } from "@/constants/appInfos";
import { addUser } from "@/redux/reducers/userReducer";
import MainLayout from "@/app/(main)/layout";
import AuthLayout from "@/app/(auth)/layout";
import handleAPI from "@/apis/handleAPI";
import { SpinComponent } from "@/components/forms";
import DashboardPage from "./(main)/dashboard/page";

const Router = () => {
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const auth = useSelector((state: any) => state.authReducer.data);

    useEffect(() => {
        const getLocalAuth = () => {
            const res = localStorage.getItem(localDataNames.authData);
            if (res) {
                const auth = JSON.parse(res);
                dispatch(addAuth(auth));
            }
        };

        getLocalAuth();

        const handleGetMe = async () => {
            try {
                if (!auth?.access_token) return;

                setLoading(true);
                const res = await handleAPI('/users/me');

                dispatch(addUser(res.data.user));
            } catch (error: any) {
                if (error.code === 401) {
                    handleRefreshToken();
                    handleGetMe();
                }
                return;
            } finally {
                setLoading(false);
            }
        };
        handleGetMe();
    }, []);

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
            return;
        } finally {
            setLoading(false);
        }
    };

    if (loading)
        return (<div className="flex justify-center items-center h-screen">
            <SpinComponent />
        </div>);

    return auth?.access_token ? <MainLayout><DashboardPage /></MainLayout> : <AuthLayout />
};

export default Router;
