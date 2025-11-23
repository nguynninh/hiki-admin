"use client";
import { useState } from "react";
import { Sms, Lock } from "iconsax-reactjs";
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            ĐĂNG NHẬP
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Nhập thông tin của bạn để đăng nhập vào tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <InputComponent
                value={values.email}
                placeholder="Nhập email của bạn"
                type="email"
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
                prefix={<Sms size={18} className="text-gray-500" />}
                error={errors.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <InputComponent
                value={values.password}
                placeholder="Nhập mật khẩu"
                type="password"
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, password: e.target.value }))
                }
                prefix={<Lock size={18} className="text-gray-500" />}
                error={errors.password}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
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
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Nhớ tôi trong 30 ngày
                </Label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Bạn chưa có tài khoản?{" "}
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Đăng ký
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
