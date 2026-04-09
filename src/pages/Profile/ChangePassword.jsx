import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import Card, { CardBody } from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { passwordsMatch, required } from "../../utils/validators";

export default function ChangePassword() {
  const app = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  useDocumentTitle("Change Password • School Stock Management");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!required(form.currentPassword)) nextErrors.currentPassword = "Current password is required.";
    if (!required(form.newPassword)) nextErrors.newPassword = "New password is required.";
    if (form.newPassword.length < 6) nextErrors.newPassword = "Password must be at least 6 characters.";
    if (!passwordsMatch(form.newPassword, form.confirmPassword)) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    if (!validate()) return;
    const result = app.changePassword(form.currentPassword, form.newPassword);
    if (!result.ok) {
      setErrors({ currentPassword: result.message });
      return;
    }
    setMessage("Password updated successfully.");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Change Password</h2>
        <p className="mt-1 text-sm text-slate-500">Update the fake login password used by this frontend.</p>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardBody>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input label="Current Password" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} error={errors.currentPassword} />
            <Input label="New Password" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} error={errors.newPassword} helperText="Use at least 6 characters." />
            <Input label="Confirm New Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

            {message ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => navigate("/profile")}>Cancel</Button>
              <Button type="submit">Save Password</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
