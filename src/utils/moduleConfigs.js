import { formatDate, formatDateTime, formatNumber, initials } from "./helpers";
import { fileToDataUrl, createAvatarDataUrl } from "./helpers";
import { ITEM_CATEGORIES, ASSIGN_TO_TYPES, ORDER_STATUS_OPTIONS, RECORD_STATUS_OPTIONS, ASSIGN_STATUS_OPTIONS, RECEIVING_STATUS_OPTIONS, RETURN_CONDITION_OPTIONS, USER_ROLE_OPTIONS } from "./constants";
import Badge from "../components/common/Badge";
import { Boxes, ClipboardList, Landmark, Package, RotateCcw, Truck, Users, FileText, UserCog, Warehouse } from "lucide-react";

function toneFromStatus(status) {
  const value = String(status || "").toLowerCase();
  if (["active", "approved", "received", "completed", "good"].includes(value)) return "success";
  if (["pending", "sent", "partial", "fair"].includes(value)) return "warning";
  if (["inactive", "returned", "damaged", "draft"].includes(value)) return "danger";
  return "neutral";
}

function statusBadge(label) {
  return <Badge tone={toneFromStatus(label)}>{label || "Unknown"}</Badge>;
}

function withinDateRange(dateValue, from, to) {
  if (!from && !to) return true;
  const current = new Date(dateValue);
  if (Number.isNaN(current.getTime())) return true;
  if (from && current < new Date(from)) return false;
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    if (current > end) return false;
  }
  return true;
}

function applyDateRange(rows, from, to, accessor = (row) => row.date) {
  return rows.filter((row) => withinDateRange(accessor(row), from, to));
}

function resolveItemName(app, id) {
  return app.getItemName(id);
}
function resolveDepartmentName(app, id) {
  return app.getDepartmentName(id);
}
function resolveSupplierName(app, id) {
  return app.getSupplierName(id);
}
function resolveOrderName(app, id) {
  return app.getOrderName(id);
}

export const inventoryConfig = {
  collection: "inventory",
  basePath: "/inventory",
  singularLabel: "Item",
  pluralLabel: "Inventory",
  description: "Manage school items, quantities, stock balance, and supplier information.",
  listLabel: "Inventory List",
  printable: true,
  searchFields: ["code", "name", "category", "location", "condition"],
  filters: [
    { name: "category", key: "category", label: "Category", options: ITEM_CATEGORIES },
  ],
  sortOptions: [
    { value: "name-asc", label: "Name A-Z", compare: (a, b) => a.name.localeCompare(b.name) },
    { value: "name-desc", label: "Name Z-A", compare: (a, b) => b.name.localeCompare(a.name) },
    { value: "qty-asc", label: "Stock Low to High", compare: (a, b) => Number(a.quantity) - Number(b.quantity) },
    { value: "qty-desc", label: "Stock High to Low", compare: (a, b) => Number(b.quantity) - Number(a.quantity) },
  ],
  fields: [
    { name: "code", label: "Item Code", type: "text", required: true, placeholder: "ITM-001" },
    { name: "name", label: "Item Name", type: "text", required: true, placeholder: "A4 Copy Paper" },
    { name: "category", label: "Category", type: "select", required: true, options: ITEM_CATEGORIES },
    { name: "unit", label: "Unit", type: "text", required: true, placeholder: "Piece / Ream / Pack" },
    { name: "quantity", label: "Stock Quantity", type: "number", required: true, min: 0, helperText: "Current stock on hand." },
    { name: "minStock", label: "Low Stock Threshold", type: "number", required: true, min: 0, helperText: "A badge will appear when stock reaches this point." },
    { name: "supplierId", label: "Supplier", type: "select", required: true, options: (app) => (app.appData.suppliers || []).map((supplier) => ({ value: supplier.id, label: supplier.name })) },
    { name: "location", label: "Storage Location", type: "text", required: true, placeholder: "Store Room A" },
    { name: "condition", label: "Condition", type: "select", required: true, options: ["Good", "Fair", "Damaged"] },
    { name: "image", label: "Item Image", type: "file", accept: "image/*", helperText: "Optional image. Saved in localStorage.", toDataUrl: fileToDataUrl },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true, helperText: "Optional item notes." },
  ],
  getInitialValues: (record, app) => ({
    code: record?.code || `ITM-${String((app.appData.inventory?.length || 0) + 1).padStart(3, "0")}`,
    name: record?.name || "",
    category: record?.category || "",
    unit: record?.unit || "Piece",
    quantity: record?.quantity ?? 0,
    minStock: record?.minStock ?? 0,
    supplierId: record?.supplierId || "",
    location: record?.location || "",
    condition: record?.condition || "Good",
    image: record?.image || "",
    notes: record?.notes || "",
  }),
  validate: (values) => {
    const errors = {};
    if (Number(values.quantity) < 0) errors.quantity = "Stock quantity cannot be negative.";
    if (Number(values.minStock) < 0) errors.minStock = "Low stock threshold cannot be negative.";
    return errors;
  },
  save: (values, record, app) => app.saveInventory(values, record?.id),
  remove: (id, app) => app.removeInventory(id),
  itemLabel: (record, app) => `${record.code} • ${record.name}`,
  summaryCards: (records) => [
    { label: "Items", value: records.length, icon: Boxes, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Stock Balance", value: formatNumber(records.reduce((sum, item) => sum + Number(item.quantity || 0), 0)), icon: Package, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Low Stock", value: records.filter((item) => Number(item.quantity || 0) <= Number(item.minStock || 0)).length, icon: Warehouse, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Suppliers", value: new Set(records.map((item) => item.supplierId).filter(Boolean)).size, icon: Truck, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    {
      header: "Item",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image || createAvatarDataUrl(initials(row.name))} alt="" className="h-12 w-12 rounded-xl object-cover" />
          <div>
            <div className="font-semibold text-slate-900">{row.name}</div>
            <div className="text-xs text-slate-500">{row.code}</div>
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: (row) => row.category },
    { header: "Supplier", accessor: (row, app) => resolveSupplierName(app, row.supplierId) },
    {
      header: "Stock",
      render: (row) => (
        <div>
          <div className="font-semibold text-slate-900">{formatNumber(row.quantity)}</div>
          <div className="text-xs text-slate-500">Min {formatNumber(row.minStock)}</div>
        </div>
      ),
    },
    {
      header: "Status",
      render: (row) => (
        Number(row.quantity || 0) <= Number(row.minStock || 0)
          ? <Badge tone="warning">Low Stock</Badge>
          : <Badge tone="success">In Stock</Badge>
      ),
    },
    { header: "Location", accessor: (row) => row.location },
  ],
  detailFields: (record, app) => [
    { label: "Item Code", value: record.code },
    { label: "Item Name", value: record.name },
    { label: "Category", value: record.category },
    { label: "Unit", value: record.unit },
    { label: "Stock Quantity", value: formatNumber(record.quantity) },
    { label: "Low Stock Threshold", value: formatNumber(record.minStock) },
    { label: "Supplier", value: resolveSupplierName(app, record.supplierId) },
    { label: "Location", value: record.location },
    { label: "Condition", value: record.condition },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => (Number(record.quantity || 0) <= Number(record.minStock || 0) ? <Badge tone="warning">Low Stock</Badge> : <Badge tone="success">In Stock</Badge>),
};

export const assignConfig = {
  collection: "assignments",
  basePath: "/assign-items",
  singularLabel: "Assign Item Record",
  pluralLabel: "Assign Items",
  description: "Track item assignments to departments, classrooms, and teachers.",
  listLabel: "Assign List",
  printable: true,
  searchFields: ["assignNumber", "assigneeName", "assigneeType", "status"],
  filters: [
    { name: "status", key: "status", label: "Status", options: ASSIGN_STATUS_OPTIONS },
    { name: "assigneeType", key: "assigneeType", label: "Assigned To", options: ASSIGN_TO_TYPES },
  ],
  sortOptions: [
    { value: "date-desc", label: "Newest First", compare: (a, b) => new Date(b.assignedDate) - new Date(a.assignedDate) },
    { value: "date-asc", label: "Oldest First", compare: (a, b) => new Date(a.assignedDate) - new Date(b.assignedDate) },
  ],
  fields: [
    { name: "assignNumber", label: "Assign Number", type: "text", required: true, placeholder: "ASN-001" },
    { name: "itemId", label: "Item", type: "select", required: true, options: (app) => (app.appData.inventory || []).map((item) => ({ value: item.id, label: `${item.code} • ${item.name}` })) },
    { name: "quantity", label: "Quantity", type: "number", required: true, min: 1, helperText: "Stock will be deducted when saved." },
    { name: "assigneeType", label: "Assign To", type: "select", required: true, options: ASSIGN_TO_TYPES },
    { name: "assigneeName", label: "Department / Classroom / Teacher", type: "text", required: true, placeholder: "Administration / Class 7A / Mr. Dara" },
    { name: "assigneeId", label: "Reference ID", type: "text", helperText: "Optional reference code for the assigned place or person." },
    { name: "assignedDate", label: "Assigned Date", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ASSIGN_STATUS_OPTIONS },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record, app) => ({
    assignNumber: record?.assignNumber || `ASN-${String((app.appData.assignments?.length || 0) + 1).padStart(3, "0")}`,
    itemId: record?.itemId || "",
    quantity: record?.quantity ?? 1,
    assigneeType: record?.assigneeType || "Department",
    assigneeName: record?.assigneeName || "",
    assigneeId: record?.assigneeId || "",
    assignedDate: record?.assignedDate || new Date().toISOString().slice(0, 10),
    status: record?.status || "Pending",
    notes: record?.notes || "",
  }),
  validate: (values, app, record) => {
    const errors = {};
    const stock = app.findById("inventory", values.itemId);
    const available = Number(stock?.quantity || 0) + Number(record?.quantity || 0);
    if (Number(values.quantity) > available) {
      errors.quantity = "Quantity exceeds available stock.";
    }
    return errors;
  },
  save: (values, record, app) => app.saveAssignment(values, record?.id),
  remove: (id, app) => app.removeAssignment(id),
  itemLabel: (record, app) => `${record.assignNumber} • ${record.assigneeName}`,
  summaryCards: (records) => [
    { label: "Assign Records", value: records.length, icon: ClipboardList, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Assigned Qty", value: formatNumber(records.reduce((sum, item) => sum + Number(item.quantity || 0), 0)), icon: Package, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: records.filter((item) => item.status === "Pending").length, icon: Warehouse, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Returned", value: records.filter((item) => item.status === "Returned").length, icon: RotateCcw, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "Number", accessor: (row) => row.assignNumber },
    { header: "Item", accessor: (row, app) => resolveItemName(app, row.itemId) },
    { header: "Assigned To", accessor: (row) => row.assigneeName },
    { header: "Type", accessor: (row) => row.assigneeType },
    { header: "Quantity", accessor: (row) => formatNumber(row.quantity) },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record, app) => [
    { label: "Assign Number", value: record.assignNumber },
    { label: "Item", value: resolveItemName(app, record.itemId) },
    { label: "Quantity", value: formatNumber(record.quantity) },
    { label: "Assign To", value: record.assigneeType },
    { label: "Assigned Target", value: record.assigneeName },
    { label: "Reference ID", value: record.assigneeId || "-" },
    { label: "Assigned Date", value: formatDate(record.assignedDate) },
    { label: "Status", value: record.status },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const departmentConfig = {
  collection: "departments",
  basePath: "/departments",
  singularLabel: "Department",
  pluralLabel: "Departments",
  description: "Manage departments, room locations, heads, and assigned item summaries.",
  listLabel: "Department List",
  searchFields: ["name", "head", "room", "location"],
  filters: [{ name: "status", key: "status", label: "Status", options: RECORD_STATUS_OPTIONS }],
  sortOptions: [{ value: "name", label: "Name A-Z", compare: (a, b) => a.name.localeCompare(b.name) }],
  fields: [
    { name: "name", label: "Department Name", type: "text", required: true },
    { name: "head", label: "Department Head", type: "text", required: true },
    { name: "room", label: "Room / Location Code", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: RECORD_STATUS_OPTIONS },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record) => ({
    name: record?.name || "",
    head: record?.head || "",
    room: record?.room || "",
    location: record?.location || "",
    status: record?.status || "Active",
    notes: record?.notes || "",
  }),
  save: (values, record, app) => app.saveDepartment(values, record?.id),
  remove: (id, app) => app.removeDepartment(id),
  itemLabel: (record) => record.name,
  summaryCards: (records) => [
    { label: "Departments", value: records.length, icon: Users, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Active", value: records.filter((item) => item.status === "Active").length, icon: Landmark, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Inactive", value: records.filter((item) => item.status === "Inactive").length, icon: Warehouse, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Rooms", value: new Set(records.map((item) => item.room).filter(Boolean)).size, icon: FileText, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "Department", accessor: (row) => row.name },
    { header: "Head", accessor: (row) => row.head },
    { header: "Room", accessor: (row) => row.room },
    { header: "Location", accessor: (row) => row.location },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record) => [
    { label: "Department Name", value: record.name },
    { label: "Department Head", value: record.head },
    { label: "Room / Location Code", value: record.room },
    { label: "Location", value: record.location },
    { label: "Status", value: record.status },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const supplierConfig = {
  collection: "suppliers",
  basePath: "/suppliers",
  singularLabel: "Supplier",
  pluralLabel: "Suppliers",
  description: "Maintain supplier contact details and active status.",
  listLabel: "Supplier List",
  searchFields: ["name", "contactName", "email", "phone", "address"],
  filters: [{ name: "status", key: "status", label: "Status", options: RECORD_STATUS_OPTIONS }],
  sortOptions: [{ value: "name", label: "Name A-Z", compare: (a, b) => a.name.localeCompare(b.name) }],
  fields: [
    { name: "name", label: "Supplier Name", type: "text", required: true },
    { name: "contactName", label: "Contact Person", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "address", label: "Address", type: "text", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: RECORD_STATUS_OPTIONS },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record) => ({
    name: record?.name || "",
    contactName: record?.contactName || "",
    email: record?.email || "",
    phone: record?.phone || "",
    address: record?.address || "",
    status: record?.status || "Active",
    notes: record?.notes || "",
  }),
  save: (values, record, app) => app.saveSupplier(values, record?.id),
  remove: (id, app) => app.removeSupplier(id),
  itemLabel: (record) => record.name,
  summaryCards: (records) => [
    { label: "Suppliers", value: records.length, icon: Truck, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Active", value: records.filter((item) => item.status === "Active").length, icon: Landmark, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Inactive", value: records.filter((item) => item.status === "Inactive").length, icon: Warehouse, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Contacts", value: records.filter((item) => item.email).length, icon: FileText, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "Supplier", accessor: (row) => row.name },
    { header: "Contact", accessor: (row) => row.contactName },
    { header: "Email", accessor: (row) => row.email },
    { header: "Phone", accessor: (row) => row.phone },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record) => [
    { label: "Supplier Name", value: record.name },
    { label: "Contact Person", value: record.contactName },
    { label: "Email", value: record.email },
    { label: "Phone", value: record.phone },
    { label: "Address", value: record.address },
    { label: "Status", value: record.status },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const purchaseOrderConfig = {
  collection: "purchaseOrders",
  basePath: "/purchase-orders",
  singularLabel: "Purchase Order",
  pluralLabel: "Purchase Orders",
  description: "Create and monitor purchase orders for school inventory receiving.",
  listLabel: "Purchase Order List",
  searchFields: ["poNumber", "status"],
  filters: [{ name: "status", key: "status", label: "Status", options: ORDER_STATUS_OPTIONS }],
  sortOptions: [{ value: "date-desc", label: "Newest First", compare: (a, b) => new Date(b.orderDate) - new Date(a.orderDate) }],
  fields: [
    { name: "poNumber", label: "PO Number", type: "text", required: true },
    { name: "supplierId", label: "Supplier", type: "select", required: true, options: (app) => (app.appData.suppliers || []).map((supplier) => ({ value: supplier.id, label: supplier.name })) },
    { name: "orderDate", label: "Order Date", type: "date", required: true },
    { name: "expectedDate", label: "Expected Date", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: ORDER_STATUS_OPTIONS },
    { name: "totalItems", label: "Total Items", type: "number", required: true, min: 0 },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record, app) => ({
    poNumber: record?.poNumber || `PO-${new Date().getFullYear()}-${String((app.appData.purchaseOrders?.length || 0) + 1).padStart(3, "0")}`,
    supplierId: record?.supplierId || "",
    orderDate: record?.orderDate || new Date().toISOString().slice(0, 10),
    expectedDate: record?.expectedDate || new Date().toISOString().slice(0, 10),
    status: record?.status || "Draft",
    totalItems: record?.totalItems ?? 0,
    notes: record?.notes || "",
  }),
  save: (values, record, app) => app.savePurchaseOrder(values, record?.id),
  remove: (id, app) => app.removePurchaseOrder(id),
  itemLabel: (record, app) => `${record.poNumber} • ${resolveSupplierName(app, record.supplierId)}`,
  summaryCards: (records) => [
    { label: "POs", value: records.length, icon: FileText, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Approved", value: records.filter((item) => item.status === "Approved").length, icon: Landmark, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: records.filter((item) => ["Draft", "Sent"].includes(item.status)).length, icon: Warehouse, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Items", value: formatNumber(records.reduce((sum, item) => sum + Number(item.totalItems || 0), 0)), icon: Package, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "PO Number", accessor: (row) => row.poNumber },
    { header: "Supplier", accessor: (row, app) => resolveSupplierName(app, row.supplierId) },
    { header: "Order Date", accessor: (row) => formatDate(row.orderDate) },
    { header: "Expected", accessor: (row) => formatDate(row.expectedDate) },
    { header: "Items", accessor: (row) => formatNumber(row.totalItems) },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record, app) => [
    { label: "PO Number", value: record.poNumber },
    { label: "Supplier", value: resolveSupplierName(app, record.supplierId) },
    { label: "Order Date", value: formatDate(record.orderDate) },
    { label: "Expected Date", value: formatDate(record.expectedDate) },
    { label: "Status", value: record.status },
    { label: "Total Items", value: formatNumber(record.totalItems) },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const receivingConfig = {
  collection: "receiving",
  basePath: "/receiving",
  singularLabel: "Receiving Record",
  pluralLabel: "Receiving",
  description: "Record stock that has been received directly or through purchase orders.",
  listLabel: "Receiving List",
  searchFields: ["receiveNumber", "receiverName", "status"],
  filters: [{ name: "status", key: "status", label: "Status", options: RECEIVING_STATUS_OPTIONS }],
  sortOptions: [{ value: "date-desc", label: "Newest First", compare: (a, b) => new Date(b.dateReceived) - new Date(a.dateReceived) }],
  fields: [
    { name: "receiveNumber", label: "Receiving Number", type: "text", required: true },
    { name: "poId", label: "Related Purchase Order", type: "select", required: true, options: (app) => (app.appData.purchaseOrders || []).map((po) => ({ value: po.id, label: po.poNumber })) },
    { name: "itemId", label: "Item", type: "select", required: true, options: (app) => (app.appData.inventory || []).map((item) => ({ value: item.id, label: `${item.code} • ${item.name}` })) },
    { name: "quantity", label: "Received Quantity", type: "number", required: true, min: 1 },
    { name: "receiverName", label: "Receiver Name", type: "text", required: true },
    { name: "dateReceived", label: "Date Received", type: "date", required: true },
    { name: "status", label: "Status", type: "select", required: true, options: RECEIVING_STATUS_OPTIONS },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record, app) => ({
    receiveNumber: record?.receiveNumber || `RCV-${String((app.appData.receiving?.length || 0) + 1).padStart(3, "0")}`,
    poId: record?.poId || "",
    itemId: record?.itemId || "",
    quantity: record?.quantity ?? 1,
    receiverName: record?.receiverName || "",
    dateReceived: record?.dateReceived || new Date().toISOString().slice(0, 10),
    status: record?.status || "Pending",
    notes: record?.notes || "",
  }),
  validate: (values, app) => {
    const errors = {};
    if (!app.findById("purchaseOrders", values.poId)) {
      errors.poId = "Please choose a valid purchase order.";
    }
    const item = app.findById("inventory", values.itemId);
    if (!item) {
      errors.itemId = "Please choose a valid item.";
    }
    return errors;
  },
  save: (values, record, app) => app.saveReceiving(values, record?.id),
  remove: (id, app) => app.removeReceiving(id),
  itemLabel: (record, app) => `${record.receiveNumber} • ${resolveItemName(app, record.itemId)}`,
  summaryCards: (records) => [
    { label: "Receiving", value: records.length, icon: Warehouse, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Received Qty", value: formatNumber(records.reduce((sum, item) => sum + Number(item.quantity || 0), 0)), icon: Package, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: records.filter((item) => item.status === "Pending").length, icon: Landmark, toneClass: "bg-amber-50 text-amber-600" },
    { label: "PO Links", value: new Set(records.map((item) => item.poId).filter(Boolean)).size, icon: FileText, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "Receiving No.", accessor: (row) => row.receiveNumber },
    { header: "PO", accessor: (row, app) => resolveOrderName(app, row.poId) },
    { header: "Item", accessor: (row, app) => resolveItemName(app, row.itemId) },
    { header: "Quantity", accessor: (row) => formatNumber(row.quantity) },
    { header: "Receiver", accessor: (row) => row.receiverName },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record, app) => [
    { label: "Receiving Number", value: record.receiveNumber },
    { label: "Purchase Order", value: resolveOrderName(app, record.poId) },
    { label: "Item", value: resolveItemName(app, record.itemId) },
    { label: "Quantity", value: formatNumber(record.quantity) },
    { label: "Receiver Name", value: record.receiverName },
    { label: "Date Received", value: formatDate(record.dateReceived) },
    { label: "Status", value: record.status },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const returnConfig = {
  collection: "returns",
  basePath: "/returns",
  singularLabel: "Return Record",
  pluralLabel: "Returns",
  description: "Track items returned to stock and their condition.",
  listLabel: "Return List",
  searchFields: ["returnNumber", "returnReason", "receivedBy"],
  filters: [{ name: "condition", key: "condition", label: "Condition", options: RETURN_CONDITION_OPTIONS }],
  sortOptions: [{ value: "date-desc", label: "Newest First", compare: (a, b) => new Date(b.dateReturned) - new Date(a.dateReturned) }],
  fields: [
    { name: "returnNumber", label: "Return Number", type: "text", required: true },
    { name: "itemId", label: "Related Item", type: "select", required: true, options: (app) => (app.appData.inventory || []).map((item) => ({ value: item.id, label: `${item.code} • ${item.name}` })) },
    { name: "quantity", label: "Quantity Returned", type: "number", required: true, min: 1 },
    { name: "returnReason", label: "Return Reason", type: "textarea", required: true, fullWidth: true },
    { name: "condition", label: "Condition", type: "select", required: true, options: RETURN_CONDITION_OPTIONS },
    { name: "dateReturned", label: "Date Returned", type: "date", required: true },
    { name: "receivedBy", label: "Received By", type: "text", required: true },
    { name: "notes", label: "Notes", type: "textarea", fullWidth: true },
  ],
  getInitialValues: (record, app) => ({
    returnNumber: record?.returnNumber || `RTN-${String((app.appData.returns?.length || 0) + 1).padStart(3, "0")}`,
    itemId: record?.itemId || "",
    quantity: record?.quantity ?? 1,
    returnReason: record?.returnReason || "",
    condition: record?.condition || "Good",
    dateReturned: record?.dateReturned || new Date().toISOString().slice(0, 10),
    receivedBy: record?.receivedBy || "",
    notes: record?.notes || "",
  }),
  validate: (values, app) => {
    const errors = {};
    if (!app.findById("inventory", values.itemId)) {
      errors.itemId = "Please choose a valid item.";
    }
    return errors;
  },
  save: (values, record, app) => app.saveReturn(values, record?.id),
  remove: (id, app) => app.removeReturn(id),
  itemLabel: (record, app) => `${record.returnNumber} • ${resolveItemName(app, record.itemId)}`,
  summaryCards: (records) => [
    { label: "Returns", value: records.length, icon: RotateCcw, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Returned Qty", value: formatNumber(records.reduce((sum, item) => sum + Number(item.quantity || 0), 0)), icon: Package, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Good", value: records.filter((item) => item.condition === "Good").length, icon: Landmark, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Damaged", value: records.filter((item) => item.condition === "Damaged").length, icon: Warehouse, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    { header: "Return No.", accessor: (row) => row.returnNumber },
    { header: "Item", accessor: (row, app) => resolveItemName(app, row.itemId) },
    { header: "Quantity", accessor: (row) => formatNumber(row.quantity) },
    { header: "Reason", accessor: (row) => row.returnReason },
    { header: "Condition", render: (row) => statusBadge(row.condition) },
  ],
  detailFields: (record, app) => [
    { label: "Return Number", value: record.returnNumber },
    { label: "Item", value: resolveItemName(app, record.itemId) },
    { label: "Quantity", value: formatNumber(record.quantity) },
    { label: "Return Reason", value: record.returnReason },
    { label: "Condition", value: record.condition },
    { label: "Date Returned", value: formatDate(record.dateReturned) },
    { label: "Received By", value: record.receivedBy },
    { label: "Notes", value: record.notes || "-", fullWidth: true },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const userConfig = {
  collection: "users",
  basePath: "/users",
  singularLabel: "User",
  pluralLabel: "Users",
  description: "Manage application users and their access role.",
  listLabel: "User List",
  searchFields: ["fullName", "email", "phone", "role"],
  filters: [{ name: "role", key: "role", label: "Role", options: USER_ROLE_OPTIONS }],
  sortOptions: [{ value: "name", label: "Name A-Z", compare: (a, b) => a.fullName.localeCompare(b.fullName) }],
  fields: [
    { name: "fullName", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Phone", type: "text", required: true },
    { name: "role", label: "Role", type: "select", required: true, options: USER_ROLE_OPTIONS },
    { name: "status", label: "Status", type: "select", required: true, options: RECORD_STATUS_OPTIONS },
    { name: "photo", label: "Profile Photo", type: "file", accept: "image/*", helperText: "Optional image. Use a square photo for best results.", toDataUrl: fileToDataUrl },
    { name: "password", label: "Password", type: "text", required: true, helperText: "Used for fake login only." },
  ],
  getInitialValues: (record, app) => ({
    fullName: record?.fullName || "",
    email: record?.email || "",
    phone: record?.phone || "",
    role: record?.role || "Teacher",
    status: record?.status || "Active",
    photo: record?.photo || "",
    password: record?.password || "",
  }),
  save: (values, record, app) => app.saveUser(values, record?.id),
  remove: (id, app) => app.removeUser(id),
  itemLabel: (record) => record.fullName,
  summaryCards: (records) => [
    { label: "Users", value: records.length, icon: UserCog, toneClass: "bg-blue-50 text-blue-600" },
    { label: "Active", value: records.filter((item) => item.status === "Active").length, icon: Landmark, toneClass: "bg-emerald-50 text-emerald-600" },
    { label: "Teachers", value: records.filter((item) => item.role === "Teacher").length, icon: Users, toneClass: "bg-amber-50 text-amber-600" },
    { label: "Admins", value: records.filter((item) => item.role === "Admin").length, icon: FileText, toneClass: "bg-violet-50 text-violet-600" },
  ],
  columns: [
    {
      header: "User",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.photo || createAvatarDataUrl(initials(row.fullName))} alt="" className="h-10 w-10 rounded-full object-cover" />
          <div>
            <div className="font-semibold text-slate-900">{row.fullName}</div>
            <div className="text-xs text-slate-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    { header: "Role", accessor: (row) => row.role },
    { header: "Phone", accessor: (row) => row.phone },
    { header: "Status", render: (row) => statusBadge(row.status) },
  ],
  detailFields: (record) => [
    { label: "Full Name", value: record.fullName },
    { label: "Email", value: record.email },
    { label: "Phone", value: record.phone },
    { label: "Role", value: record.role },
    { label: "Status", value: record.status },
    { label: "Password", value: "••••••••" },
  ],
  statusBadge: (record) => statusBadge(record.status),
};

export const reportConfigs = {
  stock: {
    title: "Stock Report",
    description: "Overview of stock levels, item categories, and available balance.",
    getDefaultFilters: () => ({
      from: "",
      to: "",
      category: "",
    }),
    filterFields: [
      { name: "from", label: "From", type: "date" },
      { name: "to", label: "To", type: "date" },
      { name: "category", label: "Category", type: "select", options: ITEM_CATEGORIES },
    ],
    buildRows: (app, filters) => {
      let rows = [...(app.appData.inventory || [])];
      rows = applyDateRange(rows, filters.from, filters.to, (row) => row.updatedAt || row.createdAt);
      if (filters.category) rows = rows.filter((row) => row.category === filters.category);
      return rows.map((row) => ({
        id: row.id,
        date: row.updatedAt || row.createdAt,
        item: row.name,
        code: row.code,
        category: row.category,
        quantity: formatNumber(row.quantity),
        minStock: formatNumber(row.minStock),
        status: Number(row.quantity || 0) <= Number(row.minStock || 0) ? "Low Stock" : "In Stock",
      }));
    },
    summaryCards: (app, filters, rows) => [
      { label: "Items", value: app.summary.totalItems },
      { label: "Balance", value: formatNumber(app.summary.stockBalance) },
      { label: "Low Stock", value: app.summary.lowStockCount },
      { label: "Filtered Rows", value: rows.length },
    ],
    columns: [
      { header: "Code", accessor: (row) => row.code },
      { header: "Item", accessor: (row) => row.item },
      { header: "Category", accessor: (row) => row.category },
      { header: "Quantity", accessor: (row) => row.quantity },
      { header: "Min Stock", accessor: (row) => row.minStock },
      { header: "Status", accessor: (row) => row.status },
    ],
  },
  assign: {
    title: "Assign Report",
    description: "Assignment summary by item and assignee.",
    getDefaultFilters: () => ({ from: "", to: "", type: "", status: "" }),
    filterFields: [
      { name: "from", label: "From", type: "date" },
      { name: "to", label: "To", type: "date" },
      { name: "status", label: "Status", type: "select", options: ASSIGN_STATUS_OPTIONS },
      { name: "type", label: "Assigned To", type: "select", options: ASSIGN_TO_TYPES },
    ],
    buildRows: (app, filters) => {
      let rows = [...(app.appData.assignments || [])];
      rows = applyDateRange(rows, filters.from, filters.to, (row) => row.assignedDate);
      if (filters.status) rows = rows.filter((row) => row.status === filters.status);
      if (filters.type) rows = rows.filter((row) => row.assigneeType === filters.type);
      return rows.map((row) => ({
        id: row.id,
        date: row.assignedDate,
        number: row.assignNumber,
        item: app.getItemName(row.itemId),
        assignee: row.assigneeName,
        type: row.assigneeType,
        quantity: formatNumber(row.quantity),
        status: row.status,
      }));
    },
    summaryCards: (app, filters, rows) => [
      { label: "Records", value: app.appData.assignments.length },
      { label: "Assigned Qty", value: formatNumber(app.summary.totalAssigned) },
      { label: "Filtered", value: rows.length },
      { label: "Pending", value: app.appData.assignments.filter((item) => item.status === "Pending").length },
    ],
    columns: [
      { header: "No.", accessor: (row) => row.number },
      { header: "Item", accessor: (row) => row.item },
      { header: "Assignee", accessor: (row) => row.assignee },
      { header: "Type", accessor: (row) => row.type },
      { header: "Quantity", accessor: (row) => row.quantity },
      { header: "Status", accessor: (row) => row.status },
    ],
  },
  lowStock: {
    title: "Low Stock Report",
    description: "Items that are at or below the minimum stock threshold.",
    getDefaultFilters: () => ({ from: "", to: "", category: "" }),
    filterFields: [
      { name: "from", label: "From", type: "date" },
      { name: "to", label: "To", type: "date" },
      { name: "category", label: "Category", type: "select", options: ITEM_CATEGORIES },
    ],
    buildRows: (app, filters) => {
      let rows = (app.appData.inventory || []).filter((row) => Number(row.quantity || 0) <= Number(row.minStock || 0));
      rows = applyDateRange(rows, filters.from, filters.to, (row) => row.updatedAt || row.createdAt);
      if (filters.category) rows = rows.filter((row) => row.category === filters.category);
      return rows.map((row) => ({
        id: row.id,
        date: row.updatedAt || row.createdAt,
        code: row.code,
        item: row.name,
        category: row.category,
        quantity: formatNumber(row.quantity),
        minStock: formatNumber(row.minStock),
        supplier: app.getSupplierName(row.supplierId),
      }));
    },
    summaryCards: (app, filters, rows) => [
      { label: "Low Stock Items", value: rows.length },
      { label: "Stock Balance", value: formatNumber(app.summary.stockBalance) },
      { label: "Suppliers", value: new Set(rows.map((row) => row.supplier)).size },
      { label: "Threshold Hits", value: rows.filter((row) => Number(row.quantity) <= Number(row.minStock)).length },
    ],
    columns: [
      { header: "Code", accessor: (row) => row.code },
      { header: "Item", accessor: (row) => row.item },
      { header: "Category", accessor: (row) => row.category },
      { header: "Quantity", accessor: (row) => row.quantity },
      { header: "Min Stock", accessor: (row) => row.minStock },
      { header: "Supplier", accessor: (row) => row.supplier },
    ],
  },
  movement: {
    title: "Item Movement Report",
    description: "Recent stock in, item assignment, and return movement.",
    getDefaultFilters: () => ({ from: "", to: "" }),
    filterFields: [
      { name: "from", label: "From", type: "date" },
      { name: "to", label: "To", type: "date" },
    ],
    buildRows: (app, filters) => {
      const all = [
        ...(app.appData.receiving || []).map((row) => ({
          id: row.id,
          date: row.dateReceived,
          type: "Stock In",
          reference: row.receiveNumber,
          item: app.getItemName(row.itemId),
          quantity: formatNumber(row.quantity),
          person: row.receiverName,
        })),
        ...(app.appData.assignments || []).map((row) => ({
          id: row.id,
          date: row.assignedDate,
          type: "Assign Item",
          reference: row.assignNumber,
          item: app.getItemName(row.itemId),
          quantity: formatNumber(row.quantity),
          person: row.assigneeName,
        })),
        ...(app.appData.returns || []).map((row) => ({
          id: row.id,
          date: row.dateReturned,
          type: "Return",
          reference: row.returnNumber,
          item: app.getItemName(row.itemId),
          quantity: formatNumber(row.quantity),
          person: row.receivedBy,
        })),
      ]
      .filter((row) => withinDateRange(row.date, filters.from, filters.to))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
      return all;
    },
    summaryCards: (app, filters, rows) => [
      { label: "Movements", value: rows.length },
      { label: "Stock In", value: app.summary.totalStockIn },
      { label: "Assign Item", value: app.summary.totalAssigned },
      { label: "Returns", value: app.appData.returns.length },
    ],
    columns: [
      { header: "Date", accessor: (row) => formatDate(row.date) },
      { header: "Type", accessor: (row) => row.type },
      { header: "Reference", accessor: (row) => row.reference },
      { header: "Item", accessor: (row) => row.item },
      { header: "Quantity", accessor: (row) => row.quantity },
      { header: "Person", accessor: (row) => row.person },
    ],
  },
};
