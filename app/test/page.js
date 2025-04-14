"use client";
import { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [stack, setStack] = useState('Java');
  const [level, setLevel] = useState('Junior');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState('');

  const handleGenerateTest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/generate-test', { stack, level });
      setResponse(res.data.test);
    } catch (err) {
      setError('Failed to generate test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-bold mb-4">Générer un Test IA</h1>
      <div className="mb-4">
        <label className="block mb-2">Select Stack</label>
        <select value={stack} onChange={(e) => setStack(e.target.value)} className="w-full p-2 border rounded">
          <option>Java</option>
          <option>Angular</option>
          <option>React</option>
          <option>Python</option>
          <option>Spring</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Level</label>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full p-2 border rounded">
          <option>Junior</option>
          <option>Intermédiaire</option>
          <option>Senior</option>
        </select>
      </div>
      <button onClick={handleGenerateTest} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Générer le test IA
      </button>
      {loading && <p className="mt-4 text-blue-500">Chargement...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {response && <div className="mt-4 p-4 bg-gray-100 rounded"><pre>{response}</pre></div>}
    </div>
  );
}
