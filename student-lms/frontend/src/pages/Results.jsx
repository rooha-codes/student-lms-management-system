import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trophy,
  UserCheck,
  UserX,
  Percent,
  BookOpen,
  GraduationCap,
} from "lucide-react";

function Results() {
  const emptyForm = {
    studentName: "",
    className: "",
    course: "",
    subject: "",
    marksObtained: "",
    totalMarks: 100,
    remarks: "",
  };

  const [results, setResults] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await API.get("/results");
      setResults(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to load results", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (result) => {
    setEditId(result.id);

    setForm({
      studentName: result.studentName || "",
      className: result.className || "",
      course: result.course || "",
      subject: result.subject || "",
      marksObtained: result.marksObtained || "",
      totalMarks: result.totalMarks || 100,
      remarks: result.remarks || "",
    });

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const calculatePreview = () => {
    const marks = Number(form.marksObtained);
    const total = Number(form.totalMarks);

    if (!marks && marks !== 0) {
      return {
        percentage: 0,
        grade: "N/A",
        status: "N/A",
      };
    }

    if (!total || total <= 0) {
      return {
        percentage: 0,
        grade: "N/A",
        status: "N/A",
      };
    }

    const percentage = (marks / total) * 100;

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    return {
      percentage: percentage.toFixed(1),
      grade,
      status: percentage >= 50 ? "Pass" : "Fail",
    };
  };

  const preview = calculatePreview();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.studentName ||
      !form.className ||
      !form.course ||
      !form.subject ||
      form.marksObtained === "" ||
      !form.totalMarks
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (Number(form.marksObtained) > Number(form.totalMarks)) {
      showToast("Marks cannot be greater than total marks", "error");
      return;
    }

    try {
      if (editId) {
        await API.put(`/results/${editId}`, form);
        showToast("Result updated successfully");
      } else {
        await API.post("/results", form);
        showToast("Result added successfully");
      }

      closeModal();
      fetchResults();
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Action failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;

    try {
      await API.delete(`/results/${id}`);
      showToast("Result deleted successfully");
      fetchResults();
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    }
  };

  const filteredResults = useMemo(() => {
    let data = [...results];

    data = data.filter((item) =>
      `${item.studentName || ""} ${item.className || ""} ${
        item.course || ""
      } ${item.subject || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (gradeFilter !== "All") {
      data = data.filter((item) => item.grade === gradeFilter);
    }

    if (statusFilter !== "All") {
      data = data.filter((item) => item.status === statusFilter);
    }

    return data;
  }, [results, search, gradeFilter, statusFilter]);

  const passed = results.filter((r) => r.status === "Pass").length;
  const failed = results.filter((r) => r.status === "Fail").length;

  const averagePercentage =
    results.length > 0
      ? (
          results.reduce((sum, item) => sum + Number(item.percentage || 0), 0) /
          results.length
        ).toFixed(1)
      : 0;

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
                Results Management
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Add marks, calculate grades, track pass/fail and manage academic
                results.
              </p>
            </div>

            <button
              onClick={openAdd}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b] transition hover:bg-slate-100"
            >
              <Plus size={18} />
              Add Result
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Total Results",
              value: results.length,
              icon: FileText,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Passed",
              value: passed,
              icon: UserCheck,
              color: "bg-emerald-100 text-emerald-600",
            },
            {
              title: "Failed",
              value: failed,
              icon: UserX,
              color: "bg-red-100 text-red-600",
            },
            {
              title: "Average",
              value: `${averagePercentage}%`,
              icon: Percent,
              color: "bg-violet-100 text-violet-600",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-[28px] bg-white p-5 shadow-sm transition hover:shadow-xl"
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
              placeholder="Search by student, class, course or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>A+</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option>F</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Pass</option>
            <option>Fail</option>
          </select>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              Loading results...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-slate-400">
              No results found
            </div>
          ) : (
            filteredResults.map((result) => (
              <div
                key={result.id}
                className="rounded-[30px] bg-white p-5 shadow-sm transition hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">
                      {result.studentName}
                    </h3>

                    <p className="mt-1 truncate text-sm text-slate-500">
                      {result.className} • {result.course}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      <BookOpen size={14} />
                      {result.subject}
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      result.status === "Pass"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-400">Marks</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {result.marksObtained}/{result.totalMarks}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-400">Grade</p>
                    <p className="mt-1 font-bold text-[#0b5c4b]">
                      {result.grade}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-400">Percentage</p>
                    <p className="mt-1 font-bold text-slate-900">
                      {result.percentage}%
                    </p>
                  </div>
                </div>

                <p className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm text-slate-600">
                  {result.remarks || "No remarks"}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openEdit(result)}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-100 py-3 font-semibold text-yellow-700"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(result.id)}
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
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">
                    {editId ? "Edit Result" : "Add Result"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Result grade and percentage are calculated automatically.
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

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
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
                    name="subject"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="number"
                    name="marksObtained"
                    placeholder="Marks Obtained"
                    value={form.marksObtained}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <input
                    type="number"
                    name="totalMarks"
                    placeholder="Total Marks"
                    value={form.totalMarks}
                    onChange={handleChange}
                    className="rounded-2xl border px-4 py-3 outline-none"
                  />

                  <textarea
                    name="remarks"
                    placeholder="Remarks"
                    value={form.remarks}
                    onChange={handleChange}
                    rows="4"
                    className="rounded-2xl border px-4 py-3 outline-none sm:col-span-2"
                  />
                </div>

                <div className="rounded-[28px] bg-slate-50 p-5">
                  <div className="flex items-center gap-2">
                    <Trophy size={20} className="text-[#0b5c4b]" />
                    <h3 className="font-bold text-slate-900">
                      Live Result Preview
                    </h3>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-400">Percentage</p>
                      <h4 className="mt-1 text-2xl font-bold text-slate-900">
                        {preview.percentage}%
                      </h4>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-400">Grade</p>
                      <h4 className="mt-1 text-2xl font-bold text-[#0b5c4b]">
                        {preview.grade}
                      </h4>
                    </div>

                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-400">Status</p>
                      <h4
                        className={`mt-1 text-2xl font-bold ${
                          preview.status === "Pass"
                            ? "text-emerald-600"
                            : preview.status === "Fail"
                            ? "text-red-600"
                            : "text-slate-500"
                        }`}
                      >
                        {preview.status}
                      </h4>
                    </div>
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
                  {editId ? "Update Result" : "Save Result"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Results;