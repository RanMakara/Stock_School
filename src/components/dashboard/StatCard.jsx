import Card, { CardBody } from "../common/Card";

export default function StatCard({ title, value, icon: Icon, trend, tone = "blue" }) {
  const toneMap = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
    violet: "text-violet-600 bg-violet-50",
  };

  return (
    <Card className="h-full">
      <CardBody className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
          {trend ? <p className="mt-2 text-xs text-slate-500">{trend}</p> : null}
        </div>
        <div className={`rounded-2xl p-3 ${toneMap[tone] || toneMap.blue}`}>
          {Icon ? <Icon className="h-6 w-6" /> : null}
        </div>
      </CardBody>
    </Card>
  );
}
