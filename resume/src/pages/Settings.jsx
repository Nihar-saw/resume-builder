import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../api/auth.api";
import Button from "../components/common/Button";
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoNotificationsOutline,
  IoDesktopOutline,
  IoCameraOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";
import { toast } from "react-hot-toast";

// Compress an image File to a base64 string at reduced dimensions/quality
const compressImage = (file, maxWidth = 256, quality = 0.7) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / Math.max(img.width, img.height));
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
      });
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    try {
      toast.loading("Processing image...");
      const compressed = await compressImage(file);
      toast.dismiss();
      setAvatar(compressed);
      toast.success("Photo selected! Click Save to apply.");
    } catch {
      toast.dismiss();
      toast.error("Failed to process image");
    }
  }, []);

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
        setSaved(true);
        toast.success("Profile saved successfully!");
        setTimeout(() => setSaved(false), 2000);
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

  const avatarSrc =
    avatar ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${formData.firstName || "User"}`;

  return (
    <div className="space-y-8 text-left">
      {/* ─── Header ─── */}
      <div className="border-b-3 border-black pb-6">
        <h2
          className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Settings
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Manage your account, profile, and preferences.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 items-start">
        {/* ─── Left Tab Nav ─── */}
        <div className="md:col-span-1 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border-2 border-black px-4 py-3 text-sm font-black text-left transition-all shadow-[2px_2px_0px_0px_#000] ${
                  activeTab === item.id
                    ? "bg-[#0ae448] text-black shadow-[4px_4px_0px_0px_#000]"
                    : "bg-[#16161a] text-slate-400 hover:bg-[#1f1f26] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ─── Right Content Panel ─── */}
        <div className="md:col-span-3">
          {activeTab === "profile" && (
            <div className="rounded-2xl border-3 border-black bg-[#16161a] shadow-[6px_6px_0px_0px_#000] overflow-hidden">
              {/* Panel Header */}
              <div className="bg-[#1f1f26] border-b-3 border-black px-6 py-4">
                <h3 className="font-black text-white uppercase tracking-wide" style={{ fontFamily: "var(--font-display)" }}>
                  Profile Information
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* ── Avatar ── */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="avatar-file-input"
                />
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative group">
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="h-24 w-24 rounded-2xl bg-[#1f1f26] border-3 border-black object-cover shadow-[4px_4px_0px_0px_#000]"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border-3 border-black"
                    >
                      <IoCameraOutline className="h-7 w-7 text-white" />
                    </button>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2 text-xs font-black text-white shadow-[3px_3px_0px_0px_#000] hover:bg-[#0ae448] hover:text-black transition-all active:translate-x-0.5 active:translate-y-0.5"
                    >
                      <IoCameraOutline className="h-4 w-4" />
                      Change Photo
                    </button>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      JPG, PNG or SVG · Max 5MB · Auto-compressed to 256px
                    </p>
                  </div>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">First Name</label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Name</label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      rows={3}
                      className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                      <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</label>
                      <input
                        name="website"
                        type="url"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://yoursite.com"
                        className="w-full rounded-xl border-2 border-black bg-[#1f1f26] px-4 py-2.5 text-sm font-semibold text-white placeholder:text-slate-600 shadow-[2px_2px_0px_0px_#000] focus:shadow-[4px_4px_0px_0px_#0ae448] focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4 border-t-2 border-black">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`inline-flex items-center gap-2 rounded-xl border-2 border-black px-6 py-2.5 text-sm font-black uppercase tracking-wide shadow-[4px_4px_0px_0px_#000] transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                        saved
                          ? "bg-[#facc15] text-black shadow-[4px_4px_0px_0px_#000]"
                          : "bg-[#0ae448] text-black hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5"
                      }`}
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <IoCheckmarkCircleOutline className="h-4 w-4" />
                          Saved!
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab !== "profile" && (
            <div className="rounded-2xl border-3 border-black bg-[#16161a] shadow-[6px_6px_0px_0px_#000] text-center py-20">
              <span className="neo-badge neo-badge-yellow mb-4">Coming Soon</span>
              <p className="text-sm font-black text-white uppercase mt-4">
                {activeTab} panel is coming soon.
              </p>
              <p className="text-xs text-slate-500 mt-1">Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
