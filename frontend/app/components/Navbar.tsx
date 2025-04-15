"use client";
import React from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center py-3 px-6 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <a href="/" className="text-xl font-bold text-purple-700 tracking-tight">DevDrill</a>
      </div>
      <div className="flex items-center gap-3">
        <SignedOut>
          <button
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold px-4 py-2 rounded-lg"
            onClick={() => router.push("/sign-in")}
          >
            Connexion
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-lg ml-2"
            onClick={() => router.push("/sign-up")}
          >
            Créer un compte
          </button>
        </SignedOut>
        <SignedIn>
          {!user?.publicMetadata?.role || user.publicMetadata.role !== "pro" ? (
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-semibold px-4 py-2 rounded-lg mr-2"
              onClick={() => router.push("/upgrade")}
            >
              Passer en Pro
            </button>
          ) : (
            <span className="inline-flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              Pro ✅
            </span>
          )}
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
};

export default Navbar;
