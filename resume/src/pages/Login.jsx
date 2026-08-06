import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";
import { useFormEntrance } from "../hooks/useGsapAnimations";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const Login = () => {
  const { login, loginWithGoogle, loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  const formRef = useFormEntrance();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await login(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Invalid credentials");
    }
  };

  const handleSocialLogin = async (provider) => {
    setSocialLoading(provider);
    try {
      const loginFn = provider === "google" ? loginWithGoogle : loginWithGitHub;
      const result = await loginFn();
      if (result.success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Social login failed");
      }
    } finally {
      setSocialLoading("");
    }
  };

  return (
    <div ref={formRef} className="space-y-6">
      <div className="text-left">
        <span className="neo-badge neo-badge-green mb-2">AUTH PORTAL</span>
        <h2
          className="text-3xl font-black text-white tracking-tight uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Welcome Back 👋
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-300">
          Login to your account to resume building.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-xs font-bold">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              className="rounded border-2 border-black bg-[#18181c] text-[#0ae448] focus:ring-0 cursor-pointer"
            />
            Remember me
          </label>
          <a
            href="#"
            className="text-[#0ae448] hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
        >
          Log In
        </Button>
      </form>

      <div className="divider-row relative flex py-2 items-center">
        <div className="flex-grow border-t-2 border-black" />
        <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 bg-[#16161a] border border-black rounded">
          Or continue with
        </span>
        <div className="flex-grow border-t-2 border-black" />
      </div>

      {/* Social options */}
      <div className="social-row grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          disabled={!!socialLoading}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#1f1f26] py-2.5 px-3 hover:bg-[#0ae448] hover:text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-black uppercase text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="text-lg" />
          {socialLoading === "google" ? "Signing in..." : "Google"}
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("github")}
          disabled={!!socialLoading}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-black bg-[#1f1f26] py-2.5 px-3 hover:bg-[#0ae448] hover:text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-black uppercase text-slate-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaGithub className="text-lg" />
          {socialLoading === "github" ? "Signing in..." : "GitHub"}
        </button>
      </div>

      <p className="text-center text-xs font-bold text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="font-black text-[#0ae448] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
