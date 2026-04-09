import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { fileToDataUrl, initials, createAvatarDataUrl } from "../../utils/helpers";
import { validateImageFile, isEmail, required } from "../../utils/validators";

export default function ProfileEdit() {
  const app = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const profile = app.appData.profile || {};

  const [form, setForm] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    role: profile.role || "",
    photo: profile.photo || "",
  });
  const [preview, setPreview] = useState(profile.photo || "");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useDocumentTitle("Edit Profile • School Stock Management");

  const handleChange = async (event) => {
    const { name, value, type, files } = event.target;
    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setFieldErrors((prev) => ({ ...prev, photo: validation.message }));
        return;
      }
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      setForm((prev) => ({ ...prev, photo: dataUrl }));
      setFieldErrors((prev) => ({ ...prev, photo: "" }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!required(form.fullName)) nextErrors.fullName = "Full name is required.";
    if (!isEmail(form.email)) nextErrors.email = "Please enter a valid email address.";
    if (!required(form.phone)) nextErrors.phone = "Phone is required.";
    if (!required(form.role)) nextErrors.role = "Role is required.";
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    if (!validate()) return;
    app.updateProfile(form);
    navigate("/profile");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Edit Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Update your details and profile image. The avatar updates immediately.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardBody className="grid gap-4 md:grid-cols-2">
            <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={fieldErrors.fullName} />
            <Input label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={fieldErrors.email} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} error={fieldErrors.phone} />
            <Input label="Role" name="role" value={form.role} onChange={handleChange} error={fieldErrors.role} />
            <label className="md:col-span-2 block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Profile Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
              />
              <span className="mt-1 block text-xs text-slate-500">Image is saved in localStorage and used everywhere in the app.</span>
              {fieldErrors.photo ? <span className="mt-1 block text-xs font-medium text-rose-600">{fieldErrors.photo}</span> : null}
            </label>

            {error ? (
              <div className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <div className="md:col-span-2 flex flex-wrap justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
              <Button type="submit">Save Profile</Button>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="space-y-4 text-center">
            <img
              src={preview || currentUser?.photo || profile.photo || createAvatarDataUrl(initials(form.fullName || "PF"))}
              alt="Profile preview"
              className="mx-auto h-40 w-40 rounded-3xl object-cover shadow-sm"
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{form.fullName || "Profile Preview"}</h3>
              <p className="text-sm text-slate-500">{form.email || "email@example.com"}</p>
            </div>
          </CardBody>
        </Card>
      </form>
    </div>
  );
}
