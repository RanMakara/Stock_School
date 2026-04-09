export default function Footer() {
  return (
    <footer className="footer border-t border-slate-200 bg-white px-4 py-4 text-center text-xs text-slate-500 lg:px-6">
      © {new Date().getFullYear()} School Stock Management System
    </footer>
  );
}
