import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function Login() {
  const app = useApp();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: app.appData.profile?.email || "",
    password: app.appData.profile?.password || "",
    rememberMe: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useDocumentTitle("Login • School Stock Management");

  const system = app.appData.system || app.appData.settings || {};
  const logo = system.logo || "";
  const systemName = system.systemName || "School Stock Management";
  const schoolName = system.schoolName || "School";

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    const result = login(form.email, form.password, form.rememberMe);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <img src={logo} alt="System logo" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <h1 className="text-lg font-bold text-slate-900">{systemName}</h1>
              <p className="text-sm text-slate-500">{schoolName}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">School use only</p>
            <h2 className="mt-2 text-4xl font-black tracking-tight text-slate-900">
              Secure stock control for the school office and departments.
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-600">
              Manage stock in, assignments, returns, reports, and school inventory records from one clean dashboard.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Stock balance",
              "Assign item tracking",
              "Printable reports",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>

        <Card className="mx-auto w-full max-w-md">
          <CardBody className="p-6">
            <h3 className="text-2xl font-bold text-slate-900">Sign in</h3>
            <p className="mt-1 text-sm text-slate-500">Use the system email and password to continue.</p>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@school.local" />
              <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter password" />

              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Remember this device
              </label>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <Button type="submit" loading={loading} className="w-full">
                Login
              </Button>
            </form>

            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              Default demo: <strong className="text-slate-700">admin@school.local</strong> / <strong className="text-slate-700">admin123</strong>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
