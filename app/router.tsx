"use client";
import { useSelector } from "react-redux";
import MainLayout from "@/app/(main)/layout";
import AuthLayout from "@/app/(auth)/layout";
import DashboardPage from "./(main)/dashboard/page";

const Router = () => {
    const auth = useSelector((state: any) => state.authReducer.data);

    return auth?.access_token
        ? <MainLayout><DashboardPage /></MainLayout>
        : <AuthLayout />
};

export default Router;
