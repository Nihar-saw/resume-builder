import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { toast } from "react-hot-toast";
import { useFormEntrance } from "../hooks/useGsapAnimations";

const SetPassword = () => {
  const { setPassword, logout } = useAuth();
  const navigate = useNavigate();
  const formRef = useFormEntrance();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
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
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await setPassword(formData.password);
    setLoading(false);

    if (result.success) {
      toast.success("Password configured successfully! Welcome aboard.");
      navigate("/dashboard");
    } else {
      toast.error(result.message || "Failed to configure password.");
    }
  };

  const handleCancel = async () => {
    // If they cancel password setup, they should be logged out
    await logout();
  };

  return (
    <div ref={formRef} className="space-y-6">
      <div className="text-left">
        <span className="neo-badge neo-badge-yellow mb-2">SECURE ACCOUNT</span>
        <h2
          className="text-3xl font-black text-white tracking-tight uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Set Password 🔐
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-300">
          Almost there! Set a password to finalize registration and secure your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2"
          loading={loading}
        >
          Configure Password
        </Button>

        <button
          type="button"
          onClick={handleCancel}
          className="w-full text-center text-xs font-bold text-slate-400 hover:text-red-500 hover:underline transition-colors mt-2 cursor-pointer"
        >
          Cancel & Log Out
        </button>
      </form>
    </div>
  );
};

export default SetPassword;
