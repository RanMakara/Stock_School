import { useMemo, useState } from "react";
import { FileDown, Filter } from "lucide-react";
import Card, { CardBody } from "./Card";
import Button from "./Button";
import Input from "./Input";
import Select from "./Select";
import Table from "./Table";
import Breadcrumb from "./Breadcrumb";
import { useApp } from "../../context/AppContext";
import { formatDate } from "../../utils/helpers";

export default function ReportPage({ config }) {
  const app = useApp();
  const [filters, setFilters] = useState(() => config.getDefaultFilters ? config.getDefaultFilters(app) : {});
  const rows = useMemo(() => config.buildRows(app, filters), [app, filters, config]);
  const summaryCards = config.summaryCards ? config.summaryCards(app, filters, rows) : [];

  const renderFilter = (field) => {
    if (field.type === "select") {
      return (
        <Select
          key={field.name}
          label={field.label}
          value={filters[field.name] || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))}
        >
          <option value="">{field.placeholder || `All ${field.label}`}</option>
          {field.options.map((option) => (
            <option key={`${field.name}-${option.value ?? option}`} value={option.value ?? option}>
              {option.label ?? option}
            </option>
          ))}
        </Select>
      );
    }

    return (
      <Input
        key={field.name}
        type={field.type || "date"}
        label={field.label}
        value={filters[field.name] || ""}
        onChange={(e) => setFilters((prev) => ({ ...prev, [field.name]: e.target.value }))}
      />
    );
  };

  return (
    <>
      <Breadcrumb items={[{ label: "Dashboard", to: "/" }, { label: "Reports", to: "/reports/stock" }, { label: config.title, active: true }]} />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{config.title}</h2>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={FileDown} onClick={() => window.print()}>Print</Button>
          <Button variant="secondary" icon={Filter} onClick={() => setFilters(config.getDefaultFilters ? config.getDefaultFilters(app) : {})}>Reset</Button>
        </div>
      </div>

      {summaryCards.length ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardBody>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                {card.note ? <p className="mt-1 text-xs text-slate-500">{card.note}</p> : null}
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      <Card className="mb-6">
        <CardBody className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(config.filterFields || []).map(renderFilter)}
        </CardBody>
      </Card>

      <div className="print-page">
        <Table columns={config.columns} data={rows} app={app} actions={false} emptyMessage={config.emptyMessage || "No report data found."} />
      </div>

      <div className="mt-4 text-xs text-slate-500">
        Report generated on {formatDate(new Date().toISOString())}
      </div>
    </>
  );
}
