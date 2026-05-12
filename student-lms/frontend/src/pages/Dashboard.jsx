import { useEffect, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";
import { io } from "socket.io-client";
import { Link } from "react-router-dom";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Bell,
  Trophy,
  Activity,
  UserPlus,
  FileBarChart,
  ArrowUpRight,
  Star,
} from "lucide-react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [overview, setOverview] = useState({
    students: 0,
    teachers: 0,
    courses: 6,
    attendance: "92%",
  });

  const [students, setStudents] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [timeline, setTimeline] = useState([]);

  const defaultChartData = [
    { name: "Jan", students: 0 },
    { name: "Feb", students: 0 },
    { name: "Mar", students: 0 },
    { name: "Apr", students: 0 },
    { name: "May", students: 0 },
    { name: "Jun", students: 0 },
    { name: "Jul", students: 0 },
    { name: "Aug", students: 0 },
    { name: "Sep", students: 0 },
    { name: "Oct", students: 0 },
    { name: "Nov", students: 0 },
    { name: "Dec", students: 0 },
  ];

  const attendanceData = [
    { name: "Present", value: 92 },
    { name: "Absent", value: 8 },
  ];

  const pieColors = ["#0b8f6a", "#e2e8f0"];

  const fetchDashboard = async () => {
    try {
      const [
        studentsRes,
        overviewRes,
        teacherRes,
        chartRes,
        recentRes,
        notifRes,
        timelineRes,
      ] = await Promise.allSettled([
        API.get("/students"),
        API.get("/students/stats/overview"),
        API.get("/teachers/count/all"),
        API.get("/students/stats/monthly"),
        API.get("/students/recent"),
        API.get("/notifications"),
        API.get("/notifications/timeline"),
      ]);

      const allStudents =
        studentsRes.status === "fulfilled" && Array.isArray(studentsRes.value.data)
          ? studentsRes.value.data
          : [];

      const studentOverview =
        overviewRes.status === "fulfilled" ? overviewRes.value.data : {};

      const teacherCount =
        teacherRes.status === "fulfilled"
          ? teacherRes.value.data.totalTeachers
          : 0;

      const monthlyData =
        chartRes.status === "fulfilled" &&
        Array.isArray(chartRes.value.data) &&
        chartRes.value.data.length > 0
          ? chartRes.value.data
          : defaultChartData;

      setStudents(allStudents);

      setOverview({
        students: studentOverview.students || allStudents.length || 0,
        teachers: teacherCount || 0,
        courses: studentOverview.courses || 6,
        attendance: studentOverview.attendance || "92%",
      });

      setChartData(monthlyData);

      setRecentStudents(
        recentRes.status === "fulfilled" && Array.isArray(recentRes.value.data)
          ? recentRes.value.data
          : allStudents.slice(-5).reverse()
      );

      setNotifications(
        notifRes.status === "fulfilled" && Array.isArray(notifRes.value.data)
          ? notifRes.value.data
          : []
      );

      setTimeline(
        timelineRes.status === "fulfilled" && Array.isArray(timelineRes.value.data)
          ? timelineRes.value.data
          : []
      );
    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5001");

    socket.on("newNotification", (data) => {
      if (data.role === "all" || data.role === user?.role) {
        setNotifications((prev) => [data, ...prev]);
        setTimeline((prev) => [data, ...prev]);
      }
    });

    return () => {
      socket.off("newNotification");
      socket.disconnect();
    };
  }, [user?.role]);

  const classWiseData = Object.values(
    students.reduce((acc, student) => {
      const cls = student.className || "Unknown";

      if (!acc[cls]) {
        acc[cls] = {
          className: cls,
          students: 0,
        };
      }

      acc[cls].students += 1;
      return acc;
    }, {})
  );

  const topStudents = students.slice(0, 5).map((student, index) => ({
    ...student,
    score: 95 - index * 4,
  }));

  const statsData = [
    {
      title: "Total Students",
      value: overview.students,
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      growth: "+12%",
    },
    {
      title: "Total Teachers",
      value: overview.teachers,
      icon: GraduationCap,
      color: "from-emerald-500 to-green-500",
      growth: "+8%",
    },
    {
      title: "Active Courses",
      value: overview.courses,
      icon: BookOpen,
      color: "from-violet-500 to-purple-500",
      growth: "+10%",
    },
    {
      title: "Attendance",
      value: overview.attendance,
      icon: ClipboardCheck,
      color: "from-amber-500 to-orange-500",
      growth: "+5%",
    },
  ];

  return (
    <Layout>
  <div className="min-h-screen w-full space-y-6 bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">
        {/* HERO */}
        <section className="w-full rounded-[32px] bg-gradient-to-r from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e] p-6 text-white shadow-xl sm:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-emerald-300/10 blur-2xl"></div>

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
                EduCore Institute
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                Smart Learning Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-emerald-100 md:text-base">
                Track students, teachers, attendance, class growth, recent activity and institutional performance from one premium admin panel.
              </p>

              <p className="mt-2 text-xs text-white/70">
                Logged in as: {user?.role || "user"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/students"
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
              >
                Add Student
              </Link>

              <button className="rounded-2xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20">
                Generate Report
              </button>
            </div>
          </div>
        </section>

        {/* KPI CARDS */}
        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statsData.map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-slate-100"></div>

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold text-slate-900">
                      {item.value}
                    </h3>

                    <span className="mt-3 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {item.growth} growth
                    </span>
                  </div>

                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                  >
                    <Icon size={24} />
                  </div>
                </div>

                <div className="relative mt-5 flex items-center gap-1 text-sm font-semibold text-[#0b5c4b]">
                  <span>View details</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            );
          })}
        </section>

        {/* ANALYTICS GRID */}
        <section className="grid gap-6 xl:grid-cols-3">
          {/* Monthly Growth */}
          <div className="rounded-[28px] bg-white p-6 shadow-sm xl:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Student Growth Analytics
                </h3>
                <p className="text-sm text-slate-500">
                  Monthly registrations and academic growth trend
                </p>
              </div>

              <Activity className="text-[#0b5c4b]" />
            </div>

            <div className="h-[330px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData.length ? chartData : defaultChartData}>
                  <defs>
                    <linearGradient id="studentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0b8f6a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0b8f6a" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stroke="#0b8f6a"
                    strokeWidth={3}
                    fill="url(#studentGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance */}
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Attendance Insight
            </h3>
            <p className="text-sm text-slate-500">Overall attendance ratio</p>

            <div className="mt-6 h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={index} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <p className="font-bold">92%</p>
                <p>Present</p>
              </div>

              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                <p className="font-bold">8%</p>
                <p>Absent</p>
              </div>
            </div>
          </div>
        </section>

        {/* CLASS CHART + TOP STUDENTS */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-slate-900">
                Class-wise Students
              </h3>
              <p className="text-sm text-slate-500">
                Students distribution by class
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classWiseData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="className" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#0b8f6a" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Top Students
                </h3>
                <p className="text-sm text-slate-500">
                  Highest performance this month
                </p>
              </div>

              <Trophy className="text-amber-500" />
            </div>

            {topStudents.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
                No students available
              </p>
            ) : (
              <div className="space-y-3">
                {topStudents.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b5c4b] text-sm font-bold text-white">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {student.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.className || "No class"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-600">
                      <Star size={14} />
                      {student.score}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="grid gap-5 md:grid-cols-4">
          {[
            { title: "Add Student", icon: UserPlus, to: "/students" },
            { title: "Reports", icon: FileBarChart, to: "/results" },
            { title: "Courses", icon: BookOpen, to: "/courses" },
            { title: "Messages", icon: Bell, to: "/messages" },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <Link
                key={i}
                to={item.to}
                className="flex items-center gap-3 rounded-3xl bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="rounded-2xl bg-slate-100 p-3 text-[#0b5c4b]">
                  <Icon size={20} />
                </div>

                <span className="font-semibold text-slate-800">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </section>

        {/* NOTIFICATIONS + TIMELINE */}
        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Notifications
            </h3>

            {notifications.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
                No notifications
              </p>
            ) : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((n, index) => (
                  <div
                    key={n.id || index}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 transition hover:bg-slate-50"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      {n.message}
                    </p>

                    <span className="text-xs text-slate-400">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleTimeString()
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              Recent Activity
            </h3>

            {timeline.length === 0 ? (
              <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-400">
                No activity yet
              </p>
            ) : (
              <div className="space-y-4">
                {timeline.slice(0, 6).map((item, index) => (
                  <div key={item.id || index} className="flex gap-3">
                    <div className="mt-2 h-2.5 w-2.5 rounded-full bg-[#0b5c4b]"></div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {item.message}
                      </p>
                      <span className="text-xs text-slate-400">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SCHEDULE + ANNOUNCEMENTS */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays size={18} className="text-[#0b5c4b]" />
              <h3 className="font-bold text-slate-900">Schedule</h3>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <span key={i} className="font-semibold text-slate-500">
                  {d}
                </span>
              ))}

              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <div
                  key={n}
                  className={`rounded-xl py-2 font-medium ${
                    n === 4 ? "bg-emerald-500 text-white" : "text-slate-600"
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Bell size={18} className="text-[#0b5c4b]" />
              <h3 className="font-bold text-slate-900">Announcements</h3>
            </div>

            <ul className="space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl bg-slate-50 p-3">
                Mid-term results Friday
              </li>
              <li className="rounded-2xl bg-slate-50 p-3">
                New schedule uploaded
              </li>
              <li className="rounded-2xl bg-slate-50 p-3">
                Fee deadline extended
              </li>
            </ul>
          </div>
        </section>

        {/* RECENT STUDENTS */}
        <section className="overflow-hidden rounded-[28px] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Recent Students
            </h2>

            <Link
              to="/students"
              className="text-sm font-semibold text-[#0b5c4b]"
            >
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Class</th>
                </tr>
              </thead>

              <tbody>
                {recentStudents.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-6 text-center text-slate-400">
                      No students found
                    </td>
                  </tr>
                ) : (
                  recentStudents.map((s) => (
                    <tr key={s.id} className="border-t border-slate-100">
                      <td className="p-4 font-medium text-slate-800">
                        {s.name}
                      </td>
                      <td className="p-4 text-slate-600">{s.email}</td>
                      <td className="p-4 text-slate-600">{s.className}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;