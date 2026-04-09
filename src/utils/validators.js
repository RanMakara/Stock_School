export function required(value) {
  return value !== undefined && value !== null && String(value).trim() !== "";
}

export function isEmail(value) {
  if (!required(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

export function isPositiveNumber(value) {
  if (value === "" || value === null || value === undefined) return false;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0;
}

export function isNumber(value) {
  return value !== "" && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

export function minLength(value, length = 1) {
  return String(value || "").trim().length >= length;
}

export function passwordsMatch(password, confirmPassword) {
  return String(password || "") === String(confirmPassword || "");
}

export function validateImageFile(file) {
  if (!file) return { ok: true };
  if (!file.type?.startsWith("image/")) {
    return { ok: false, message: "Please choose an image file." };
  }
  if (file.size > 2 * 1024 * 1024) {
    return { ok: false, message: "Image size must be 2MB or smaller." };
  }
  return { ok: true };
}
