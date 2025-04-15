'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { generatePDF } from '@/utils/pdfUtils';

interface PitchResponse {
  pitch: string;
}

type AxiosErrorWithResponse = {
  isAxiosError: true;
  response?: {
    status: number;
    statusText: string;
    data: unknown;
  };
  code?: string;
  message: string;
};

const isAxiosError = (error: unknown): error is AxiosErrorWithResponse => {
  return typeof error === 'object' && error !== null && 'isAxiosError' in error;
};

export default function PitchPage() {
  const [profile, setProfile] = useState('5 an java exp');
  const [pitch, setPitch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [telegramError, setTelegramError] = useState<string | null>(null);
  const [telegramSuccess, setTelegramSuccess] = useState<boolean>(false);

  const [telegramPDFLoading, setTelegramPDFLoading] = useState(false);
  const [telegramPDFError, setTelegramPDFError] = useState<string | null>(null);
  const [telegramPDFSuccess, setTelegramPDFSuccess] = useState<boolean>(false);

  const handleGeneratePitch = async () => {
    if (!profile.trim()) {
      setError('Veuillez décrire votre profil');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post<PitchResponse>(
        'http://localhost:8000/generate-pitch',
        { profile: profile.trim() },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: false,
          timeout: 10000
        }
      );
      setPitch(data.pitch);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('Timeout - Le serveur met trop de temps à répondre');
        } else if (!err.response) {
          setError('Erreur réseau - Serveur inaccessible');
        } else {
          setError(`Erreur ${err.response.status} - ${err.response.statusText}`);
        }
      } else if (err instanceof Error) {
        setError(`Erreur: ${err.message}`);
      } else {
        setError('Une erreur inconnue est survenue');
      }
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendTelegram = async (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    if (!pitch) return;

    console.log('Envoi Telegram en cours...', { pitch, chat_id: '7680811416' });
    setTelegramLoading(true);
    setTelegramError(null);
    setTelegramSuccess(false);

    try {
      const response = await axios.post('http://localhost:8000/send-telegram', {
        message: pitch,
        chat_id: '7680811416',
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      });
      console.log('Réponse du serveur:', response.data);
      setTelegramSuccess(true);
    } catch (err: unknown) {
      console.error('Erreur Telegram:', err);
      if (isAxiosError(err)) {
        setTelegramError(`Erreur ${err.response?.status} - ${err.response?.statusText}`);
      } else if (err instanceof Error) {
        setTelegramError(`Erreur: ${err.message}`);
      } else {
        setTelegramError('Une erreur inconnue est survenue');
      }
    } finally {
      setTelegramLoading(false);
    }
  };

  // --- Ajout de la fonction handleSendTelegramPDF ---
  const handleSendTelegramPDF = async (event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    console.log("handleSendTelegramPDF appelé");
    if (!pitch) {
      console.log("Pas de pitch, sortie");
      return;
    }
    setTelegramPDFLoading(true);
    setTelegramPDFError(null);
    setTelegramPDFSuccess(false);
    try {
      // 1. Générer le PDF (Blob)
      const pdfBlob = await generatePDF(pitch, "pitch-devdrill.pdf");
      console.log("PDF généré", pdfBlob);
      // 2. Transformer le Blob en File
      const pdfFile = new File([pdfBlob], "pitch-devdrill.pdf", { type: "application/pdf" });
      // 3. Créer le FormData
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('chat_id', '7680811416');
      // 4. Envoyer la requête
      console.log("Envoi du fetch vers /send-pdf-to-telegram");
      const response = await fetch('http://localhost:8000/send-pdf-to-telegram', {
        method: 'POST',
        body: formData,
      });
      console.log("Réponse fetch reçue", response);
      const data = await response.json();
      if (response.ok && data.success) {
        setTelegramPDFSuccess(true);
      } else {
        setTelegramPDFError(data.error || 'Erreur lors de l’envoi du PDF');
      }
    } catch (err: any) {
      setTelegramPDFError(err?.message || 'Erreur inattendue');
      console.error("Erreur handleSendTelegramPDF", err);
    } finally {
      setTelegramPDFLoading(false);
    }
  };



  return (
    <div className="min-h-screen p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Générateur de Pitch</h1>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={6}
        placeholder="Décrivez votre profil (ex : '10 ans d'XP Java, Spring, Angular...')"
        value={profile}
        onChange={(e) => setProfile(e.target.value)}
      />
      
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleGeneratePitch}
        disabled={loading || !profile.trim()}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Génération en cours...
          </span>
        ) : 'Générer mon pitch IA'}
      </button>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      {pitch && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-line">
          <h2 className="font-semibold mb-2">Votre pitch :</h2>
          <p>{pitch}</p>
          <button
            type="button"
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => handleSendTelegram(e)}
            disabled={telegramLoading}
          >
            {telegramLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : '📩 M’envoyer ce pitch sur Telegram'}
          </button>
          <button 
            type="button"
            onClick={() => generatePDF(pitch, "pitch-devdrill.pdf")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Exporter en PDF
          </button>

          <button
            type="button"
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => handleSendTelegramPDF(e)}
            disabled={telegramLoading}
          >
            {telegramLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi PDF sur Telegram...
              </span>
            ) : '📄 Envoyer PDF sur Telegram'}
          </button>
          {telegramError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {telegramError}
            </div>
          )}
          {telegramSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-200">
              Message envoyé avec succès !
            </div>
          )}

          <button
            type="button"
            className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={(e) => handleSendTelegramPDF(e)}
            disabled={telegramPDFLoading}
          >
            {telegramPDFLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi PDF sur Telegram...
              </span>
            ) : '📄 Envoyer PDF sur Telegram'}
          </button>
          {telegramPDFError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
              {telegramPDFError}
            </div>
          )}
          {telegramPDFSuccess && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-200">
              PDF envoyé avec succès !
            </div>
          )}
        </div>
      )}
    </div>
  );
}
