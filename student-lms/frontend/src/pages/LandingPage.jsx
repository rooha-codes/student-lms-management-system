import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  GraduationCap,
  Users,
  BookOpen,
  CalendarCheck,
  BarChart3,
  MessageCircle,
  ShieldCheck,
  Clock3,
  Settings,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Star,
} from "lucide-react";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      title: "Secure Authentication",
      desc: "Safe login and signup flow for admin access.",
      icon: ShieldCheck,
    },
    {
      title: "Student Dashboard",
      desc: "Manage student profiles, classes, courses, and status.",
      icon: Users,
    },
    {
      title: "Teacher Dashboard",
      desc: "Organize faculty records, subjects, and experience.",
      icon: GraduationCap,
    },
    {
      title: "Attendance Tracking",
      desc: "Track Present, Absent, and Late attendance records.",
      icon: CalendarCheck,
    },
    {
      title: "Results Analytics",
      desc: "Add marks, calculate grades, and monitor performance.",
      icon: BarChart3,
    },
    {
      title: "Schedule Management",
      desc: "Plan classes, subjects, teachers, and timelines.",
      icon: Clock3,
    },
    {
      title: "Communication Center",
      desc: "Central messaging and institute communication system.",
      icon: MessageCircle,
    },
    {
      title: "Admin Settings",
      desc: "Manage profile, institute branding, and preferences.",
      icon: Settings,
    },
  ];

  const stats = [
    { value: "500+", label: "Students Managed" },
    { value: "50+", label: "Teachers Added" },
    { value: "100+", label: "Courses Created" },
    { value: "95%", label: "User Satisfaction" },
  ];

  const benefits = [
    "Modern dashboard experience",
    "Responsive across all devices",
    "Easy student and teacher management",
    "Clean CRUD-based workflow",
    "Fast and scalable interface",
    "Professional institute-ready UI",
  ];

  const testimonials = [
    {
      name: "Admin Panel",
      role: "Institute Management",
      text: "EduCore makes student, teacher, result, and attendance management clean and organized.",
    },
    {
      name: "Teacher Portal",
      role: "Faculty Experience",
      text: "A simple dashboard structure helps teachers and admins manage academic records faster.",
    },
    {
      name: "Student System",
      role: "LMS Workflow",
      text: "The interface feels modern, smooth, and ready for real educational institutes.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-5 lg:px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0b5c4b] text-white shadow-md">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-950">EduCore</h1>
              <p className="text-xs font-medium text-slate-500">Student LMS</p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
            <a href="#home" className="hover:text-[#0b5c4b]">
              Home
            </a>
            <a href="#about" className="hover:text-[#0b5c4b]">
              About
            </a>
            <a href="#features" className="hover:text-[#0b5c4b]">
              Features
            </a>
            <a href="#contact" className="hover:text-[#0b5c4b]">
              Contact
            </a>
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              to="/login"
              className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="rounded-2xl bg-[#0b5c4b] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#094c3f]"
            >
              Signup
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-2xl bg-slate-100 p-3 text-slate-700 lg:hidden"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-4 text-sm font-semibold text-slate-600">
              <a onClick={() => setMenuOpen(false)} href="#home">
                Home
              </a>
              <a onClick={() => setMenuOpen(false)} href="#about">
                About
              </a>
              <a onClick={() => setMenuOpen(false)} href="#features">
                Features
              </a>
              <a onClick={() => setMenuOpen(false)} href="#contact">
                Contact
              </a>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  to="/login"
                  className="rounded-2xl border border-slate-200 py-3 text-center font-bold"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="rounded-2xl bg-[#0b5c4b] py-3 text-center font-bold text-white"
                >
                  Signup
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-[#0b5c4b] via-[#0a725d] to-[#0a8a6e]"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-emerald-200 blur-3xl" />
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-emerald-50 ring-1 ring-white/20 lg:mx-0">
                <CheckCircle2 size={16} />
                Premium LMS Dashboard Solution
              </div>

              <h1 className="text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
                Smart Student LMS Management System
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg lg:mx-0">
                Manage students, teachers, attendance, results, courses,
                schedules, messages, and institute operations from one modern
                dashboard.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-base font-bold text-[#0b5c4b] shadow-xl transition hover:bg-slate-100"
                >
                  Get Started
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-base font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Login
                </Link>
              </div>
            </div>

            <div className="rounded-[34px] bg-white/12 p-4 shadow-2xl ring-1 ring-white/20 backdrop-blur">
              <div className="rounded-[28px] bg-white p-5 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">
                      Dashboard Preview
                    </p>
                    <h3 className="text-2xl font-bold text-slate-950">
                      EduCore Analytics
                    </h3>
                  </div>

                  <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                    <BarChart3 size={24} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Students", "500+", Users],
                    ["Teachers", "50+", GraduationCap],
                    ["Courses", "100+", BookOpen],
                    ["Attendance", "95%", CalendarCheck],
                  ].map(([label, value, Icon], index) => (
                    <div
                      key={index}
                      className="rounded-3xl bg-slate-50 p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-500">
                            {label}
                          </p>
                          <h4 className="mt-2 text-3xl font-bold text-slate-950">
                            {value}
                          </h4>
                        </div>
                        <div className="rounded-2xl bg-white p-3 text-[#0b5c4b] shadow-sm">
                          <Icon size={22} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-3xl bg-gradient-to-r from-[#0b5c4b] to-[#0a8a6e] p-5 text-white">
                  <p className="text-sm text-emerald-100">Today’s Overview</p>
                  <h4 className="mt-2 text-2xl font-bold">
                    92% attendance completed
                  </h4>
                  <div className="mt-4 h-3 rounded-full bg-white/20">
                    <div className="h-3 w-[92%] rounded-full bg-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0b5c4b]">
                About EduCore
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                A complete institute management platform
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                EduCore is built to simplify daily academic operations through
                a clean dashboard where admins can manage students, teachers,
                courses, attendance, results, schedules, and communication.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Student Management",
                "Teacher Management",
                "Attendance",
                "Results",
                "Courses",
                "Scheduling",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <CheckCircle2 className="text-[#0b5c4b]" size={24} />
                  <h3 className="mt-4 text-lg font-bold text-slate-950">
                    {item}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Organized, responsive, and easy-to-use management workflow
                    for modern institutes.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0b5c4b]">
                  Features
                </p>
                <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                  Everything an LMS dashboard needs
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-slate-600">
                Designed for admin teams that need a fast, clean, and
                professional management experience.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="rounded-[28px] bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0b5c4b] text-white">
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold text-slate-950">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[28px] bg-white/10 p-6 text-center ring-1 ring-white/10"
              >
                <h3 className="text-4xl font-extrabold">{stat.value}</h3>
                <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0b5c4b]">
                Why Choose Us
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Built for speed, clarity, and real institute workflows
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                EduCore gives your LMS a clean, scalable, and professional
                dashboard experience that works across mobile, tablet, and
                desktop screens.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
                  >
                    <CheckCircle2 size={20} className="text-[#0b5c4b]" />
                    <span className="text-sm font-semibold text-slate-700">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] bg-white p-6 shadow-xl ring-1 ring-slate-100">
              <div className="rounded-[28px] bg-gradient-to-r from-[#0b5c4b] to-[#0a8a6e] p-6 text-white">
                <h3 className="text-2xl font-bold">Institute Ready</h3>
                <p className="mt-3 text-sm leading-7 text-emerald-50">
                  A polished LMS interface for students, teachers, admin teams,
                  and academic workflows.
                </p>
              </div>

              <div className="mt-5 space-y-4">
                {["Responsive UI", "CRUD Management", "Analytics Cards"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
                    >
                      <span className="font-semibold text-slate-700">
                        {item}
                      </span>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        Active
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0b5c4b]">
                Trusted Experience
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Designed for smooth academic management
              </h2>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((item) => (
                <div
                  key={item.name}
                  className="rounded-[28px] bg-slate-50 p-6 shadow-sm"
                >
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-600">
                    “{item.text}”
                  </p>

                  <div className="mt-6">
                    <h4 className="font-bold text-slate-950">{item.name}</h4>
                    <p className="text-sm text-slate-500">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#0b5c4b]">
                Contact
              </p>

              <h2 className="mt-3 text-3xl font-extrabold text-slate-950 sm:text-4xl">
                Want a modern LMS dashboard?
              </h2>

              <p className="mt-4 text-base leading-8 text-slate-600">
                Contact us for LMS dashboards, admin panels, React projects,
                and full-stack educational platforms.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <Mail className="text-[#0b5c4b]" size={22} />
                  <span className="font-semibold text-slate-700">
                    contact@educore.com
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <Phone className="text-[#0b5c4b]" size={22} />
                  <span className="font-semibold text-slate-700">
                    +92 300 0000000
                  </span>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
                  <MapPin className="text-[#0b5c4b]" size={22} />
                  <span className="font-semibold text-slate-700">
                    Karachi, Pakistan
                  </span>
                </div>
              </div>
            </div>

            <form className="rounded-[34px] bg-white p-6 shadow-xl ring-1 ring-slate-100 sm:p-8">
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-[#0b5c4b] focus:bg-white"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-[#0b5c4b] focus:bg-white"
                />

                <textarea
                  rows="5"
                  placeholder="Your Message"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-[#0b5c4b] focus:bg-white"
                />

                <button
                  type="button"
                  className="rounded-2xl bg-[#0b5c4b] py-4 font-bold text-white shadow-md transition hover:bg-[#094c3f]"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0b5c4b]">
                <GraduationCap size={22} />
              </div>
              <h3 className="text-xl font-bold">EduCore LMS</h3>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Modern Student LMS Management System.
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-white">
              About
            </a>
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#contact" className="hover:text-white">
              Contact
            </a>
            <Link to="/login" className="hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="hover:text-white">
              Signup
            </Link>
          </div>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} EduCore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;