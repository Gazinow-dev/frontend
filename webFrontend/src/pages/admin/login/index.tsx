import { postLogin } from "@global/apis/func";
import { STORAGE_ACCESS_KEY } from "@global/constants";
import localStorageFunc from "@global/utils/localStorage";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: postLogin,
    onSuccess: ({ accessToken }) => {
      localStorageFunc.set(STORAGE_ACCESS_KEY, accessToken);
      navigate("/admin/issueList");
    },
    onError: () => {
      alert(`이메일 또는 비밀번호를 확인해주세요.`);
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
          로그인
        </h2>
        <form className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={({ currentTarget }) =>
                setForm((prev) => ({ ...prev, email: currentTarget.value }))
              }
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={form.password}
              onChange={({ currentTarget }) =>
                setForm((prev) => ({ ...prev, password: currentTarget.value }))
              }
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={!form.email || !form.password || isPending}
            onClick={(e) => {
              e.preventDefault();
              loginMutate(form);
            }}
            className="w-full px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            {isPending ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLoginPage;
