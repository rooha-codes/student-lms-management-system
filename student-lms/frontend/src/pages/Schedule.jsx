import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
} from "lucide-react";

function Schedule() {
  const emptyForm = {
    title: "",
    className: "",
    course: "",
    teacher: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    type: "Lecture",
    status: "Upcoming",
    notes: "",
  };

  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await API.get("/schedules");
      setSchedules(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to load schedules", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (schedule) => {
    setEditId(schedule.id);
    setForm({
      title: schedule.title || "",
      className: schedule.className || "",
      course: schedule.course || "",
      teacher: schedule.teacher || "",
      date: schedule.date || "",
      startTime: schedule.startTime || "",
      endTime: schedule.endTime || "",
      room: schedule.room || "",
      type: schedule.type || "Lecture",
      status: schedule.status || "Upcoming",
      notes: schedule.notes || "",
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

    if (
      !form.title ||
      !form.className ||
      !form.course ||
      !form.teacher ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      if (editId) {
        await API.put(`/schedules/${editId}`, form);
        showToast("Schedule updated successfully");
      } else {
        await API.post("/schedules", form);
        showToast("Schedule added successfully");
      }

      closeModal();
      fetchSchedules();
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await API.delete(`/schedules/${id}`);
      showToast("Schedule deleted successfully");
      fetchSchedules();
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    }
  };

  const filteredSchedules = useMemo(() => {
    let data = [...schedules];

    data = data.filter((item) =>
      `${item.title || ""} ${item.className || ""} ${item.course || ""} ${
        item.teacher || ""
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (typeFilter !== "All") {
      data = data.filter((item) => item.type === typeFilter);
    }

    return data;
  }, [schedules, search, statusFilter, typeFilter]);

  const upcoming = schedules.filter((s) => s.status === "Upcoming").length;
  const completed = schedules.filter((s) => s.status === "Completed").length;
  const cancelled = schedules.filter((s) => s.status === "Cancelled").length;

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
                Schedule Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Manage lectures, labs, exams, teachers and class timings.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Schedule
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Schedules",
              value: schedules.length,
              icon: CalendarDays,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Upcoming",
              value: upcoming,
              icon: Clock3,
              color: "bg-amber-100 text-amber-600",
            },
            {
              title: "Completed",
              value: completed,
              icon: CheckCircle2,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              title: "Cancelled",
              value: cancelled,
              icon: AlertCircle,
              color: "bg-red-100 text-red-600",
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
              placeholder="Search by title, class, course or teacher..."
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
            <option>Upcoming</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Lecture</option>
            <option>Lab</option>
            <option>Exam</option>
            <option>Meeting</option>
          </select>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              Loading schedules...
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              No schedules found
            </div>
          ) : (
            filteredSchedules.map((item) => (
              <div
                key={item.id}
                className="rounded-[30px] bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {item.className} • {item.course}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Upcoming"
                        ? "bg-amber-50 text-amber-600"
                        : item.status === "Completed"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} />
                    Teacher: {item.teacher}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap size={16} />
                    Class: {item.className}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={16} />
                    Course: {item.course}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays size={16} />
                    {item.date}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock3 size={16} />
                    {item.startTime} - {item.endTime}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin size={16} />
                    Room: {item.room || "N/A"}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    {item.type}
                  </span>
                </div>

                <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  {item.notes || "No notes"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 py-3 font-semibold text-yellow-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
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
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editId ? "Edit Schedule" : "Add Schedule"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add lecture timings, teacher, room and schedule details.
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
                  name="title"
                  placeholder="Schedule Title"
                  value={form.title}
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
                  name="teacher"
                  placeholder="Teacher"
                  value={form.teacher}
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

                <input
                  name="room"
                  placeholder="Room"
                  value={form.room}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  type="time"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  type="time"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                >
                  <option>Lecture</option>
                  <option>Lab</option>
                  <option>Exam</option>
                  <option>Meeting</option>
                </select>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                >
                  <option>Upcoming</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>

                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="sm:col-span-2 rounded-2xl border px-4 py-3 outline-none"
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
                  {editId ? "Update Schedule" : "Save Schedule"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Schedule;