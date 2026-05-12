import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import Layout from "../components/Layout";

import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  ArrowLeft,
  Trophy,
  ClipboardCheck,
  BookOpen,
  FileText,
  Edit,
  Phone,
  MapPin,
  Award,
  Download,
  ShieldCheck,
} from "lucide-react";

function StudentProfile() {
  const { id } = useParams();

  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await API.get(`/students/${id}`);
        setStudent(res.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  // ✅ LOADING STATE
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-slate-600">
              Loading student profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ NOT FOUND
  if (!student) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <p className="text-lg font-semibold text-red-500">
              Student not found
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ DEMO DATA
  const performanceStats = [
    {
      title: "Attendance",
      value: "92%",
      icon: ClipboardCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Grade",
      value: "A+",
      icon: Trophy,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Courses",
      value: "6",
      icon: BookOpen,
      color: "bg-violet-100 text-violet-600",
    },
    {
      title: "Assignments",
      value: "24",
      icon: FileText,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const resultsData = [
    { subject: "Mathematics", marks: "95%", grade: "A+" },
    { subject: "Science", marks: "91%", grade: "A+" },
    { subject: "English", marks: "88%", grade: "A" },
    { subject: "Computer", marks: "97%", grade: "A+" },
  ];

  const attendanceData = [
    { month: "January", attendance: "94%" },
    { month: "February", attendance: "91%" },
    { month: "March", attendance: "92%" },
    { month: "April", attendance: "90%" },
  ];

  return (
    <Layout>
      <div className="min-h-screen space-y-6 bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">

        {/* BACK */}
        <Link
          to="/students"
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0b5c4b] shadow-sm transition hover:shadow-md"
        >
          <ArrowLeft size={16} />
          Back to Students
        </Link>

        {/* HERO */}
        <section className="overflow-hidden rounded-[32px] bg-white shadow-xl">

          {/* COVER */}
          <div className="relative h-48 bg-gradient-to-r from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e]">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl"></div>

            <button className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-[#0b5c4b] shadow sm:right-6 sm:top-6">
              <Edit size={16} />
              Edit Profile
            </button>
          </div>

          {/* CONTENT */}
          <div className="px-4 pb-8 sm:px-8">

            {/* TOP */}
            <div className="-mt-16 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

              {/* LEFT */}
              <div className="flex flex-col gap-5 md:flex-row md:items-center">
                <img
                  src={student.image || "/avatar.png"}
                  alt={student.name}
                  className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl"
                />

                <div>
                  <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
                    {student.name}
                  </h1>

                  <p className="mt-1 text-slate-500 break-all">
                    {student.email}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                      Class {student.className}
                    </span>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">
                      Age {student.age}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600">
                      Active Student
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="grid gap-3 sm:grid-cols-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b5c4b] px-5 py-3 font-semibold text-white">
                  <Mail size={16} />
                  Email
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-5 py-3 font-semibold">
                  <Phone size={16} />
                  Contact
                </button>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border bg-white px-5 py-3 font-semibold">
                  <Download size={16} />
                  Report
                </button>
              </div>
            </div>

            {/* STATS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {performanceStats.map((item, i) => {
                const Icon = item.icon;

                return (
                  <div
                    key={i}
                    className="rounded-[28px] border border-slate-100 bg-slate-50 p-5 transition hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-500">
                          {item.title}
                        </p>

                        <h3 className="mt-2 text-2xl font-bold text-slate-900">
                          {item.value}
                        </h3>
                      </div>

                      <div className={`rounded-2xl p-3 ${item.color}`}>
                        <Icon size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABS */}
            <div className="mt-8 flex flex-wrap gap-3 border-b border-slate-200 pb-4">
              {[
                "overview",
                "results",
                "attendance",
                "documents",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-2xl px-5 py-2 text-sm font-semibold capitalize transition ${
                    activeTab === tab
                      ? "bg-[#0b5c4b] text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* TAB CONTENT */}
            <div className="mt-8">

              {/* OVERVIEW */}
              {activeTab === "overview" && (
                <div className="grid gap-6 lg:grid-cols-2">

                  {/* PERSONAL */}
                  <div className="space-y-4">
                    <div className="rounded-[28px] border bg-slate-50 p-5">
                      <h3 className="mb-4 font-bold text-slate-900">
                        Personal Information
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <User size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Full Name
                            </p>
                            <p className="font-semibold">
                              {student.name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Email
                            </p>
                            <p className="font-semibold break-all">
                              {student.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <GraduationCap size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Class
                            </p>
                            <p className="font-semibold">
                              {student.className}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXTRA */}
                  <div className="space-y-4">
                    <div className="rounded-[28px] border bg-slate-50 p-5">
                      <h3 className="mb-4 font-bold text-slate-900">
                        Additional Details
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Age
                            </p>
                            <p className="font-semibold">
                              {student.age}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <MapPin size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Address
                            </p>
                            <p className="font-semibold">
                              Lahore, Pakistan
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <ShieldCheck size={18} />
                          <div>
                            <p className="text-xs text-slate-400">
                              Status
                            </p>
                            <p className="font-semibold text-emerald-600">
                              Excellent Performance
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* RESULTS */}
              {activeTab === "results" && (
                <div className="overflow-x-auto rounded-[28px] border">
                  <table className="w-full min-w-[650px]">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="p-4 text-left">Subject</th>
                        <th className="p-4 text-left">Marks</th>
                        <th className="p-4 text-left">Grade</th>
                      </tr>
                    </thead>

                    <tbody>
                      {resultsData.map((result, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-4 font-medium">
                            {result.subject}
                          </td>

                          <td className="p-4">
                            {result.marks}
                          </td>

                          <td className="p-4">
                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600">
                              {result.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ATTENDANCE */}
              {activeTab === "attendance" && (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {attendanceData.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-[28px] bg-slate-50 p-5"
                    >
                      <p className="text-sm text-slate-500">
                        {item.month}
                      </p>

                      <h3 className="mt-2 text-2xl font-bold text-[#0b5c4b]">
                        {item.attendance}
                      </h3>
                    </div>
                  ))}
                </div>
              )}

              {/* DOCUMENTS */}
              {activeTab === "documents" && (
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    "Admission Form.pdf",
                    "Result Card.pdf",
                    "Fee Receipt.pdf",
                    "Attendance Sheet.pdf",
                  ].map((doc, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-4 rounded-[28px] border bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={18} />
                        <span className="font-medium break-all">
                          {doc}
                        </span>
                      </div>

                      <button className="rounded-xl bg-[#0b5c4b] px-4 py-2 text-sm font-semibold text-white">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default StudentProfile;