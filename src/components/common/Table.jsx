import Badge from "./Badge";
import Button from "./Button";

function renderCell(column, row, app) {
  if (column.render) return column.render(row, app);
  const value = column.accessor ? column.accessor(row, app) : row[column.key];
  if (column.type === "badge") {
    return <Badge tone={column.tone?.(row, app) || "neutral"}>{value}</Badge>;
  }
  return value ?? "-";
}

export default function Table({
  columns,
  data,
  app,
  actions = true,
  onView,
  onEdit,
  onDelete,
  emptyMessage = "No records found.",
  rowKey = "id",
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                >
                  {column.header}
                </th>
              ))}
              {actions ? (
                <th scope="col" className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length ? data.map((row) => (
              <tr key={row[rowKey]} className="hover:bg-slate-50/80">
                {columns.map((column) => (
                  <td key={`${row[rowKey]}-${column.header}`} className="px-4 py-4 text-sm text-slate-700">
                    {renderCell(column, row, app)}
                  </td>
                ))}
                {actions ? (
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {onView ? <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => onView(row)}>View</Button> : null}
                      {onEdit ? <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => onEdit(row)}>Edit</Button> : null}
                      {onDelete ? <Button variant="danger" className="px-2 py-1 text-xs" onClick={() => onDelete(row)}>Delete</Button> : null}
                    </div>
                  </td>
                ) : null}
              </tr>
            )) : (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
