import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";
import { useFormEntrance } from "../hooks/useGsapAnimations";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const formRef = useFormEntrance();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Registration failed");
    }
  };

  return (
    <div ref={formRef} className="space-y-6">
      <div className="text-left">
        <span className="neo-badge neo-badge-pink mb-2">JOIN NOW</span>
        <h2
          className="text-3xl font-black text-white tracking-tight uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create Account
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-300">
          Start your journey with AstraCV.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Input
            label="Last Name"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
        </div>

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

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className="divider-row relative flex py-2 items-center">
        <div className="flex-grow border-t-2 border-black" />
        <span className="flex-shrink mx-4 text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 bg-[#16161a] border border-black rounded">
          Or sign up with
        </span>
        <div className="flex-grow border-t-2 border-black" />
      </div>

      {/* Social options */}
      <div className="social-row grid grid-cols-3 gap-3">
        {["Google", "LinkedIn", "GitHub"].map((provider) => (
          <button
            key={provider}
            type="button"
            className="flex items-center justify-center rounded-xl border-2 border-black bg-[#1f1f26] py-2.5 px-3 hover:bg-[#0ae448] hover:text-black shadow-[3px_3px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-xs font-black uppercase text-slate-200 cursor-pointer"
          >
            {provider}
          </button>
        ))}
      </div>

      <p className="text-center text-xs font-bold text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-black text-[#0ae448] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;
