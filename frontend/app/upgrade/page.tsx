"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const features = [
  {
    icon: "✅",
    title: "Générations illimitées",
    desc: "tests & pitchs",
  },
  {
    icon: "📩",
    title: "Envoi automatique sur Telegram",
    desc: "texte & PDF",
  },
  {
    icon: "🧠",
    title: "Cours IA immersifs",
    desc: "(à venir)",
  },
];

export default function UpgradePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-gray-400 text-lg">Chargement...</span>
      </div>
    );
  }

  // Redirection automatique si non connecté
  if (!user) {
    if (typeof window !== "undefined") {
      router.replace("/sign-up");
    }
    return null;
  }

  if (user?.publicMetadata?.role === "pro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-blue-50 to-purple-50 px-4">
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-purple-100">
          <h1 className="text-2xl font-bold mb-2 text-purple-700">Vous êtes déjà Pro 🎉</h1>
          <p className="mb-6 text-gray-600">Merci de soutenir DevDrill !</p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
            onClick={() => router.push("/")}
          >
            Retour à l’accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-purple-400 via-pink-300 to-orange-200 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-purple-100 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-2 text-purple-700 text-center">Passez en mode Pro</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Débloquez toutes les fonctionnalités IA de DevDrill</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 w-full">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center bg-purple-50 rounded-xl p-4 border border-purple-100">
              <span className="text-3xl mb-2">{f.icon}</span>
              <span className="font-semibold text-purple-700 text-center">{f.title}</span>
              <span className="text-xs text-gray-500 text-center">{f.desc}</span>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col items-center mb-6">
          <span className="text-xl font-bold text-gray-800 mb-2">DevDrill Pro – 9€/mois</span>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition"
            onClick={async () => {
              if (!user) return;
              const res = await fetch("http://localhost:8000/api/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.id })
              });
              const data = await res.json();
              if (data.url) {
                window.location.href = data.url;
              } else {
                alert("Erreur lors de la création de la session de paiement.");
              }
            }}
          >
            Passer en Pro
          </button>
        </div>
      </div>
    </div>
  );
}
