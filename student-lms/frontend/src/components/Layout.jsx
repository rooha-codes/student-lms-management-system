import { io } from "socket.io-client";
import API from "../api";
import { useEffect, useState } from "react";
import GlobalSearch from "./GlobalSearch";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  FileText,
  ClipboardList,
  CalendarDays,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const unreadCount = (notifications || []).filter(
    (n) => !n.isRead
  ).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/notifications");
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotifications();

    const socket = io("http://localhost:5001");

    socket.on("newNotification", (data) => {
      if (data.role === "all" || data.role === user?.role) {
        setNotifications((prev) => [data, ...prev]);
      }
    });

    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [user?.role]);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/students", icon: Users },

    ...(user?.role === "admin"
      ? [{ name: "Teachers", path: "/teachers", icon: GraduationCap }]
      : []),

    { name: "Courses", path: "/courses", icon: BookOpen },
    { name: "Results", path: "/results", icon: FileText },
    { name: "Attendance", path: "/attendance", icon: ClipboardList },
    { name: "Schedule", path: "/schedule", icon: CalendarDays },
    { name: "Messages", path: "/messages", icon: MessageSquare },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const pageTitle =
    navItems.find((item) =>
      location.pathname.startsWith(item.path)
    )?.name || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="flex min-h-screen w-full">
        {/* SIDEBAR */}
        <aside
          className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-gradient-to-b from-[#0b5c4b] via-[#0a5a49] to-[#063f34] text-white shadow-2xl transition-all duration-300 ${
            collapsed ? "w-24" : "w-80"
          }`}
        >
{/* LOGO HEADER */}
<div className="border-b border-white/10 px-6 py-7">
  <div className="flex items-start justify-between">
    
    {/* BRAND SECTION */}
    <div className="flex min-w-0 items-center gap-4 overflow-hidden">
      
      {/* PREMIUM LOGO BOX */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white shadow-xl ring-1 ring-white/20">
        <GraduationCap size={28} className="text-[#0b5c4b]" />
      </div>

      {!collapsed && (
        <div className="min-w-0">
          
          {/* CLEAN TITLE */}
          <h1 className="truncate text-4xl font-extrabold leading-none tracking-tight text-black">
            EduCore
          </h1>

          {/* SUBTITLE */}
          <p className="mt-3 pl-1 text-sm font-medium tracking-wide text-white/75">
            Student LMS
          </p>
        </div>
      )}
    </div>

    {/* COLLAPSE BUTTON */}
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="mt-2 shrink-0 rounded-2xl p-2 text-white/90 transition hover:bg-white/10 hover:text-white"
    >
      {collapsed ? (
        <ChevronRight size={22} />
      ) : (
        <ChevronLeft size={22} />
      )}
    </button>
  </div>
</div>

          {/* NAVIGATION */}
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-6">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(
                item.path
              );

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-4 rounded-3xl px-5 py-4 text-base font-semibold transition-all duration-300 ${
                    active
                      ? "bg-white text-[#0b5c4b] shadow-xl"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{
                    animation: `fadeSlide .35s ease ${
                      index * 0.05
                    }s both`,
                  }}
                >
                  <Icon
                    size={22}
                    className={`shrink-0 ${
                      active
                        ? "text-[#0b5c4b]"
                        : "text-white/80"
                    }`}
                  />

                  {!collapsed && (
                    <span className="truncate">
                      {item.name}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* LOGOUT */}
          <div className="border-t border-white/10 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-red-500 py-4 text-lg font-bold text-white transition hover:bg-red-600"
            >
              <LogOut size={20} />
              {!collapsed && "Logout"}
            </button>
          </div>
        </aside>

        {/* MAIN AREA */}
        <div
          className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
            collapsed ? "ml-24" : "ml-80"
          }`}
        >
          {/* TOPBAR */}
          <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-5 backdrop-blur-md sm:px-8 lg:px-10">
            <h2 className="text-3xl font-bold text-slate-900">
              {pageTitle}
            </h2>

            <div className="flex items-center gap-4">
              <GlobalSearch />

              {/* NOTIFICATIONS */}
              <div className="relative">
                <button
                  onClick={() =>
                    setShowNotif(!showNotif)
                  }
                  className="relative rounded-2xl p-3 transition hover:bg-slate-100"
                >
                  <Bell className="text-slate-700" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex min-h-[22px] min-w-[22px] items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-3 max-h-[400px] w-80 overflow-y-auto rounded-3xl border border-slate-100 bg-white p-4 shadow-2xl">
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-slate-800">
                        Notifications
                      </h3>
                    </div>

                    {notifications.length === 0 ? (
                      <p className="text-sm text-slate-400">
                        No notifications
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`rounded-2xl border p-3 text-sm ${
                              n.isRead
                                ? "bg-slate-50"
                                : "bg-emerald-50"
                            }`}
                          >
                            <p className="text-slate-700">
                              {n.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <main className="flex-1 w-full min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;