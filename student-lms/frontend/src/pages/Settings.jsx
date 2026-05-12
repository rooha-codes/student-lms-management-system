import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Save,
  Settings as SettingsIcon,
  Building2,
  User,
  Bell,
  Palette,
  Image,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Settings() {
  const [form, setForm] = useState({
    instituteName: "",
    adminName: "",
    email: "",
    themeColor: "#0b5c4b",
    logo: "",
    notifications: true,
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSettings = async () => {
    try {
      const res = await API.get("/settings");

      if (res.data) {
        setForm({
          instituteName: res.data.instituteName || "",
          adminName: res.data.adminName || "",
          email: res.data.email || "",
          themeColor: res.data.themeColor || "#0b5c4b",
          logo: res.data.logo || "",
          notifications:
            typeof res.data.notifications === "boolean"
              ? res.data.notifications
              : true,
        });
      }
    } catch (error) {
      console.log(error);
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put("/settings", form);
      showToast("Settings saved successfully");
    } catch (error) {
      console.log(error);
      showToast("Save failed", "error");
    }
  };

  return (
    <Layout>
  <div className="min-h-screen w-full space-y-6 bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">
        {toast && (
          <div
            className={`fixed right-4 top-4 z-[999] flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {toast.message}
          </div>
        )}

<section className="w-full rounded-[32px] bg-gradient-to-r from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e] p-6 text-white shadow-xl sm:p-8">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-white/20 p-4">
              <SettingsIcon size={28} />
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">
                System Configuration
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Settings
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Manage institute profile, branding and notifications.
              </p>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-400">
            Loading settings...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <Building2 size={20} />
                  Institute Information
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="instituteName"
                    placeholder="Institute Name"
                    value={form.instituteName}
                    onChange={handleChange}
                    className="w-full rounded-2xl border px-4 py-3"
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Institute Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border px-4 py-3"
                  />
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <User size={20} />
                  Admin Information
                </h2>

                <input
                  type="text"
                  name="adminName"
                  placeholder="Admin Name"
                  value={form.adminName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border px-4 py-3"
                />
              </div>
            </section>

            <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <Palette size={20} />
                  Branding
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Theme Color
                    </label>

                    <input
                      type="color"
                      name="themeColor"
                      value={form.themeColor}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border p-2"
                    />
                  </div>

                  <input
                    type="text"
                    name="logo"
                    placeholder="Logo Image URL"
                    value={form.logo}
                    onChange={handleChange}
                    className="w-full rounded-2xl border px-4 py-3"
                  />

                  {form.logo && (
                    <img
                      src={form.logo}
                      alt="Logo Preview"
                      className="h-24 rounded-2xl border object-contain p-2"
                    />
                  )}
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
                  <Bell size={20} />
                  Notifications
                </h2>

                <label className="flex items-center justify-between rounded-2xl border p-4">
                  <span className="font-medium">
                    Enable Notifications
                  </span>

                  <input
                    type="checkbox"
                    name="notifications"
                    checked={form.notifications}
                    onChange={handleChange}
                    className="h-5 w-5"
                  />
                </label>
              </div>
            </section>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-[#0b5c4b] py-4 text-lg font-semibold text-white shadow-lg hover:bg-[#094c3f]"
            >
              <Save size={20} />
              Save Settings
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
}

export default Settings;