import React, { useState, useEffect } from "react";
import { useFreemiumLimit } from "@/utils/useFreemiumLimit";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export const FreemiumModal: React.FC = () => {
  const { isBlocked, isPro, isLoaded, resetLimit } = useFreemiumLimit();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [closedManually, setClosedManually] = useState(false);

  // Si la limite n'est plus atteinte, on réactive la modal pour la prochaine fois
  useEffect(() => {
    if (!isBlocked) setClosedManually(false);
  }, [isBlocked]);

  if (!isLoaded || !isBlocked || isPro || closedManually) return null;

  const handleUpgrade = () => {
    router.push("/upgrade");
  };
  const handleSignup = () => {
    router.push("/sign-up");
  };
  const handleClose = () => {
    resetLimit();
    setClosedManually(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
        <div className="text-3xl mb-4">🛑</div>
        <h2 className="text-xl font-bold mb-2">Limite gratuite atteinte</h2>
        <p className="mb-6">Vous avez atteint votre limite gratuite. Créez un compte pour continuer à utiliser DevDrill.</p>
        {isSignedIn ? (
          <button
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition mb-2"
            onClick={handleUpgrade}
          >
            Passer en mode Pro
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            <button
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              onClick={handleSignup}
            >
              Créer un compte
            </button>
            <button
              className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              onClick={() => router.push("/sign-in")}
            >
              Se connecter
            </button>
            <button
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
              onClick={handleClose}
            >
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreemiumModal;
