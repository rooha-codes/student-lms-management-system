import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  GraduationCap,
  Mail,
  BookOpen,
  Briefcase,
  Phone,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

function Teachers() {
  const emptyForm = {
    name: "",
    email: "",
    subject: "",
    experience: "",
    phone: "",
    qualification: "",
    image: "",
    status: "Active",
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces";

  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getErrorMessage = (err, fallback = "Action failed") => {
    return (
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      fallback
    );
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/teachers");

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.teachers)
        ? res.data.teachers
        : [];

      setTeachers(data);
    } catch (err) {
      console.log("FETCH TEACHERS ERROR:", err.response?.data || err.message);
      showToast(getErrorMessage(err, "Failed to fetch teachers"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (teacher) => {
    setForm({
      name: teacher.name || "",
      email: teacher.email || "",
      subject: teacher.subject || "",
      experience: teacher.experience || "",
      phone: teacher.phone || "",
      qualification: teacher.qualification || "",
      image: teacher.image || "",
      status: teacher.status || "Active",
    });

    setEditId(teacher.id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.experience.toString().trim()) {
      showToast("Name, email, subject and experience are required", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      experience: form.experience.toString().trim(),
      phone: form.phone.trim(),
      qualification: form.qualification.trim(),
      image: form.image.trim(),
      status: form.status || "Active",
    };

    try {
      setSaving(true);

      if (editId) {
        await API.put(`/teachers/${editId}`, payload);
        showToast("Teacher updated successfully");
      } else {
        await API.post("/teachers", payload);
        showToast("Teacher added successfully");
      }

      closeModal();
      fetchTeachers();
    } catch (err) {
      console.log("SAVE TEACHER ERROR:", err.response?.data || err.message);
      showToast(getErrorMessage(err, "Failed to save teacher"), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await API.delete(`/teachers/${id}`);
      showToast("Teacher deleted successfully");
      fetchTeachers();
    } catch (err) {
      console.log("DELETE TEACHER ERROR:", err.response?.data || err.message);
      showToast(getErrorMessage(err, "Delete failed"), "error");
    }
  };

  const filteredTeachers = useMemo(() => {
    const value = search.toLowerCase();

    return teachers.filter((teacher) =>
      `${teacher.name || ""} ${teacher.email || ""} ${teacher.subject || ""} ${teacher.qualification || ""}`
        .toLowerCase()
        .includes(value)
    );
  }, [teachers, search]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;

  const currentTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const totalSubjects = new Set(
    teachers.map((teacher) => teacher.subject).filter(Boolean)
  ).size;

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

              <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
                Teacher Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Manage faculty records, subjects and experience.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Teacher
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Teachers",
              value: teachers.length,
              icon: Users,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Active Teachers",
              value: activeTeachers,
              icon: GraduationCap,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              title: "Subjects",
              value: totalSubjects,
              icon: BookOpen,
              color: "bg-cyan-100 text-cyan-600",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={index} className="rounded-[28px] bg-white p-5 shadow-sm">
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
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 md:col-span-2">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, email, subject..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              Loading teachers...
            </div>
          ) : currentTeachers.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              No teachers found
            </div>
          ) : (
            currentTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="rounded-[30px] bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={teacher.image || fallbackImage}
                    alt={teacher.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {teacher.name}
                    </h3>

                    <p className="truncate text-sm text-slate-500">
                      {teacher.email}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        teacher.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {teacher.status || "Active"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={16} />
                    {teacher.subject || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Briefcase size={16} />
                    {teacher.experience || "0"} years
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    {teacher.phone || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    {teacher.qualification || "N/A"}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(teacher)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 py-3 font-semibold text-yellow-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(teacher.id)}
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

        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-xl border bg-white px-4 py-2 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`h-10 w-10 rounded-xl font-semibold ${
                  currentPage === index + 1
                    ? "bg-[#0b5c4b] text-white"
                    : "border bg-white"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="rounded-xl border bg-white px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

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
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editId ? "Edit Teacher" : "Add Teacher"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Fill teacher details carefully.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-slate-100 p-3"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  name="experience"
                  placeholder="Experience (years)"
                  value={form.experience}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  name="qualification"
                  placeholder="Qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>

                <input
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />
              </div>

              <div className="mt-5 flex justify-center">
                <img
                  src={form.image || fallbackImage}
                  alt="Preview"
                  className="h-28 w-28 rounded-2xl object-cover shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
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
                  disabled={saving}
                  className="rounded-2xl bg-[#0b5c4b] py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#0b5c4b]/60"
                >
                  {saving
                    ? "Saving..."
                    : editId
                    ? "Update Teacher"
                    : "Save Teacher"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Teachers;
