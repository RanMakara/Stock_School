import { Link } from "react-router-dom";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import Card, { CardBody } from "../../components/common/Card";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import { formatDateTime } from "../../utils/helpers";

export default function ProfileView() {
  const app = useApp();
  const { currentUser } = useAuth();
  useDocumentTitle("Profile • School Stock Management");

  const profile = app.appData.profile || {};

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h2>
        <p className="mt-1 text-sm text-slate-500">View and manage your profile details and photo.</p>
      </div>

      <Card>
        <CardBody className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div className="space-y-4 text-center md:text-left">
            <img
              src={currentUser?.photo || profile.photo}
              alt="Profile"
              className="mx-auto h-40 w-40 rounded-3xl object-cover shadow-sm md:mx-0"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900">{profile.fullName}</h3>
              <p className="text-sm text-slate-500">{profile.email}</p>
            </div>
            <Badge tone="info">{profile.role}</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Full name</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{profile.fullName}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{profile.email}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{profile.phone}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{profile.role}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{formatDateTime(profile.updatedAt)}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/profile/edit">Edit Profile</Button>
        <Button as={Link} to="/profile/change-password" variant="secondary">Change Password</Button>
      </div>
    </div>
  );
}
