import { useState } from "react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { fileToDataUrl } from "../../utils/helpers";
import { validateImageFile, required } from "../../utils/validators";

export default function SystemSettings() {
  const app = useApp();
  const system = app.appData.system || {};
  const [form, setForm] = useState({
    systemName: system.systemName || "",
    schoolName: system.schoolName || "",
    logo: system.logo || "",
  });
  const [logoPreview, setLogoPreview] = useState(system.logo || "");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useDocumentTitle("System Settings • School Stock Management");

  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setErrors((prev) => ({ ...prev, logo: validation.message }));
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      setForm((prev) => ({ ...prev, logo: dataUrl }));
      setLogoPreview(dataUrl);
      setErrors((prev) => ({ ...prev, logo: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!required(form.systemName)) nextErrors.systemName = "System name is required.";
    if (!required(form.schoolName)) nextErrors.schoolName = "School name is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    if (!validate()) return;
    app.updateSystem(form);
    setMessage("System settings saved successfully.");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Update the system name, school name, and logo used across the app.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="grid gap-4 md:grid-cols-2">
            <Input label="System Name" name="systemName" value={form.systemName} onChange={handleChange} error={errors.systemName} />
            <Input label="School Name" name="schoolName" value={form.schoolName} onChange={handleChange} error={errors.schoolName} />
            <label className="md:col-span-2 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">System Logo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              />
              <span className="mt-1 block text-xs text-slate-500">Used in the login page, sidebar, and navbar.</span>
              {errors.logo ? <span className="mt-1 block text-xs font-medium text-rose-600">{errors.logo}</span> : null}
            </label>

            {message ? (
              <div className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <div className="md:col-span-2 flex justify-end gap-3">
              <Button type="submit">Save Settings</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4 text-center">
            <img src={logoPreview || form.logo} alt="Logo preview" className="mx-auto h-32 w-32 rounded-3xl object-cover shadow-sm" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{form.systemName || "System Name"}</h3>
              <p className="text-sm text-slate-500">{form.schoolName || "School Name"}</p>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
