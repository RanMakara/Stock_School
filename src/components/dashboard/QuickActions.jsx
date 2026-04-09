import Card, { CardBody, CardHeader } from "../common/Card";
import Button from "../common/Button";
import { Plus, ArchiveRestore, ClipboardList, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickActions() {
  const actions = [
    { label: "Add Item", to: "/inventory/new", icon: Plus, tone: "primary" },
    { label: "Stock In", to: "/receiving/new", icon: ArchiveRestore, tone: "secondary" },
    { label: "Assign Item", to: "/assign-items/new", icon: ClipboardList, tone: "secondary" },
    { label: "View Reports", to: "/reports/stock", icon: BarChart3, tone: "secondary" },
  ];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
      </CardHeader>
      <CardBody className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => (
          <Button
            key={action.label}
            as={Link}
            to={action.to}
            variant={action.tone}
            className="w-full justify-start"
            icon={action.icon}
          >
            {action.label}
          </Button>
        ))}
      </CardBody>
    </Card>
  );
}
