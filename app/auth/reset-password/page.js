'use client';
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/userAuth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, role, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setPassword("");
        window.location.href = "/auth/login";
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-background px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
