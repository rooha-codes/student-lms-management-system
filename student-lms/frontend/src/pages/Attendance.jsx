import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock3,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  GraduationCap,
  CalendarDays,
} from "lucide-react";

function Attendance() {
  const emptyForm = {
    studentName: "",
    className: "",
    course: "",
    date: "",
    status: "Present",
    remarks: "",
  };

  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance");
      setRecords(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (record) => {
    setEditId(record.id);
    setForm({
      studentName: record.studentName || "",
      className: record.className || "",
      course: record.course || "",
      date: record.date || "",
      status: record.status || "Present",
      remarks: record.remarks || "",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.studentName || !form.className || !form.course || !form.date) {
      showToast("Student, class, course and date are required", "error");
      return;
    }

    try {
      if (editId) {
        await API.put(`/attendance/${editId}`, form);
        showToast("Attendance updated successfully");
      } else {
        await API.post("/attendance", form);
        showToast("Attendance marked successfully");
      }

      closeModal();
      fetchAttendance();
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this attendance record?")) return;

    try {
      await API.delete(`/attendance/${id}`);
      showToast("Attendance deleted successfully");
      fetchAttendance();
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    }
  };

  const filteredRecords = useMemo(() => {
    let data = [...records];

    data = data.filter((item) =>
      `${item.studentName || ""} ${item.className || ""} ${item.course || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    return data;
  }, [records, search, statusFilter]);

  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  const late = records.filter((r) => r.status === "Late").length;

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
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">
                EduCore Institute
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Attendance Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Mark, track and manage daily student attendance records.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Mark Attendance
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Records",
              value: records.length,
              icon: CalendarCheck,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Present",
              value: present,
              icon: UserCheck,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              title: "Absent",
              value: absent,
              icon: UserX,
              color: "bg-red-100 text-red-600",
            },
            {
              title: "Late",
              value: late,
              icon: Clock3,
              color: "bg-amber-100 text-amber-600",
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <div
                key={i}
                className="rounded-[28px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{item.title}</p>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      {item.value}
                    </h3>
                  </div>

                  <div className={`rounded-2xl p-3 ${item.color}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="grid w-full gap-4 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 md:col-span-2">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search by student, class or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Present</option>
            <option>Absent</option>
            <option>Late</option>
          </select>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              Loading attendance...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              No attendance records found
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-[30px] bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {record.studentName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {record.className} • {record.course}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      record.status === "Present"
                        ? "bg-emerald-50 text-emerald-600"
                        : record.status === "Absent"
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap size={16} />
                    Class: {record.className}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={16} />
                    Course: {record.course}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays size={16} />
                    Date: {record.date}
                  </div>
                </div>

                <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  {record.remarks || "No remarks"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(record)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 py-3 font-semibold text-yellow-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(record.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-100 py-3 font-semibold text-red-700"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        {showModal && (
          <div
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <form
              onSubmit={handleSubmit}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editId ? "Edit Attendance" : "Mark Attendance"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Fill attendance details carefully.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-slate-100 p-3 text-slate-600"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="studentName"
                  placeholder="Student Name"
                  value={form.studentName}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="className"
                  placeholder="Class"
                  value={form.className}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="course"
                  placeholder="Course"
                  value={form.course}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                >
                  <option>Present</option>
                  <option>Absent</option>
                  <option>Late</option>
                </select>

                <input
                  name="remarks"
                  placeholder="Remarks"
                  value={form.remarks}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border py-3 font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-[#0b5c4b] py-3 font-semibold text-white"
                >
                  {editId ? "Update Attendance" : "Save Attendance"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Attendance;