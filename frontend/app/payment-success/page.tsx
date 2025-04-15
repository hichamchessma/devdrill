"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-green-50 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center border border-green-100">
        <h1 className="text-2xl font-bold mb-2 text-green-700">Félicitations, vous êtes maintenant Pro 🎉</h1>
        <p className="mb-6 text-gray-600">Merci d’avoir soutenu DevDrill ! Vous pouvez maintenant accéder à toutes les fonctionnalités Pro.</p>
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          onClick={() => router.push("/dashboard")}
        >
          Aller au dashboard
        </button>
      </div>
    </div>
  );
}
