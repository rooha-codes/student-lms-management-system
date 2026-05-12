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
  // ==============================
  // STATE
  // ==============================
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

  const [teachers, setTeachers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Toast
  const [toast, setToast] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [form, setForm] = useState(emptyForm);

  // ==============================
  // TOAST
  // ==============================
  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==============================
  // FETCH TEACHERS
  // ==============================
  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teachers");

      setTeachers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);

      showToast("Failed to fetch teachers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ==============================
  // HANDLE INPUT
  // ==============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // OPEN ADD
  // ==============================
  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  // ==============================
  // OPEN EDIT
  // ==============================
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

  // ==============================
  // CLOSE MODAL
  // ==============================
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!form.name || !form.email || !form.subject || !form.experience) {
        showToast("Name, email, subject and experience are required", "error");
        return;
      }

      if (editId) {
        await API.put(`/teachers/${editId}`, form);

        showToast("Teacher updated successfully");
      } else {
        await API.post("/teachers", form);

        showToast("Teacher added successfully");
      }

      closeModal();
      fetchTeachers();
    } catch (err) {
      console.log(err);

      showToast(
        err.response?.data?.message || "Action failed",
        "error"
      );
    }
  };

  // ==============================
  // DELETE
  // ==============================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/teachers/${id}`);

      showToast("Teacher deleted successfully");

      fetchTeachers();
    } catch (err) {
      console.log(err);

      showToast("Delete failed", "error");
    }
  };

  // ==============================
  // SEARCH FILTER
  // ==============================
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const searchValue = search.toLowerCase();

      return (
        t.name?.toLowerCase().includes(searchValue) ||
        t.email?.toLowerCase().includes(searchValue) ||
        t.subject?.toLowerCase().includes(searchValue)
      );
    });
  }, [teachers, search]);

  // ==============================
  // PAGINATION
  // ==============================
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

  const indexOfLast = currentPage * itemsPerPage;

  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentTeachers = filteredTeachers.slice(
    indexOfFirst,
    indexOfLast
  );

  // ==============================
  // STATS
  // ==============================
  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  // ==============================
  // UI
  // ==============================
  return (
    <Layout>
  <div className="min-h-screen w-full space-y-6 bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">

        {/* TOAST */}
        {toast && (
          <div
            className={`fixed right-4 top-4 z-[999] flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-xl ${
              toast.type === "success"
                ? "bg-emerald-600"
                : "bg-red-600"
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

        {/* HEADER */}

{/* HEADER */}
<section className="w-full rounded-[32px] bg-gradient-to-r from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e] p-6 text-white shadow-xl sm:p-8">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    
    {/* LEFT */}
    <div>
      <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">
        EduCore Institute
      </p>

      <h1 className="mt-2 text-3xl font-bold text-white md:text-4xl">
        Teacher Management
      </h1>

      <p className="mt-2 text-sm text-emerald-100 md:text-base">
        Manage faculty records, subjects and experience
      </p>
    </div>

    {/* BUTTON */}
    <button
      onClick={openAdd}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
    >
      <Plus size={18} />
      Add Teacher
    </button>
  </div>
</section>

        {/* STATS */}
        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Teachers</p>

                <h3 className="mt-2 text-3xl font-bold">
                  {teachers.length}
                </h3>
              </div>

              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Teachers</p>

                <h3 className="mt-2 text-3xl font-bold">
                  {activeTeachers}
                </h3>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <GraduationCap size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Subjects</p>

                <h3 className="mt-2 text-3xl font-bold">
                  {[...new Set(teachers.map((t) => t.subject))].length}
                </h3>
              </div>

              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-600">
                <BookOpen size={22} />
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH */}
       <section className="grid w-full gap-4 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, email or subject..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        {/* MOBILE + DESKTOP CARDS */}
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
                    src={teacher.image || "/avatar.png"}
                    alt={teacher.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">
                      {teacher.name}
                    </h3>

                    <p className="truncate text-sm text-slate-500">
                      {teacher.email}
                    </p>

                    <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {teacher.status || "Active"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={16} />
                    {teacher.subject}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Briefcase size={16} />
                    {teacher.experience} years
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              className="rounded-xl border bg-white px-4 py-2 disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-xl font-semibold ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className="rounded-xl border bg-white px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">
                  {editId ? "Edit Teacher" : "Add Teacher"}
                </h2>

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
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="experience"
                  placeholder="Experience (years)"
                  value={form.experience}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="qualification"
                  placeholder="Qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none"
                />

                <input
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none sm:col-span-2"
                />
              </div>

              {/* IMAGE PREVIEW */}
              {form.image && (
                <div className="mt-5 flex justify-center">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="h-28 w-28 rounded-2xl object-cover"
                    onError={(e) => {
                      e.target.src = "/avatar.png";
                    }}
                  />
                </div>
              )}

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
                  className="rounded-2xl bg-blue-600 py-3 font-semibold text-white"
                >
                  {editId ? "Update Teacher" : "Save Teacher"}
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