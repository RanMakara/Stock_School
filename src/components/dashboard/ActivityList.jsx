import Card, { CardBody, CardHeader } from "../common/Card";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/helpers";

export default function ActivityList({ activities = [] }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
      </CardHeader>
      <CardBody className="space-y-4">
        {activities.length ? activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
            <div className="mt-0.5 h-3 w-3 rounded-full bg-blue-500" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-slate-900">{activity.title}</h4>
                <Badge tone="neutral">{activity.type}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{activity.description}</p>
              <p className="mt-2 text-xs text-slate-400">{formatDateTime(activity.date)}</p>
            </div>
          </div>
        )) : (
          <p className="text-sm text-slate-500">No recent activity yet.</p>
        )}
      </CardBody>
    </Card>
  );
}
