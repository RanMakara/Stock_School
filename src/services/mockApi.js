import { createAvatarDataUrl, createLogoDataUrl, generateId } from "../utils/helpers";

const now = new Date().toISOString();

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function makeId(prefix, number) {
  return `${prefix}-${String(number).padStart(3, "0")}`;
}

export function createSeedData() {
  const departments = [
    {
      id: makeId("dep", 1),
      name: "Administration",
      head: "Mrs. Sreynuon",
      room: "A-101",
      location: "Main Building",
      status: "Active",
      notes: "Supports school operations and records.",
      createdAt: daysAgo(45),
      updatedAt: daysAgo(2),
    },
    {
      id: makeId("dep", 2),
      name: "Science",
      head: "Mr. Dara",
      room: "Lab-2",
      location: "Science Block",
      status: "Active",
      notes: "Handles science labs and materials.",
      createdAt: daysAgo(40),
      updatedAt: daysAgo(5),
    },
    {
      id: makeId("dep", 3),
      name: "Library",
      head: "Ms. Vanna",
      room: "L-01",
      location: "Library Wing",
      status: "Active",
      notes: "Manages books and reading materials.",
      createdAt: daysAgo(39),
      updatedAt: daysAgo(4),
    },
    {
      id: makeId("dep", 4),
      name: "Sports",
      head: "Coach Rithy",
      room: "S-03",
      location: "Sports Hall",
      status: "Inactive",
      notes: "Cares for sports equipment and uniforms.",
      createdAt: daysAgo(33),
      updatedAt: daysAgo(8),
    },
  ];

  const suppliers = [
    {
      id: makeId("sup", 1),
      name: "Bright Office Supply",
      contactName: "Mr. Sokha",
      email: "sokha@brightoffice.example",
      phone: "+855 12 345 678",
      address: "Phnom Penh",
      status: "Active",
      notes: "Primary stationery supplier.",
      createdAt: daysAgo(28),
      updatedAt: daysAgo(2),
    },
    {
      id: makeId("sup", 2),
      name: "TechHub Education",
      contactName: "Ms. Lina",
      email: "lina@techhub.example",
      phone: "+855 92 111 222",
      address: "Siem Reap",
      status: "Active",
      notes: "ICT devices and accessories.",
      createdAt: daysAgo(31),
      updatedAt: daysAgo(3),
    },
    {
      id: makeId("sup", 3),
      name: "Campus Works",
      contactName: "Mr. Visal",
      email: "visal@campusworks.example",
      phone: "+855 16 222 333",
      address: "Battambang",
      status: "Inactive",
      notes: "Furniture and maintenance items.",
      createdAt: daysAgo(26),
      updatedAt: daysAgo(6),
    },
  ];

  const inventory = [
    {
      id: makeId("item", 1),
      code: "ITM-001",
      name: "A4 Copy Paper",
      category: "Stationery",
      unit: "Ream",
      quantity: 84,
      minStock: 20,
      supplierId: suppliers[0].id,
      location: "Store Room A",
      condition: "Good",
      image: createLogoDataUrl("P"),
      notes: "White paper for printing and photocopy.",
      createdAt: daysAgo(30),
      updatedAt: daysAgo(1),
    },
    {
      id: makeId("item", 2),
      code: "ITM-002",
      name: "Plastic Chair",
      category: "Furniture",
      unit: "Piece",
      quantity: 18,
      minStock: 10,
      supplierId: suppliers[2].id,
      location: "Hall Storage",
      condition: "Good",
      image: createLogoDataUrl("C"),
      notes: "For classrooms and meeting rooms.",
      createdAt: daysAgo(29),
      updatedAt: daysAgo(3),
    },
    {
      id: makeId("item", 3),
      code: "ITM-003",
      name: "Wireless Mouse",
      category: "ICT",
      unit: "Piece",
      quantity: 11,
      minStock: 12,
      supplierId: suppliers[1].id,
      location: "ICT Cabinet",
      condition: "Good",
      image: createLogoDataUrl("M"),
      notes: "For office desktop use.",
      createdAt: daysAgo(18),
      updatedAt: daysAgo(2),
    },
    {
      id: makeId("item", 4),
      code: "ITM-004",
      name: "Lab Goggles",
      category: "Lab Equipment",
      unit: "Pair",
      quantity: 26,
      minStock: 8,
      supplierId: suppliers[1].id,
      location: "Science Lab",
      condition: "Good",
      image: createLogoDataUrl("G"),
      notes: "Safety equipment for experiments.",
      createdAt: daysAgo(23),
      updatedAt: daysAgo(4),
    },
    {
      id: makeId("item", 5),
      code: "ITM-005",
      name: "Basketball",
      category: "Sports",
      unit: "Piece",
      quantity: 6,
      minStock: 10,
      supplierId: suppliers[2].id,
      location: "Sports Store",
      condition: "Fair",
      image: createLogoDataUrl("B"),
      notes: "Used for PE and club activities.",
      createdAt: daysAgo(14),
      updatedAt: daysAgo(1),
    },
    {
      id: makeId("item", 6),
      code: "ITM-006",
      name: "Library Book Tag",
      category: "Library",
      unit: "Pack",
      quantity: 45,
      minStock: 15,
      supplierId: suppliers[0].id,
      location: "Library Desk",
      condition: "Good",
      image: createLogoDataUrl("T"),
      notes: "Tags for cataloging books.",
      createdAt: daysAgo(8),
      updatedAt: daysAgo(6),
    },
  ];

  const purchaseOrders = [
    {
      id: makeId("po", 1),
      poNumber: "PO-2026-001",
      supplierId: suppliers[1].id,
      orderDate: daysAgo(12),
      expectedDate: daysAgo(-4),
      status: "Approved",
      totalItems: 4,
      notes: "ICT accessories and mice.",
      createdAt: daysAgo(12),
      updatedAt: daysAgo(2),
    },
    {
      id: makeId("po", 2),
      poNumber: "PO-2026-002",
      supplierId: suppliers[0].id,
      orderDate: daysAgo(9),
      expectedDate: daysAgo(-2),
      status: "Sent",
      totalItems: 3,
      notes: "Paper and stationery restock.",
      createdAt: daysAgo(9),
      updatedAt: daysAgo(1),
    },
  ];

  const receiving = [
    {
      id: makeId("rec", 1),
      receiveNumber: "RCV-001",
      poId: purchaseOrders[0].id,
      itemId: inventory[2].id,
      quantity: 5,
      receiverName: "Mr. Vuthy",
      dateReceived: daysAgo(5),
      status: "Received",
      notes: "Counted and checked on arrival.",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
    },
    {
      id: makeId("rec", 2),
      receiveNumber: "RCV-002",
      poId: purchaseOrders[1].id,
      itemId: inventory[0].id,
      quantity: 10,
      receiverName: "Ms. Sopheak",
      dateReceived: daysAgo(3),
      status: "Received",
      notes: "Delivered to main store.",
      createdAt: daysAgo(3),
      updatedAt: daysAgo(3),
    },
  ];

  const assignments = [
    {
      id: makeId("asg", 1),
      assignNumber: "ASN-001",
      itemId: inventory[0].id,
      quantity: 8,
      assigneeType: "Department",
      assigneeName: "Administration",
      assigneeId: departments[0].id,
      assignedDate: daysAgo(4),
      status: "Assigned",
      notes: "For office printing desks.",
      createdAt: daysAgo(4),
      updatedAt: daysAgo(4),
    },
    {
      id: makeId("asg", 2),
      assignNumber: "ASN-002",
      itemId: inventory[4].id,
      quantity: 2,
      assigneeType: "Classroom",
      assigneeName: "Class 7A",
      assigneeId: "class-7a",
      assignedDate: daysAgo(2),
      status: "Completed",
      notes: "For PE classroom use.",
      createdAt: daysAgo(2),
      updatedAt: daysAgo(2),
    },
  ];

  const returns = [
    {
      id: makeId("ret", 1),
      returnNumber: "RTN-001",
      itemId: inventory[1].id,
      quantity: 2,
      returnReason: "Not required anymore",
      condition: "Good",
      dateReturned: daysAgo(6),
      receivedBy: "Mr. Dara",
      notes: "Returned from meeting room.",
      createdAt: daysAgo(6),
      updatedAt: daysAgo(6),
    },
  ];

  const users = [
    {
      id: makeId("usr", 1),
      fullName: "Admin User",
      email: "admin@school.local",
      phone: "+855 10 000 001",
      role: "Admin",
      status: "Active",
      photo: createAvatarDataUrl("AU", "#0f172a"),
      password: "admin123",
      createdAt: daysAgo(60),
      updatedAt: daysAgo(1),
    },
    {
      id: makeId("usr", 2),
      fullName: "Storekeeper One",
      email: "store@school.local",
      phone: "+855 10 000 002",
      role: "Storekeeper",
      status: "Active",
      photo: createAvatarDataUrl("SO", "#1d4ed8"),
      password: "store123",
      createdAt: daysAgo(50),
      updatedAt: daysAgo(2),
    },
    {
      id: makeId("usr", 3),
      fullName: "Teacher One",
      email: "teacher@school.local",
      phone: "+855 10 000 003",
      role: "Teacher",
      status: "Active",
      photo: createAvatarDataUrl("TO", "#15803d"),
      password: "teacher123",
      createdAt: daysAgo(48),
      updatedAt: daysAgo(2),
    },
  ];

  const activities = [
    {
      id: makeId("act", 1),
      type: "Stock In",
      title: "Received wireless mice",
      description: "5 units were received into stock.",
      date: daysAgo(5),
      module: "Receiving",
    },
    {
      id: makeId("act", 2),
      type: "Assign Item",
      title: "Assigned copy paper to Administration",
      description: "8 reams were assigned to the Administration department.",
      date: daysAgo(4),
      module: "Assign Item",
    },
    {
      id: makeId("act", 3),
      type: "Return",
      title: "Returned plastic chairs",
      description: "2 chairs were returned to stock.",
      date: daysAgo(6),
      module: "Returns",
    },
    {
      id: makeId("act", 4),
      type: "Settings",
      title: "System logo updated",
      description: "The school logo was updated from Settings.",
      date: daysAgo(1),
      module: "Settings",
    },
  ];

  return {
    system: {
      systemName: "Sunrise School Stock",
      schoolName: "Sunrise International School",
      logo: createLogoDataUrl("SS", "#0f172a"),
      updatedAt: now,
    },
    profile: {
      fullName: "Admin User",
      email: "admin@school.local",
      phone: "+855 10 000 001",
      role: "Admin",
      photo: createAvatarDataUrl("AU", "#0f172a"),
      password: "admin123",
      updatedAt: now,
    },
    settings: {
      schoolName: "Sunrise International School",
      systemName: "Sunrise School Stock",
      logo: createLogoDataUrl("SS", "#0f172a"),
    },
    inventory,
    departments,
    suppliers,
    purchaseOrders,
    receiving,
    assignments,
    returns,
    users,
    activities,
  };
}

export async function fakeDelay(ms = 120) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

export function createEmptyRecord(collection) {
  return {
    id: generateId(collection.slice(0, 3).toUpperCase()),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
