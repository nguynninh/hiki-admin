"use client";
import { useState } from "react";
import { Sms, Lock, Eye, EyeSlash } from "iconsax-reactjs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputComponent from "@/components/forms/InputComponent";
import authAPI from "@/apis/authAPI";
import { useDispatch } from "react-redux";
import { addAuth } from "@/redux/reducers/authReducer";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addUser } from "@/redux/reducers/userReducer";
import Link from "next/link";

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const LoginPage = () => {
  const [values, setValues] = useState<LoginForm>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  const validateForm = () => {
    let isValid = true;
    setErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email) {
      setErrors((prev) => ({ ...prev, email: "Vui lòng nhập email" }));
      isValid = false;
    } else if (!emailRegex.test(values.email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      isValid = false;
    }

    if (!values.password) {
      setErrors((prev) => ({ ...prev, password: "Vui lòng nhập mật khẩu" }));
      isValid = false;
    } else if (values.password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Mật khẩu phải có ít nhất 8 ký tự",
      }));
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await authAPI(
        "/login",
        {
          email: values.email,
          password: values.password,
        },
        "post"
      );
      toast.success("Đăng nhập thành công");
      dispatch(addAuth(res.data.auth));
      dispatch(addUser(res.data.user));
      router.replace("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 px-4 py-12 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-blue-500/30 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-white/10 bg-white/10 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold tracking-tight text-white">
            Chào mừng trở lại
          </CardTitle>
          <CardDescription className="text-gray-300">
            Nhập thông tin của bạn để đăng nhập vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">
                Email
              </Label>
              <InputComponent
                value={values.email}
                placeholder="name@example.com"
                type="email"
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                prefix={<Sms size={20} className="text-gray-400" />}
                error={errors.email}
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Mật khẩu
              </Label>
              <InputComponent
                value={values.password}
                placeholder="••••••••"
                type="password"
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, password: e.target.value }))
                }
                prefix={<Lock size={20} className="text-gray-400" />}
                error={errors.password}
                className="border-white/10 bg-white/5 text-white placeholder:text-gray-500 focus-visible:border-indigo-500 focus-visible:ring-indigo-500/20"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={values.rememberMe}
                    onChange={(e) =>
                      setValues((prev) => ({
                        ...prev,
                        rememberMe: e.target.checked,
                      }))
                    }
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-white/30 bg-white/10 transition-all checked:border-indigo-500 checked:bg-indigo-500 hover:border-indigo-400"
                  />
                  <svg
                    className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Label
                  htmlFor="remember"
                  className="cursor-pointer text-sm text-gray-300 hover:text-white"
                >
                  Nhớ tôi trong 30 ngày
                </Label>
              </div>
              <Link
                href="#"
                className="text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500/20"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <Link
              href="#"
              className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
