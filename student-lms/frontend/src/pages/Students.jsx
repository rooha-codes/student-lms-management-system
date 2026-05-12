import { useEffect, useMemo, useState } from "react";
import API from "../api";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  BookOpen,
  Phone,
  Mail,
  GraduationCap,
} from "lucide-react";

function Students() {
  const emptyForm = {
    name: "",
    email: "",
    className: "",
    age: "",
    gender: "Other",
    course: "",
    phone: "",
    address: "",
    status: "Active",
    image: "",
  };

  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/students");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log(err);
      showToast("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = (file, previewUrl) => {
    setForm((prev) => ({
      ...prev,
      image: previewUrl,
    }));
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);

    setForm({
      name: student.name || "",
      email: student.email || "",
      className: student.className || "",
      age: student.age || "",
      gender: student.gender || "Other",
      course: student.course || "",
      phone: student.phone || "",
      address: student.address || "",
      status: student.status || "Active",
      image: student.image || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.className || !form.age) {
      showToast("Name, email, class and age are required", "error");
      return;
    }

    try {
      if (editingStudent) {
        await API.put(`/students/${editingStudent.id}`, form);
        showToast("Student updated successfully");
      } else {
        await API.post("/students", form);
        showToast("Student added successfully");
      }

      closeModal();
      fetchStudents();
    } catch (err) {
      console.log(err);
      showToast(err.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this student?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);
      showToast("Student deleted successfully");
      fetchStudents();
    } catch (err) {
      console.log(err);
      showToast("Delete failed", "error");
    }
  };

  const classes = [
    "All",
    ...new Set(students.map((s) => s.className).filter(Boolean)),
  ];

  const filteredStudents = useMemo(() => {
    let data = [...students];

    const searchValue = search.toLowerCase();

    data = data.filter((student) => {
      return (
        student.name?.toLowerCase().includes(searchValue) ||
        student.email?.toLowerCase().includes(searchValue) ||
        student.className?.toLowerCase().includes(searchValue) ||
        student.course?.toLowerCase().includes(searchValue)
      );
    });

    if (classFilter !== "All") {
      data = data.filter((student) => student.className === classFilter);
    }

    if (statusFilter !== "All") {
      data = data.filter((student) => student.status === statusFilter);
    }

    return data;
  }, [students, search, classFilter, statusFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);

  const activeStudents = students.filter((s) => s.status === "Active").length;
  const inactiveStudents = students.filter((s) => s.status === "Inactive").length;
  const totalClasses = classes.length - 1;

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
                Student Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Manage students, profiles, courses and academic records
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Students</p>
                <h3 className="mt-2 text-3xl font-bold">{students.length}</h3>
              </div>

              <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">
                <Users size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Active Students</p>
                <h3 className="mt-2 text-3xl font-bold">{activeStudents}</h3>
              </div>

              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-600">
                <UserCheck size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Inactive Students</p>
                <h3 className="mt-2 text-3xl font-bold">{inactiveStudents}</h3>
              </div>

              <div className="rounded-2xl bg-red-100 p-3 text-red-600">
                <UserX size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Classes</p>
                <h3 className="mt-2 text-3xl font-bold">{totalClasses}</h3>
              </div>

              <div className="rounded-2xl bg-violet-100 p-3 text-violet-600">
                <GraduationCap size={22} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 xl:col-span-2">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search by name, email, class or course..."
              className="w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            value={classFilter}
            onChange={(e) => {
              setClassFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            {classes.map((cls, i) => (
              <option key={i}>{cls}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              Loading students...
            </div>
          ) : currentStudents.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              No students found
            </div>
          ) : (
            currentStudents.map((student) => (
              <div
                key={student.id}
                className="rounded-[30px] bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={student.image || "/avatar.png"}
                    alt={student.name}
                    onError={(e) => {
                      e.currentTarget.src = "/avatar.png";
                    }}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-slate-100"
                  />

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold">
                      {student.name}
                    </h3>

                    <p className="truncate text-sm text-slate-500">
                      {student.email}
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        student.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {student.status || "Active"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <GraduationCap size={16} />
                    Class: {student.className || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <BookOpen size={16} />
                    Course: {student.course || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Users size={16} />
                    Age {student.age || "N/A"} • {student.gender || "Other"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    {student.phone || "N/A"}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    {student.address || "N/A"}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <Link
                    to={`/students/${student.id}`}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-100 py-3 font-semibold text-blue-700"
                  >
                    <Eye size={16} />
                  </Link>

                  <button
                    onClick={() => openEditModal(student)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 py-3 font-semibold text-yellow-700"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(student.id)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-100 py-3 font-semibold text-red-700"
                  >
                    <Trash2 size={16} />
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

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-xl font-semibold ${
                  currentPage === i + 1
                    ? "bg-[#0b5c4b] text-white"
                    : "border bg-white"
                }`}
              >
                {i + 1}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">
                  {editingStudent ? "Edit Student" : "Add Student"}
                </h2>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-slate-100 p-3"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                    required
                  />

                  <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                    required
                  />

                  <input
                    name="className"
                    placeholder="Class"
                    value={form.className}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                    required
                  />

                  <input
                    name="age"
                    placeholder="Age"
                    value={form.age}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                    required
                  />

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>

                  <input
                    name="course"
                    placeholder="Course"
                    value={form.course}
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

                  <textarea
                    name="address"
                    placeholder="Address"
                    value={form.address}
                    onChange={handleChange}
                    rows="4"
                    className="rounded-2xl border px-4 py-3 outline-none sm:col-span-2"
                  />
                </div>

                <div className="space-y-4">
                  <ImageUpload onImageSelect={handleImageSelect} />

                  <input
                    name="image"
                    placeholder="Image URL"
                    value={form.image}
                    onChange={handleChange}
                    className="w-full rounded-2xl border px-4 py-3 outline-none"
                  />

                  <div className="flex justify-center">
                    <img
                      src={form.image || "/avatar.png"}
                      alt="Preview"
                      onError={(e) => {
                        e.currentTarget.src = "/avatar.png";
                      }}
                      className="h-32 w-32 rounded-2xl object-cover"
                    />
                  </div>
                </div>
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
                  {editingStudent ? "Update Student" : "Save Student"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Students;