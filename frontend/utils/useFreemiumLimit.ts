import { useCallback, useMemo } from "react";
import { useUser } from "@clerk/nextjs";

const LOCAL_STORAGE_KEY = "freemium_generation_limit";
const DAILY_LIMIT = 3;
const getToday = () => {
  // Utilise la date du système fournie par Cascade : 2025-04-15
  return "2025-04-15";
};

interface LimitState {
  date: string;
  count: number;
}

function getLimitState(): LimitState {
  if (typeof window === "undefined") return { date: getToday(), count: 0 };
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) return { date: getToday(), count: 0 };
  try {
    const parsed = JSON.parse(raw);
    if (parsed.date !== getToday()) {
      // Reset si la date a changé
      return { date: getToday(), count: 0 };
    }
    return parsed;
  } catch {
    return { date: getToday(), count: 0 };
  }
}

function setLimitState(state: LimitState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
}

export function useFreemiumLimit() {
  const { user, isLoaded } = useUser();

  // L'utilisateur est Pro ?
  const isPro = useMemo(() => {
    return !!user && user.publicMetadata?.role === "pro";
  }, [user]);

  // Peut générer ?
  const canGenerate = useCallback(() => {
    if (isPro) return true;
    const state = getLimitState();
    return state.count < DAILY_LIMIT;
  }, [isPro]);

  // Incrémente le compteur après génération
  const registerGeneration = useCallback(() => {
    if (isPro) return;
    const state = getLimitState();
    if (state.date !== getToday()) {
      setLimitState({ date: getToday(), count: 1 });
    } else {
      setLimitState({ date: state.date, count: state.count + 1 });
    }
  }, [isPro]);

  // Pour afficher un message bloquant + lien d'upgrade
  const isBlocked = useMemo(() => {
    if (isPro) return false;
    const state = getLimitState();
    return state.count >= DAILY_LIMIT;
  }, [isPro]);

  // Lien vers la page d'upgrade (à adapter selon ton app)
  const upgradeUrl = "/upgrade";

  // Reset le compteur pour aujourd'hui
  const resetLimit = useCallback(() => {
    setLimitState({ date: getToday(), count: 0 });
  }, []);

  return {
    canGenerate,
    registerGeneration,
    isBlocked,
    upgradeUrl,
    isPro,
    isLoaded,
    currentCount: getLimitState().count,
    dailyLimit: DAILY_LIMIT,
    resetLimit,
  };
}
