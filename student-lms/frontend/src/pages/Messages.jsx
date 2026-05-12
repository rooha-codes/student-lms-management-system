import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";
import {
  Plus,
  Search,
  Trash2,
  Mail,
  MailOpen,
  X,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

function Messages() {
  const emptyForm = {
    senderName: "",
    senderRole: "Admin",
    receiverName: "",
    receiverRole: "Student",
    subject: "",
    message: "",
  };

  const [messages, setMessages] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await API.get("/messages");
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
      showToast("Failed to load messages", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openModal = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setForm(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.senderName ||
      !form.receiverName ||
      !form.subject ||
      !form.message
    ) {
      showToast("Please fill all required fields", "error");
      return;
    }

    try {
      await API.post("/messages", form);

      showToast("Message sent successfully");
      closeModal();
      fetchMessages();
    } catch (error) {
      console.log(error);
      showToast(error.response?.data?.message || "Send failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await API.delete(`/messages/${id}`);
      showToast("Message deleted");
      fetchMessages();
    } catch (error) {
      console.log(error);
      showToast("Delete failed", "error");
    }
  };

  const markAsRead = async (msg) => {
    if (msg.status === "Read") return;

    try {
      await API.put(`/messages/${msg.id}`, {
        status: "Read",
      });

      fetchMessages();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredMessages = useMemo(() => {
    let data = [...messages];

    data = data.filter((item) =>
      `${item.senderName || ""} ${item.receiverName || ""} ${item.subject || ""} ${item.message || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    if (roleFilter !== "All") {
      data = data.filter((item) => item.receiverRole === roleFilter);
    }

    return data;
  }, [messages, search, roleFilter]);

  const unreadCount = messages.filter((m) => m.status === "Unread").length;
  const readCount = messages.filter((m) => m.status === "Read").length;

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
                Communication Center
              </p>

              <h1 className="mt-2 text-3xl font-bold md:text-4xl">
                Messages
              </h1>

              <p className="mt-2 text-sm text-emerald-100 md:text-base">
                Send and manage communication across students, teachers and admin.
              </p>
            </div>

            <button
              onClick={openModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-[#0b5c4b]"
            >
              <Plus size={18} />
              New Message
            </button>
          </div>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Messages</p>
            <h3 className="mt-2 text-3xl font-bold">{messages.length}</h3>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Unread</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-600">
              {unreadCount}
            </h3>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Read</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {readCount}
            </h3>
          </div>
        </section>

        <section className="grid w-full gap-4 rounded-[28px] bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-2 rounded-2xl border px-4 py-3 md:col-span-2">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border px-4 py-3 outline-none"
          >
            <option>All</option>
            <option>Student</option>
            <option>Teacher</option>
            <option>Admin</option>
          </select>
        </section>

        <section className="grid gap-4">
          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center text-slate-400">
              Loading messages...
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center text-slate-400">
              No messages found
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => markAsRead(msg)}
                className="rounded-3xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    <div
                      className={`rounded-2xl p-3 ${
                        msg.status === "Unread"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {msg.status === "Unread" ? (
                        <Mail size={20} />
                      ) : (
                        <MailOpen size={20} />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {msg.subject}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        From: {msg.senderName} ({msg.senderRole}) → To:{" "}
                        {msg.receiverName} ({msg.receiverRole})
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        msg.status === "Unread"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {msg.status}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                      className="rounded-xl bg-red-100 p-2 text-red-600"
                    >
                      <Trash2 size={16} />
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
              className="w-full max-w-3xl rounded-[32px] bg-white p-6 shadow-2xl sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Send Message</h2>
                  <p className="text-sm text-slate-500">
                    Send direct communication
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
                  name="senderName"
                  placeholder="Sender Name"
                  value={form.senderName}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3"
                />

                <select
                  name="senderRole"
                  value={form.senderRole}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3"
                >
                  <option>Admin</option>
                  <option>Teacher</option>
                  <option>Student</option>
                </select>

                <input
                  name="receiverName"
                  placeholder="Receiver Name"
                  value={form.receiverName}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3"
                />

                <select
                  name="receiverRole"
                  value={form.receiverRole}
                  onChange={handleChange}
                  className="rounded-2xl border px-4 py-3"
                >
                  <option>Student</option>
                  <option>Teacher</option>
                  <option>Admin</option>
                </select>

                <input
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="sm:col-span-2 rounded-2xl border px-4 py-3"
                />

                <textarea
                  name="message"
                  placeholder="Write message..."
                  rows="6"
                  value={form.message}
                  onChange={handleChange}
                  className="sm:col-span-2 rounded-2xl border px-4 py-3"
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
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#0b5c4b] py-3 font-semibold text-white"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Messages;