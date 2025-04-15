"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";

const routes = [
  { label: "🧠 Générateur de Pitch", href: "/pitch" },
  { label: "🧪 Générateur de Test", href: "/test" },
  { label: "📊 Dashboard", href: "/dashboard" },
  { label: "🚀 Passer en Pro", href: "/upgrade", proOnly: true },
  { label: "👤 Mon profil", href: "/profile" },
];

const Sidebar: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const pathname = usePathname();
  if (!isSignedIn) return null;
  const userRole = user?.publicMetadata?.role || "free";
  return (
    <aside className="fixed top-0 left-0 h-full w-64 z-40 bg-white shadow-lg flex flex-col">
      <div className="flex flex-col items-center gap-2 py-6">
        {user?.imageUrl && (
          <img src={user.imageUrl} alt="Photo de profil" className="w-16 h-16 rounded-full object-cover border" />
        )}
        <span className="font-semibold text-black">{user?.firstName}</span>
      </div>
      <nav className="flex flex-col gap-2 mt-6 px-4">
        {routes.map((route) => {
          if (route.href === "/upgrade" && userRole === "pro") return null;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-black hover:bg-gray-200 transition-colors duration-200 ${pathname === route.href ? "bg-gray-200 font-semibold" : ""}`}
            >
              {route.label}
            </Link>
          );
        })}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-md text-black hover:bg-gray-200 transition-colors duration-200 mt-4"
          onClick={() => signOut()}
        >
          🚪 Déconnexion
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;