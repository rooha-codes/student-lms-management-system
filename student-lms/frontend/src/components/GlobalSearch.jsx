import { useEffect, useState } from "react";
import { Search, User, GraduationCap } from "lucide-react";
import API from "../api";
import { Link } from "react-router-dom";

function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await API.get("/students");
        const teacherRes = await API.get("/teachers");

        setStudents(studentRes.data);
        setTeachers(teacherRes.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = students.filter((s) =>
    `${s.name} ${s.email} ${s.className}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const filteredTeachers = teachers.filter((t) =>
    `${t.name} ${t.email} ${t.subject}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const hasResults =
    query && (filteredStudents.length > 0 || filteredTeachers.length > 0);

  return (
    <div className="relative hidden lg:block">
      <div className="flex w-[320px] items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
        <Search size={16} className="text-slate-400" />

        <input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          placeholder="Search students, teachers..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {open && query && (
        <div className="absolute right-0 top-14 z-50 w-[420px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold">Search Results</p>

            <button
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="text-xs text-slate-400"
            >
              Close
            </button>
          </div>

          {!hasResults ? (
            <p className="p-3 text-sm text-slate-400">No result found</p>
          ) : (
            <div className="max-h-[330px] space-y-2 overflow-y-auto">
              {filteredStudents.slice(0, 5).map((s) => (
                <Link
                  key={`student-${s.id}`}
                  to={`/students/${s.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50"
                >
                  <div className="rounded-xl bg-blue-100 p-2 text-blue-600">
                    <User size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-slate-500">
                      Student • {s.className} • {s.email}
                    </p>
                  </div>
                </Link>
              ))}

              {filteredTeachers.slice(0, 5).map((t) => (
                <Link
                  key={`teacher-${t.id}`}
                  to="/teachers"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50"
                >
                  <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600">
                    <GraduationCap size={16} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-slate-500">
                      Teacher • {t.subject} • {t.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GlobalSearch;