import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Edit, Eye, FileDown, Plus, Search } from "lucide-react";
import Button from "./Button";
import Card, { CardBody, CardHeader } from "./Card";
import Input from "./Input";
import Select from "./Select";
import Badge from "./Badge";
import Table from "./Table";
import ConfirmDialog from "./ConfirmDialog";
import EmptyState from "./EmptyState";
import Breadcrumb from "./Breadcrumb";
import { formatDate, formatDateTime, normalizeText, toTitleCase } from "../../utils/helpers";
import useDebounce from "../../hooks/useDebounce";
import { useApp } from "../../context/AppContext";
import { validateImageFile, required, isEmail, isNumber, isPositiveNumber, passwordsMatch } from "../../utils/validators";

function getFieldError(field, value, values) {
  if (field.required && !required(value)) return `${field.label} is required.`;
  if (field.type === "email" && value && !isEmail(value)) return "Please enter a valid email address.";
  if ((field.type === "number" || field.type === "range") && value !== "" && !isNumber(value)) return "Please enter a valid number.";
  if (field.min !== undefined && Number(value) < Number(field.min)) return `${field.label} must be at least ${field.min}.`;
  if (field.max !== undefined && Number(value) > Number(field.max)) return `${field.label} must not exceed ${field.max}.`;
  if (field.match && value !== values[field.match]) return `${field.label} does not match.`;
  return "";
}

function renderField(field, value, onChange, error, optionsLookup) {
  const commonProps = {
    name: field.name,
    value: value ?? "",
    onChange,
    required: field.required,
    placeholder: field.placeholder,
    helperText: field.helperText,
    error,
  };

  switch (field.type) {
    case "textarea":
      return (
        <label className="block">
          {field.label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{field.label}</span> : null}
          <textarea
            rows={field.rows || 4}
            name={field.name}
            value={value ?? ""}
            onChange={onChange}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
          {field.helperText ? <span className="mt-1 block text-xs text-slate-500">{field.helperText}</span> : null}
          {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
        </label>
      );
    case "select":
      return (
        <Select label={field.label} error={error} helperText={field.helperText} name={field.name} value={value ?? ""} onChange={onChange}>
          <option value="">Select {field.label}</option>
          {(typeof field.options === "function" ? field.options(optionsLookup) : field.options || []).map((option) => {
            const optionValue = typeof option === "string" ? option : option.value;
            const optionLabel = typeof option === "string" ? option : option.label;
            return (
              <option key={`${field.name}-${optionValue}`} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </Select>
      );
    case "date":
      return <Input type="date" label={field.label} error={error} helperText={field.helperText} {...commonProps} />;
    case "email":
      return <Input type="email" label={field.label} error={error} helperText={field.helperText} {...commonProps} />;
    case "number":
      return <Input type="number" label={field.label} error={error} helperText={field.helperText} {...commonProps} />;
    case "file":
      return (
        <label className="block">
          {field.label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{field.label}</span> : null}
          <input
            type="file"
            accept={field.accept || "image/*"}
            className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 hover:file:bg-slate-200"
            onChange={onChange}
          />
          {field.helperText ? <span className="mt-1 block text-xs text-slate-500">{field.helperText}</span> : null}
          {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : null}
        </label>
      );
    case "checkbox":
      return (
        <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <input type="checkbox" name={field.name} checked={Boolean(value)} onChange={onChange} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span>
            <span className="block text-sm font-medium text-slate-700">{field.label}</span>
            {field.helperText ? <span className="block text-xs text-slate-500">{field.helperText}</span> : null}
          </span>
        </label>
      );
    default:
      return <Input type={field.type || "text"} label={field.label} error={error} helperText={field.helperText} {...commonProps} />;
  }
}

export default function CrudPage({ config, mode = "list" }) {
  const app = useApp();
  const navigate = useNavigate();
  const params = useParams();

  const collection = app.appData?.[config.collection] || [];
  const recordId = params.id;
  const editingRecord = recordId ? collection.find((item) => item.id === recordId) : null;

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState(() => {
    const defaults = {};
    (config.filters || []).forEach((filter) => {
      defaults[filter.name] = filter.defaultValue || "";
    });
    return defaults;
  });
  const [sortValue, setSortValue] = useState(config.sortOptions?.[0]?.value || "");
  const debouncedSearch = useDebounce(search, 250);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState(() => config.getInitialValues ? config.getInitialValues(editingRecord, app) : {});
  const [formErrors, setFormErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (mode === "form") {
      setFormValues(config.getInitialValues ? config.getInitialValues(editingRecord, app) : {});
      setFormErrors({});
      setFormMessage("");
    }
  }, [mode, editingRecord?.id]);

  const rows = useMemo(() => {
    let result = [...collection];
    if (config.filterRows) {
      result = config.filterRows(result, filterValues, app);
    } else {
      const q = normalizeText(debouncedSearch);
      if (q) {
        const searchableFields = config.searchFields || [];
        result = result.filter((row) =>
          searchableFields.some((field) => normalizeText(row[field]).includes(q))
        );
      }
      (config.filters || []).forEach((filter) => {
        const value = filterValues[filter.name];
        if (value) {
          result = result.filter((row) => String(row[filter.key]) === String(value));
        }
      });
    }

    if (config.sortRows) {
      result = config.sortRows(result, sortValue, app);
    } else if (sortValue) {
      const sortOption = (config.sortOptions || []).find((option) => option.value === sortValue);
      if (sortOption?.compare) {
        result = [...result].sort((a, b) => sortOption.compare(a, b, app));
      }
    }
    return result;
  }, [collection, debouncedSearch, filterValues, sortValue, app, config]);

  const summaryCards = config.summaryCards ? config.summaryCards(collection, app) : [];

  const breadcrumbItems = [
    { label: "Dashboard", to: "/" },
    { label: config.pluralLabel || toTitleCase(config.collection), to: config.basePath },
  ];

  const updateField = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = async (field, event) => {
    if (field.type === "checkbox") {
      updateField(field.name, event.target.checked);
      return;
    }
    if (field.type === "file") {
      const file = event.target.files?.[0];
      if (!file) {
        updateField(field.name, editingRecord?.[field.name] || "");
        return;
      }
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setFormErrors((prev) => ({ ...prev, [field.name]: validation.message }));
        return;
      }
      const dataUrl = await field.toDataUrl(file);
      updateField(field.name, dataUrl);
      setFormErrors((prev) => ({ ...prev, [field.name]: "" }));
      return;
    }
    updateField(field.name, event.target.value);
  };

  const validateForm = () => {
    const nextErrors = {};
    (config.fields || []).forEach((field) => {
      const error = getFieldError(field, formValues[field.name], formValues);
      if (error) nextErrors[field.name] = error;
    });
    if (config.validate) {
      const customErrorMap = config.validate(formValues, app, editingRecord) || {};
      Object.assign(nextErrors, customErrorMap);
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      setSaving(true);
      const record = await config.save(formValues, editingRecord, app);
      setFormMessage("Saved successfully.");
      if (mode === "form") {
        navigate(`${config.basePath}/${record?.id || recordId}`);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await config.remove(deleteTarget.id, app);
    setDeleteTarget(null);
  };

  const renderList = () => (
    <>
      <Breadcrumb items={breadcrumbItems.concat([{ label: config.listLabel || "List", active: true }])} />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{config.pluralLabel}</h2>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {config.canCreate !== false ? (
            <Button icon={Plus} onClick={() => navigate(`${config.basePath}/new`)}>
              Add {config.singularLabel}
            </Button>
          ) : null}
        </div>
      </div>

      {summaryCards.length ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <Card key={card.label}>
              <CardBody className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{card.value}</div>
                  {card.note ? <p className="mt-1 text-xs text-slate-500">{card.note}</p> : null}
                </div>
                <div className={`rounded-2xl p-3 ${card.toneClass || "bg-blue-50 text-blue-600"}`}>
                  {card.icon ? <card.icon className="h-5 w-5" /> : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : null}

      <Card className="mb-6">
        <CardBody className="grid gap-3 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <Input label="Search" placeholder={`Search ${config.pluralLabel.toLowerCase()}`} value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {(config.filters || []).map((filter) => (
            <div key={filter.name} className="md:col-span-3">
              <Select label={filter.label} value={filterValues[filter.name]} onChange={(e) => setFilterValues((prev) => ({ ...prev, [filter.name]: e.target.value }))}>
                <option value="">{filter.placeholder || `All ${filter.label}`}</option>
                {(filter.options || []).map((option) => {
                  const optionValue = typeof option === "string" ? option : option.value;
                  const optionLabel = typeof option === "string" ? option : option.label;
                  return (
                    <option key={`${filter.name}-${optionValue}`} value={optionValue}>
                      {optionLabel}
                    </option>
                  );
                })}
              </Select>
            </div>
          ))}
          {(config.sortOptions || []).length ? (
            <div className="md:col-span-4">
              <Select label="Sort by" value={sortValue} onChange={(e) => setSortValue(e.target.value)}>
                {(config.sortOptions || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          ) : null}
        </CardBody>
      </Card>

      <Table
        columns={config.columns}
        data={rows}
        app={app}
        onView={(row) => navigate(`${config.basePath}/${row.id}`)}
        onEdit={config.canEdit === false ? null : (row) => navigate(`${config.basePath}/${row.id}/edit`)}
        onDelete={config.canDelete === false ? null : (row) => setDeleteTarget(row)}
        emptyMessage={config.emptyMessage || `No ${config.pluralLabel.toLowerCase()} found.`}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${config.singularLabel}`}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        confirmTone="danger"
      >
        Are you sure you want to delete <strong>{deleteTarget ? config.itemLabel(deleteTarget, app) : ""}</strong>?
        This action cannot be undone.
      </ConfirmDialog>
    </>
  );

  const renderForm = () => (
    <>
      <Breadcrumb
        items={breadcrumbItems.concat([
          { label: editingRecord ? "Edit" : "Add", to: config.basePath },
          { label: editingRecord ? config.itemLabel(editingRecord, app) : `New ${config.singularLabel}`, active: true },
        ])}
      />

      <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            {editingRecord ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{config.description}</p>
        </div>
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(config.basePath)}>
          Back
        </Button>
      </div>

      {formMessage ? (
        <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {formMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-base font-semibold text-slate-900">Record Information</h3>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2">
              {(config.fields || []).map((field) => {
                if (field.hidden) return null;
                return (
                  <div key={field.name} className={field.fullWidth ? "md:col-span-2" : ""}>
                    {renderField(field, formValues[field.name], (event) => handleInputChange(field, event), formErrors[field.name], app)}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <h3 className="text-base font-semibold text-slate-900">Help</h3>
          </CardHeader>
          <CardBody className="space-y-3 text-sm text-slate-600">
            <p>Fields marked required must be completed before saving.</p>
            <p>Use only school inventory terms throughout the system.</p>
            <p>Changes are saved instantly to localStorage and stay after refresh.</p>
            {config.sideNote ? <p>{config.sideNote}</p> : null}
          </CardBody>
        </Card>

        <div className="lg:col-span-3 flex flex-wrap items-center justify-end gap-3">
          <Button variant="secondary" type="button" onClick={() => navigate(config.basePath)}>Cancel</Button>
          <Button type="submit" loading={saving}>{editingRecord ? "Update" : "Save"}</Button>
        </div>
      </form>
    </>
  );

  const renderDetail = () => {
    const record = editingRecord;
    if (!record) {
      return (
        <EmptyState
          title={`${config.singularLabel} not found`}
          description="The record may have been deleted or the link is invalid."
          actionLabel="Back to list"
          onAction={() => navigate(config.basePath)}
        />
      );
    }

    const details = config.detailFields ? config.detailFields(record, app) : [];

    return (
      <>
        <Breadcrumb
          items={breadcrumbItems.concat([
            { label: config.itemLabel(record, app), active: true },
          ])}
        />

        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{config.itemLabel(record, app)}</h2>
            <p className="mt-1 text-sm text-slate-500">{config.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate(config.basePath)}>Back</Button>
            {config.printable ? <Button variant="secondary" icon={FileDown} onClick={() => window.print()}>Print</Button> : null}
            {config.canEdit !== false ? <Button icon={Edit} onClick={() => navigate(`${config.basePath}/${record.id}/edit`)}>Edit</Button> : null}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-900">Details</h3>
            </CardHeader>
            <CardBody>
              <div className="grid gap-4 md:grid-cols-2">
                {details.map((field) => (
                  <div key={field.label} className={field.fullWidth ? "md:col-span-2" : ""}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{field.label}</p>
                    <div className="mt-1 text-sm text-slate-900">{field.value ?? "-"}</div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-slate-900">Status</h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {config.statusBadge ? config.statusBadge(record) : <Badge tone="neutral">{record.status || "Active"}</Badge>}
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Created</p>
                <p>{formatDateTime(record.createdAt)}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                <p className="font-medium text-slate-900">Updated</p>
                <p>{formatDateTime(record.updatedAt)}</p>
              </div>
            </CardBody>
          </Card>
        </div>
      </>
    );
  };

  if (mode === "form") return renderForm();
  if (mode === "detail") return renderDetail();
  return renderList();
}
