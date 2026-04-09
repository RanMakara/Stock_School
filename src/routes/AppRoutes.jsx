import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import InventoryList from "../pages/Inventory/InventoryList";
import InventoryForm from "../pages/Inventory/InventoryForm";
import InventoryDetail from "../pages/Inventory/InventoryDetail";
import AssignList from "../pages/AssignItem/AssignList";
import AssignForm from "../pages/AssignItem/AssignForm";
import AssignDetail from "../pages/AssignItem/AssignDetail";
import DepartmentList from "../pages/Departments/DepartmentList";
import DepartmentForm from "../pages/Departments/DepartmentForm";
import DepartmentDetail from "../pages/Departments/DepartmentDetail";
import SupplierList from "../pages/Suppliers/SupplierList";
import SupplierForm from "../pages/Suppliers/SupplierForm";
import SupplierDetail from "../pages/Suppliers/SupplierDetail";
import PurchaseOrderList from "../pages/PurchaseOrders/PurchaseOrderList";
import PurchaseOrderForm from "../pages/PurchaseOrders/PurchaseOrderForm";
import PurchaseOrderDetail from "../pages/PurchaseOrders/PurchaseOrderDetail";
import ReceivingList from "../pages/Receiving/ReceivingList";
import ReceivingForm from "../pages/Receiving/ReceivingForm";
import ReceivingDetail from "../pages/Receiving/ReceivingDetail";
import ReturnList from "../pages/Returns/ReturnList";
import ReturnForm from "../pages/Returns/ReturnForm";
import ReturnDetail from "../pages/Returns/ReturnDetail";
import StockReport from "../pages/Reports/StockReport";
import AssignReport from "../pages/Reports/AssignReport";
import LowStockReport from "../pages/Reports/LowStockReport";
import ItemMovementReport from "../pages/Reports/ItemMovementReport";
import UserList from "../pages/Users/UserList";
import UserForm from "../pages/Users/UserForm";
import UserDetail from "../pages/Users/UserDetail";
import ProfileView from "../pages/Profile/ProfileView";
import ProfileEdit from "../pages/Profile/ProfileEdit";
import ChangePassword from "../pages/Profile/ChangePassword";
import SystemSettings from "../pages/Settings/SystemSettings";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="inventory">
          <Route index element={<InventoryList />} />
          <Route path="new" element={<InventoryForm />} />
          <Route path=":id" element={<InventoryDetail />} />
          <Route path=":id/edit" element={<InventoryForm />} />
        </Route>

        <Route path="assign-items">
          <Route index element={<AssignList />} />
          <Route path="new" element={<AssignForm />} />
          <Route path=":id" element={<AssignDetail />} />
          <Route path=":id/edit" element={<AssignForm />} />
        </Route>

        <Route path="departments">
          <Route index element={<DepartmentList />} />
          <Route path="new" element={<DepartmentForm />} />
          <Route path=":id" element={<DepartmentDetail />} />
          <Route path=":id/edit" element={<DepartmentForm />} />
        </Route>

        <Route path="suppliers">
          <Route index element={<SupplierList />} />
          <Route path="new" element={<SupplierForm />} />
          <Route path=":id" element={<SupplierDetail />} />
          <Route path=":id/edit" element={<SupplierForm />} />
        </Route>

        <Route path="purchase-orders">
          <Route index element={<PurchaseOrderList />} />
          <Route path="new" element={<PurchaseOrderForm />} />
          <Route path=":id" element={<PurchaseOrderDetail />} />
          <Route path=":id/edit" element={<PurchaseOrderForm />} />
        </Route>

        <Route path="receiving">
          <Route index element={<ReceivingList />} />
          <Route path="new" element={<ReceivingForm />} />
          <Route path=":id" element={<ReceivingDetail />} />
          <Route path=":id/edit" element={<ReceivingForm />} />
        </Route>

        <Route path="returns">
          <Route index element={<ReturnList />} />
          <Route path="new" element={<ReturnForm />} />
          <Route path=":id" element={<ReturnDetail />} />
          <Route path=":id/edit" element={<ReturnForm />} />
        </Route>

        <Route path="reports">
          <Route path="stock" element={<StockReport />} />
          <Route path="assign" element={<AssignReport />} />
          <Route path="low-stock" element={<LowStockReport />} />
          <Route path="movement" element={<ItemMovementReport />} />
          <Route index element={<Navigate to="stock" replace />} />
        </Route>

        <Route path="users">
          <Route index element={<UserList />} />
          <Route path="new" element={<UserForm />} />
          <Route path=":id" element={<UserDetail />} />
          <Route path=":id/edit" element={<UserForm />} />
        </Route>

        <Route path="profile" element={<ProfileView />} />
        <Route path="profile/edit" element={<ProfileEdit />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="settings" element={<SystemSettings />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
