import useDocumentTitle from "../../hooks/useDocumentTitle";
import { useApp } from "../../context/AppContext";
import StatCard from "../../components/dashboard/StatCard";
import ActivityList from "../../components/dashboard/ActivityList";
import ChartCard from "../../components/dashboard/ChartCard";
import QuickActions from "../../components/dashboard/QuickActions";
import Card, { CardBody, CardHeader } from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { Boxes, ArchiveRestore, ClipboardList, AlertTriangle } from "lucide-react";
import { formatNumber } from "../../utils/helpers";

export default function Dashboard() {
  const app = useApp();
  useDocumentTitle("Dashboard • School Stock Management");

  const { summary, topCategoryData, lowStockItems, recentActivities } = app;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-blue-600">Overview</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">School Stock Dashboard</h2>
          <p className="max-w-3xl text-sm text-slate-500">
            Monitor stock balance, assignments, low stock alerts, and recent activity in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Items" value={formatNumber(summary.totalItems)} icon={Boxes} tone="blue" trend="All active inventory records" />
        <StatCard title="Stock In" value={formatNumber(summary.totalStockIn)} icon={ArchiveRestore} tone="emerald" trend="Received into school stock" />
        <StatCard title="Assign Item" value={formatNumber(summary.totalAssigned)} icon={ClipboardList} tone="violet" trend="Distributed to departments and classes" />
        <StatCard title="Low Stock Alert" value={formatNumber(summary.lowStockCount)} icon={AlertTriangle} tone="amber" trend="Items at or below threshold" />
      </div>

      <QuickActions />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ChartCard title="Inventory Summary by Category" data={topCategoryData} />
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-base font-semibold text-slate-900">Low Stock Items</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {lowStockItems.length ? lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.code}</p>
                </div>
                <Badge tone="warning">{formatNumber(item.quantity)} left</Badge>
              </div>
            )) : (
              <p className="text-sm text-slate-500">No low stock items right now.</p>
            )}
          </CardBody>
        </Card>
      </div>

      <ActivityList activities={recentActivities} />
    </div>
  );
}
