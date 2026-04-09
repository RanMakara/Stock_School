export function generateId(prefix = "ID") {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timePart = Date.now().toString(36).toUpperCase();
  return `${prefix}-${timePart}-${randomPart}`;
}

export function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatNumber(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("en-US").format(number);
}

export function toTitleCase(value = "") {
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function initials(value = "") {
  const parts = String(value).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "SS";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export function createAvatarDataUrl(text = "SS", background = "#0f172a", foreground = "#ffffff") {
  const safeText = String(text).slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" rx="32" fill="${background}" />
      <text
        x="50%"
        y="54%"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="72"
        font-weight="700"
        fill="${foreground}"
      >${safeText}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function createLogoDataUrl(text = "SS", background = "#0f172a", foreground = "#ffffff") {
  const safeText = String(text).slice(0, 2).toUpperCase();
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="120">
      <rect width="320" height="120" rx="28" fill="${background}" />
      <circle cx="70" cy="60" r="34" fill="rgba(255,255,255,0.12)" />
      <text
        x="70"
        y="74"
        text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="44"
        font-weight="800"
        fill="${foreground}"
      >${safeText}</text>
      <text
        x="132"
        y="56"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24"
        font-weight="700"
        fill="${foreground}"
      >School</text>
      <text
        x="132"
        y="84"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24"
        font-weight="700"
        fill="${foreground}"
      >Stock</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

export function normalizeText(value = "") {
  return String(value).trim().toLowerCase();
}
