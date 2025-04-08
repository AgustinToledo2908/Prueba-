"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "🏠 Inicio" },
  { href: "/Deposito", label: "📦 Depósito" },
  { href: "/Galpon", label: "🏚️ Galpón" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-neutral-900 text-white shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Mi Sistema</h1>
        <div className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 rounded-lg transition duration-200 ${
                pathname === href
                  ? "bg-emerald-600 text-white"
                  : "hover:bg-neutral-700"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
