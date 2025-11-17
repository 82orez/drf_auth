"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData.email, formData.username, formData.password, formData.passwordConfirm);
      router.push(`/auth/email-verification-pending?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error("Registration error:", err); // 디버깅용 로그

      let errorMessage = "Registration failed. Please try again.";

      if (err.response?.data) {
        const data = err.response.data;

        // 중복 이메일 오류 처리
        if (data.email && Array.isArray(data.email)) {
          const emailErrors = data.email;
          if (
            emailErrors.some(
              (error: string) =>
                error.toLowerCase().includes("already exists") || error.toLowerCase().includes("duplicate") || error.toLowerCase().includes("unique"),
            )
          ) {
            errorMessage = "This email address is already registered. Please use a different email or try logging in.";
          } else {
            errorMessage = `Email: ${emailErrors.join(", ")}`;
          }
        }
        // 중복 사용자명 오류 처리
        else if (data.username && Array.isArray(data.username)) {
          const usernameErrors = data.username;
          if (
            usernameErrors.some(
              (error: string) =>
                error.toLowerCase().includes("already exists") || error.toLowerCase().includes("duplicate") || error.toLowerCase().includes("unique"),
            )
          ) {
            errorMessage = "This username is already taken. Please choose a different username.";
          } else {
            errorMessage = `Username: ${usernameErrors.join(", ")}`;
          }
        }
        // 일반적인 detail 메시지
        else if (data.detail) {
          errorMessage = data.detail;
        }
        // 기타 필드 오류들
        else if (data.password) {
          errorMessage = Array.isArray(data.password) ? data.password.join(", ") : data.password;
        } else if (data.non_field_errors) {
          errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors.join(", ") : data.non_field_errors;
        }
        // 첫 번째 발견된 오류 메시지 사용
        else {
          const firstErrorKey = Object.keys(data)[0];
          if (firstErrorKey && data[firstErrorKey]) {
            const firstError = Array.isArray(data[firstErrorKey]) ? data[firstErrorKey][0] : data[firstErrorKey];
            errorMessage = `${firstErrorKey}: ${firstError}`;
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Password"
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                value={formData.passwordConfirm}
                onChange={handleChange}
                className="relative mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                placeholder="Confirm password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50">
              {loading ? "Creating account..." : "Create account"}
            </button>
          </div>

          <div className="text-center">
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
