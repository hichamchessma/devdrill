'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { saveToHistory } from '@/utils/history';
import FreemiumModal from './FreemiumModal';
import { useFreemiumLimit } from '@/utils/useFreemiumLimit';

interface TestForm {
  stack: string;
  level: string;
}

export default function TestPage() {
  const [formData, setFormData] = useState<TestForm>({ stack: '', level: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const { registerGeneration } = useFreemiumLimit();

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/generate-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      if (typeof data.content !== 'string') {
        throw new Error('Format de réponse invalide');
      }
      setResult(data.content);
      saveToHistory({ type: "test", title: `${formData.stack} (${formData.level})`, content: data.content });
      registerGeneration();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FreemiumModal />
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient stylé */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#43cea2] via-[#185a9d] to-[#f7971e] blur-[2px] opacity-80"></div>
        <div className="relative z-10 w-full max-w-2xl mx-auto bg-white/80 rounded-2xl shadow-xl border border-white/40 backdrop-blur-md p-6 md:p-8">

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Générateur de Test IA</h1>
      
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stack technique</label>
            <select
              name="stack"
              value={formData.stack}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Sélectionner une stack</option>
              {['Java', 'Angular', 'React', 'Python', 'Spring'].map((stack) => (
                <option key={stack} value={stack}>{stack}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleSelectChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Sélectionner un niveau</option>
              {['Junior', 'Intermédiaire', 'Senior'].map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Génération en cours...' : 'Générer le test IA'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          Erreur : {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md prose max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Résultat du test :</h2>
          <div className="prose max-w-none">{result}</div>
        </div>
      )}
        </div>
      </div>
    </>
  );
}
