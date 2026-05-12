import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Plus,
  Search,
  BookOpen,
  Clock3,
  Users,
  Star,
  Pencil,
  Trash2,
  Filter,
  GraduationCap,
  X,
} from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    teacher: "",
    category: "General",
    duration: "",
    studentsCount: 0,
    status: "Active",
    image: "",
  });

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Fetch courses error:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      teacher: "",
      category: "General",
      duration: "",
      studentsCount: 0,
      status: "Active",
      image: "",
    });
    setEditingCourse(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);

    setForm({
      title: course.title || "",
      description: course.description || "",
      teacher: course.teacher || "",
      category: course.category || "General",
      duration: course.duration || "",
      studentsCount: course.studentsCount || 0,
      status: course.status || "Active",
      image: course.image || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCourse) {
        await API.put(`/courses/${editingCourse.id}`, form);
      } else {
        await API.post("/courses", form);
      }

      closeModal();
      fetchCourses();
    } catch (err) {
      console.log("Save course error:", err);
      alert(err.response?.data?.message || "Course save failed");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      console.log("Delete course error:", err);
      alert(err.response?.data?.message || "Course delete failed");
    }
  };

  const filteredCourses = useMemo(() => {
    let data = [...courses];

    data = data.filter((course) =>
      `${course.title || ""} ${course.teacher || ""} ${course.category || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (categoryFilter !== "All") {
      data = data.filter((course) => course.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      data = data.filter((course) => course.status === statusFilter);
    }

    return data;
  }, [courses, search, categoryFilter, statusFilter]);

  const categories = [
    "All",
    ...new Set(courses.map((course) => course.category).filter(Boolean)),
  ];

  const activeCourses = courses.filter((course) => course.status === "Active");
  const draftCourses = courses.filter((course) => course.status === "Draft");

  return (
    <Layout>
  <div className="min-h-screen w-full space-y-6 bg-gradient-to-br from-slate-100 via-white to-slate-200 px-4 py-6 sm:px-6 lg:px-8">
        <section className="w-full rounded-[32px] bg-gradient-to-r from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e] p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">
                EduCore Institute
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Courses Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Create, manage, filter and update all academic courses from one premium panel.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Course
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Courses",
              value: courses.length,
              icon: BookOpen,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Active Courses",
              value: activeCourses.length,
              icon: GraduationCap,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              title: "Draft Courses",
              value: draftCourses.length,
              icon: Clock3,
              color: "bg-amber-100 text-amber-600",
            },
            {
              title: "Students Enrolled",
              value: courses.reduce(
                (total, course) => total + Number(course.studentsCount || 0),
                0
              ),
              icon: Users,
              color: "bg-violet-100 text-violet-600",
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
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3">
            <Search size={18} className="text-slate-400" />

            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            {categories.map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Active</option>
            <option>Draft</option>
            <option>Archived</option>
          </select>

          <div className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold">
            <Filter size={18} />
            {filteredCourses.length} Courses
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.length === 0 ? (
            <div className="col-span-full rounded-[28px] bg-white p-10 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-500">
                No courses found
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group overflow-hidden rounded-[32px] bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-36 bg-gradient-to-br from-[#0b5c4b] to-[#0a8a6e]">
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-white">
                      <BookOpen size={46} />
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        course.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : course.status === "Draft"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {course.status || "Active"}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                      {course.category || "General"}
                    </span>
                  </div>

                  <h2 className="mt-4 line-clamp-1 text-xl font-bold text-slate-900">
                    {course.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                    {course.description}
                  </p>

                  <div className="mt-5 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap size={16} />
                        {course.teacher}
                      </span>

                      <span className="flex items-center gap-2">
                        <Clock3 size={16} />
                        {course.duration}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users size={16} />
                        {course.studentsCount || 0} Students
                      </span>

                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star size={14} />
                        4.9
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <button
                      onClick={() => openEditModal(course)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0b5c4b] px-4 py-3 font-semibold text-white transition hover:bg-[#094c3f]"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(course.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form
              onSubmit={handleSubmit}
              className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editingCourse ? "Edit Course" : "Add Course"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Fill course details carefully.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl bg-slate-100 p-3 text-slate-600 hover:bg-slate-200"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Course Title"
                  value={form.title}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                  required
                />

                <input
                  type="text"
                  name="teacher"
                  placeholder="Teacher Name"
                  value={form.teacher}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                  required
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <input
                  type="text"
                  name="duration"
                  placeholder="Duration e.g. 12 Weeks"
                  value={form.duration}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                  required
                />

                <input
                  type="number"
                  name="studentsCount"
                  placeholder="Students Count"
                  value={form.studentsCount}
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
                  <option>Draft</option>
                  <option>Archived</option>
                </select>

                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className="md:col-span-2 rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                />

                <textarea
                  name="description"
                  placeholder="Course Description"
                  value={form.description}
                  onChange={handleChange}
                  rows="5"
                  className="md:col-span-2 rounded-2xl border px-4 py-3 outline-none focus:border-[#0b5c4b]"
                  required
                />
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-[#0b5c4b] py-3 font-semibold text-white transition hover:bg-[#094c3f]"
                >
                  {editingCourse ? "Update Course" : "Save Course"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border py-3 font-semibold transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Courses;