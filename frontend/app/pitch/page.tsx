'use client';

import React, { useState } from 'react';
import axios from 'axios';

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
  const [profile, setProfile] = useState('');
  const [pitch, setPitch] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        </div>
      )}
    </div>
  );
}
