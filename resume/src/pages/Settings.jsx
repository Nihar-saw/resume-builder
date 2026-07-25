import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../api/auth.api";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { IoPersonOutline, IoLockClosedOutline, IoNotificationsOutline, IoDesktopOutline } from "react-icons/io5";
import { toast } from "react-hot-toast";

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: "Full Stack Developer passionate about building amazing products.",
    location: "San Francisco, CA",
    website: "https://johndoe.dev",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sync form states with asynchronously loaded user context details
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "Full Stack Developer passionate about building amazing products.",
        location: user.location || "San Francisco, CA",
        website: user.website || "https://johndoe.dev",
      });
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        avatar,
      });
      if (data.success && data.user) {
        setUser(data.user);
        toast.success("Profile saved successfully!");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: "profile", label: "Profile", icon: IoPersonOutline },
    { id: "password", label: "Password", icon: IoLockClosedOutline },
    { id: "notifications", label: "Notifications", icon: IoNotificationsOutline },
    { id: "appearance", label: "Appearance", icon: IoDesktopOutline },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account configurations, personal bio, and profile appearances.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 items-start">
        {/* Left Side: Tabs */}
        <div className="md:col-span-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-left transition-all ${
                  activeTab === item.id
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Side: Tab Form Panel */}
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <Card className="text-left space-y-6">
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-50 pb-4">
                Profile Information
              </h3>

              {/* Avatar section */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <img
                  src={avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.firstName}`}
                  alt="avatar"
                  className="h-20 w-20 rounded-2xl bg-indigo-50 border border-slate-100 object-cover"
                />
                <div className="text-center sm:text-left">
                  <Button
                    variant="outline"
                    size="sm"
                    className="font-bold text-xs"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    Supports JPG, PNG or SVG formats. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleSave} className="space-y-4 pt-2">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input
                  label="Bio"
                  name="bio"
                  type="textarea"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                  <Input
                    label="Website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="w-full sm:w-auto"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {activeTab !== "profile" && (
            <Card className="text-center py-16">
              <p className="text-sm text-slate-500 font-medium capitalize">
                {activeTab} management panel is coming soon.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
