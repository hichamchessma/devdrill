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
    <aside className="fixed top-0 left-0 h-full w-64 z-40 bg-gradient-to-b from-[#232946] to-[#3a0ca3] shadow-lg flex flex-col text-white">
      <div className="flex flex-col items-center gap-2 py-8">
        {user?.imageUrl && (
          <img src={user.imageUrl} alt="Photo de profil" className="w-16 h-16 rounded-full object-cover border-4 border-[#5f6fff] shadow-md" />
        )}
        <span className="text-lg font-bold mt-2">{user?.firstName}</span>
        <div className="w-2/3 h-px bg-white/20 my-6" />
      </div>
      <nav className="flex flex-col gap-1 px-4">
        {routes.map((route) => {
          if (route.href === "/upgrade" && userRole === "pro") return null;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors duration-200 
                ${pathname === route.href ? "bg-[#5f6fff]/30 font-semibold" : "hover:bg-white/10"}
                text-white`}
            >
              {route.label}
            </Link>
          );
        })}
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-md mt-6 hover:text-red-400 transition-colors duration-200 text-white"
          onClick={() => signOut()}
        >
          🚪 Déconnexion
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;