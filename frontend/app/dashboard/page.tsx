"use client";

import React, { useEffect, useState } from "react";
import { getHistory, clearHistory } from "@/utils/history";
import type { HistoryEntry } from "@/utils/history";


const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Historique des pitchs & tests</h1>
      {history.length === 0 ? (
        <div className="text-center text-gray-500 mt-16">Aucun historique à afficher.</div>
      ) : (
        <div className="space-y-4">
          {history.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  entry.type === "pitch"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {entry.type === "pitch" ? "Pitch" : "Test"}
              </span>
              <span className="text-gray-400 text-xs sm:ml-2">
                {formatDate(entry.date)}
              </span>
              <div className="flex-1">
                <div>
                  <div className="font-semibold text-md mb-2 text-gray-800 truncate">
                    {entry.title}
                  </div>
                  <div className="bg-gray-50 rounded p-2 max-h-40 overflow-auto text-sm whitespace-pre-wrap">
                    {entry.content}
                  </div>
                </div>
              </div>
              <button
                className="ml-auto mt-2 sm:mt-0 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
                onClick={() => handleCopy(entry.content)}
                title="Copier dans le presse-papier"
              >
                Copier
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 flex justify-end">
        <button
          className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded shadow"
          onClick={handleClear}
          disabled={history.length === 0}
        >
          Vider l’historique
        </button>
      </div>
    </div>
  );
}
