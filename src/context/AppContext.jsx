import { createContext, useContext, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { createSeedData } from "../services/mockApi";
import { generateId, formatNumber, createAvatarDataUrl } from "../utils/helpers";

const AppContext = createContext(null);

function upsertById(collection, record) {
  const index = collection.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    const next = [...collection];
    next[index] = record;
    return next;
  }
  return [record, ...collection];
}

function removeById(collection, id) {
  return collection.filter((item) => item.id !== id);
}

function resolveNextInventory(inventory, itemId, delta) {
  return inventory.map((item) => {
    if (item.id !== itemId) return item;
    const quantity = Math.max(0, Number(item.quantity || 0) + Number(delta || 0));
    return { ...item, quantity, updatedAt: new Date().toISOString() };
  });
}

function addActivity(activities, activity) {
  return [activity, ...activities].slice(0, 50);
}

function buildActivity(title, description, type, module) {
  return {
    id: generateId("act"),
    title,
    description,
    type,
    module,
    date: new Date().toISOString(),
  };
}

export function AppProvider({ children }) {
  const [appData, setAppData] = useLocalStorage("school_stock_app_state", createSeedData);

  const app = useMemo(() => {
    const findById = (collection, id) => appData?.[collection]?.find((item) => item.id === id);

    const getItemName = (id) => findById("inventory", id)?.name || "-";
    const getDepartmentName = (id) => findById("departments", id)?.name || "-";
    const getSupplierName = (id) => findById("suppliers", id)?.name || "-";
    const getUserName = (id) => findById("users", id)?.fullName || "-";
    const getOrderName = (id) => findById("purchaseOrders", id)?.poNumber || "-";

    const updateSystem = (values) => {
      setAppData((prev) => ({
        ...prev,
        system: {
          ...(prev.system || {}),
          ...values,
          updatedAt: new Date().toISOString(),
        },
        settings: {
          ...(prev.settings || {}),
          ...values,
        },
        activities: addActivity(prev.activities || [], buildActivity(
          "System settings updated",
          "System name or logo was changed from Settings.",
          "Settings",
          "Settings"
        )),
      }));
    };

    const updateProfile = (values) => {
      setAppData((prev) => ({
        ...prev,
        profile: {
          ...(prev.profile || {}),
          ...values,
          updatedAt: new Date().toISOString(),
        },
      }));
    };

    const changePassword = (currentPassword, newPassword) => {
      const profile = appData.profile || {};
      if (String(profile.password || "") !== String(currentPassword || "")) {
        return { ok: false, message: "Current password is incorrect." };
      }
      setAppData((prev) => ({
        ...prev,
        profile: {
          ...(prev.profile || {}),
          password: newPassword,
          updatedAt: new Date().toISOString(),
        },
      }));
      return { ok: true };
    };

    const saveInventory = (values, existingId) => {
      const id = existingId || generateId("item");
      const existing = findById("inventory", id);
      const record = {
        id,
        code: values.code,
        name: values.name,
        category: values.category,
        unit: values.unit,
        quantity: Number(values.quantity || 0),
        minStock: Number(values.minStock || 0),
        supplierId: values.supplierId,
        location: values.location,
        condition: values.condition,
        image: values.image || "",
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppData((prev) => ({
        ...prev,
        inventory: upsertById(prev.inventory || [], record),
        activities: addActivity(prev.activities || [], buildActivity(
          existing ? "Inventory item updated" : "Inventory item added",
          `${record.name} was ${existing ? "updated" : "added"} in inventory.`,
          "Inventory",
          "Inventory"
        )),
      }));
      return record;
    };

    const removeInventory = (id) => {
      const target = findById("inventory", id);
      setAppData((prev) => ({
        ...prev,
        inventory: removeById(prev.inventory || [], id),
        activities: addActivity(prev.activities || [], buildActivity(
          "Inventory item deleted",
          `${target?.name || "An item"} was removed from inventory.`,
          "Inventory",
          "Inventory"
        )),
      }));
    };

    const saveDepartment = (values, existingId) => {
      const id = existingId || generateId("dep");
      const existing = findById("departments", id);
      const record = {
        id,
        name: values.name,
        head: values.head,
        room: values.room,
        location: values.location,
        status: values.status,
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppData((prev) => ({
        ...prev,
        departments: upsertById(prev.departments || [], record),
      }));
      return record;
    };

    const removeDepartment = (id) => {
      setAppData((prev) => ({ ...prev, departments: removeById(prev.departments || [], id) }));
    };

    const saveSupplier = (values, existingId) => {
      const id = existingId || generateId("sup");
      const existing = findById("suppliers", id);
      const record = {
        id,
        name: values.name,
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        status: values.status,
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppData((prev) => ({
        ...prev,
        suppliers: upsertById(prev.suppliers || [], record),
      }));
      return record;
    };

    const removeSupplier = (id) => {
      setAppData((prev) => ({ ...prev, suppliers: removeById(prev.suppliers || [], id) }));
    };

    const savePurchaseOrder = (values, existingId) => {
      const id = existingId || generateId("po");
      const existing = findById("purchaseOrders", id);
      const record = {
        id,
        poNumber: values.poNumber,
        supplierId: values.supplierId,
        orderDate: values.orderDate,
        expectedDate: values.expectedDate,
        status: values.status,
        totalItems: Number(values.totalItems || 0),
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppData((prev) => ({
        ...prev,
        purchaseOrders: upsertById(prev.purchaseOrders || [], record),
      }));
      return record;
    };

    const removePurchaseOrder = (id) => {
      setAppData((prev) => ({ ...prev, purchaseOrders: removeById(prev.purchaseOrders || [], id) }));
    };

    const saveReceiving = (values, existingId) => {
      const id = existingId || generateId("rec");
      const existing = findById("receiving", id);
      const previousQty = Number(existing?.quantity || 0);
      const nextQty = Number(values.quantity || 0);
      const previousItemId = existing?.itemId;
      const nextItemId = values.itemId;

      const record = {
        id,
        receiveNumber: values.receiveNumber,
        poId: values.poId,
        itemId: nextItemId,
        quantity: nextQty,
        receiverName: values.receiverName,
        dateReceived: values.dateReceived,
        status: values.status,
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAppData((prev) => {
        let inventory = [...(prev.inventory || [])];

        if (existing && previousItemId && previousItemId !== nextItemId) {
          inventory = resolveNextInventory(inventory, previousItemId, -previousQty);
          inventory = resolveNextInventory(inventory, nextItemId, nextQty);
        } else {
          const delta = existing ? nextQty - previousQty : nextQty;
          inventory = resolveNextInventory(inventory, nextItemId, delta);
        }

        return {
          ...prev,
          inventory,
          receiving: upsertById(prev.receiving || [], record),
          activities: addActivity(prev.activities || [], buildActivity(
            existing ? "Receiving record updated" : "Stock received",
            `${nextQty} unit(s) of ${getItemName(nextItemId)} were recorded.`,
            "Stock In",
            "Receiving"
          )),
        };
      });
      return record;
    };

    const removeReceiving = (id) => {
      setAppData((prev) => {
        const existing = (prev.receiving || []).find((item) => item.id === id);
        const inventory = existing
          ? resolveNextInventory(prev.inventory || [], existing.itemId, -Number(existing.quantity || 0))
          : prev.inventory || [];
        return {
          ...prev,
          inventory,
          receiving: removeById(prev.receiving || [], id),
        };
      });
    };

    const saveAssignment = (values, existingId) => {
      const id = existingId || generateId("asg");
      const existing = findById("assignments", id);
      const previousQty = Number(existing?.quantity || 0);
      const nextQty = Number(values.quantity || 0);
      const previousItemId = existing?.itemId;
      const nextItemId = values.itemId;

      const record = {
        id,
        assignNumber: values.assignNumber,
        itemId: nextItemId,
        quantity: nextQty,
        assigneeType: values.assigneeType,
        assigneeName: values.assigneeName,
        assigneeId: values.assigneeId,
        assignedDate: values.assignedDate,
        status: values.status,
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAppData((prev) => {
        let inventory = [...(prev.inventory || [])];

        if (existing && previousItemId && previousItemId !== nextItemId) {
          inventory = resolveNextInventory(inventory, previousItemId, previousQty);
          inventory = resolveNextInventory(inventory, nextItemId, -nextQty);
        } else {
          const delta = existing ? previousQty - nextQty : -nextQty;
          inventory = resolveNextInventory(inventory, nextItemId, delta);
        }

        return {
          ...prev,
          inventory,
          assignments: upsertById(prev.assignments || [], record),
          activities: addActivity(prev.activities || [], buildActivity(
            existing ? "Assign record updated" : "Item assigned",
            `${nextQty} unit(s) of ${getItemName(nextItemId)} were ${existing ? "updated" : "assigned"}.`,
            "Assign Item",
            "Assign Item"
          )),
        };
      });
      return record;
    };

    const removeAssignment = (id) => {
      setAppData((prev) => {
        const existing = (prev.assignments || []).find((item) => item.id === id);
        const inventory = existing
          ? resolveNextInventory(prev.inventory || [], existing.itemId, Number(existing.quantity || 0))
          : prev.inventory || [];
        return {
          ...prev,
          inventory,
          assignments: removeById(prev.assignments || [], id),
        };
      });
    };

    const saveReturn = (values, existingId) => {
      const id = existingId || generateId("ret");
      const existing = findById("returns", id);
      const previousQty = Number(existing?.quantity || 0);
      const nextQty = Number(values.quantity || 0);
      const previousItemId = existing?.itemId;
      const nextItemId = values.itemId;

      const record = {
        id,
        returnNumber: values.returnNumber,
        itemId: nextItemId,
        quantity: nextQty,
        returnReason: values.returnReason,
        condition: values.condition,
        dateReturned: values.dateReturned,
        receivedBy: values.receivedBy,
        notes: values.notes || "",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAppData((prev) => {
        let inventory = [...(prev.inventory || [])];

        if (existing && previousItemId && previousItemId !== nextItemId) {
          inventory = resolveNextInventory(inventory, previousItemId, -previousQty);
          inventory = resolveNextInventory(inventory, nextItemId, nextQty);
        } else {
          const delta = existing ? nextQty - previousQty : nextQty;
          inventory = resolveNextInventory(inventory, nextItemId, delta);
        }

        return {
          ...prev,
          inventory,
          returns: upsertById(prev.returns || [], record),
        };
      });
      return record;
    };

    const removeReturn = (id) => {
      setAppData((prev) => {
        const existing = (prev.returns || []).find((item) => item.id === id);
        const inventory = existing
          ? resolveNextInventory(prev.inventory || [], existing.itemId, -Number(existing.quantity || 0))
          : prev.inventory || [];
        return {
          ...prev,
          inventory,
          returns: removeById(prev.returns || [], id),
        };
      });
    };

    const saveUser = (values, existingId) => {
      const id = existingId || generateId("usr");
      const existing = findById("users", id);
      const record = {
        id,
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        role: values.role,
        status: values.status,
        photo: values.photo || createAvatarDataUrl(values.fullName || "US", "#0f172a"),
        password: values.password || existing?.password || "temp1234",
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAppData((prev) => ({
        ...prev,
        users: upsertById(prev.users || [], record),
      }));
      return record;
    };

    const removeUser = (id) => {
      setAppData((prev) => ({ ...prev, users: removeById(prev.users || [], id) }));
    };

    const summary = {
      totalItems: (appData.inventory || []).length,
      totalStockIn: (appData.receiving || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      totalAssigned: (appData.assignments || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
      lowStockCount: (appData.inventory || []).filter((item) => Number(item.quantity || 0) <= Number(item.minStock || 0)).length,
      stockBalance: (appData.inventory || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
    };

    const topCategoryData = (appData.inventory || []).reduce((acc, item) => {
      const existing = acc.find((entry) => entry.name === item.category);
      if (existing) {
        existing.quantity += Number(item.quantity || 0);
        existing.count += 1;
      } else {
        acc.push({ name: item.category, quantity: Number(item.quantity || 0), count: 1 });
      }
      return acc;
    }, []);

    const lowStockItems = (appData.inventory || []).filter((item) => Number(item.quantity || 0) <= Number(item.minStock || 0));
    const recentActivities = (appData.activities || []).slice(0, 8);

    return {
      appData,
      setAppData,
      summary,
      topCategoryData,
      lowStockItems,
      recentActivities,
      findById,
      getItemName,
      getDepartmentName,
      getSupplierName,
      getUserName,
      getOrderName,
      updateSystem,
      updateProfile,
      changePassword,
      saveInventory,
      removeInventory,
      saveDepartment,
      removeDepartment,
      saveSupplier,
      removeSupplier,
      savePurchaseOrder,
      removePurchaseOrder,
      saveReceiving,
      removeReceiving,
      saveAssignment,
      removeAssignment,
      saveReturn,
      removeReturn,
      saveUser,
      removeUser,
      formatNumber,
    };
  }, [appData, setAppData]);

  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
