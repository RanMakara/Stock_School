import { Home, Boxes, UserRound, Users, Warehouse, Truck, ClipboardList, RotateCcw, FileText, Settings, UserCog, BarChart3 } from "lucide-react";

export const STORAGE_KEYS = {
  appState: "school_stock_app_state",
  session: "school_stock_session",
  theme: "school_stock_theme",
};

export const APP_NAME = "School Stock Management";
export const SCHOOL_NAME = "Sunrise International School";

export const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Inventory", path: "/inventory", icon: Boxes },
  { label: "Assign Item", path: "/assign-items", icon: ClipboardList },
  { label: "Departments", path: "/departments", icon: Users },
  { label: "Suppliers", path: "/suppliers", icon: Truck },
  { label: "Purchase Orders", path: "/purchase-orders", icon: FileText },
  { label: "Receiving", path: "/receiving", icon: Warehouse },
  { label: "Returns", path: "/returns", icon: RotateCcw },
  { label: "Reports", path: "/reports/stock", icon: BarChart3 },
  { label: "Users", path: "/users", icon: UserCog },
  { label: "Profile", path: "/profile", icon: UserRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

export const ITEM_CATEGORIES = [
  "Stationery",
  "Furniture",
  "ICT",
  "Lab Equipment",
  "Cleaning",
  "Sports",
  "Library",
  "Office Supplies",
];

export const ASSIGN_TO_TYPES = ["Department", "Classroom", "Teacher"];

export const ORDER_STATUS_OPTIONS = ["Draft", "Sent", "Approved", "Partial", "Received", "Closed"];

export const RECORD_STATUS_OPTIONS = ["Active", "Inactive"];

export const ASSIGN_STATUS_OPTIONS = ["Pending", "Assigned", "Completed", "Returned"];

export const RECEIVING_STATUS_OPTIONS = ["Pending", "Received", "Partially Received"];

export const RETURN_CONDITION_OPTIONS = ["Good", "Fair", "Damaged"];

export const USER_ROLE_OPTIONS = ["Admin", "Storekeeper", "Teacher", "Manager"];

export const THEME_OPTIONS = ["light", "dark"];

export const REPORT_DATE_OPTIONS = [
  "Today",
  "This Week",
  "This Month",
  "This Year",
  "Custom",
];
