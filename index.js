import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://wzqapvkeupudobtnpyca.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6cWFwdmtldXB1ZG9idG5weWNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Mzc0MDgsImV4cCI6MjA2MDQxMzQwOH0.j0H_gQp64ArKcEVsk528cF7eX-e4-04RF4CTtA0sbh8'
);

const backgrounds = [
  'https://images.unsplash.com/photo-1599059812371-25658dc15ced?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1950&q=80',
  'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1950&q=80',
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const handleSignup = async () => {
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from('early_signups').insert([{ email }]);
    setLoading(false);
    if (!error) {
      setSubmitted(true);
    } else {
      alert('Signup failed. Please try again later.');
    }
  };

  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % backgrounds.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center justify-center p-6 transition-all duration-1000 relative overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url(${backgrounds[bgIndex]})`, zIndex: -1 }}
      ></div>

      <div className="backdrop-blur-sm bg-black/50 p-8 rounded-2xl shadow-lg max-w-2xl text-center z-10">
        <h1 className="text-5xl font-bold mb-4">🎉 Chat Live During Major Events</h1>
        <p className="text-lg mb-6">
          Join real-time conversations around the world’s biggest events — from award shows to playoffs.
          No sign-in required. Just jump in and chat.
        </p>
        {!submitted ? (
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <Input
              type="email"
              placeholder="Enter your email to get early access"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-72 text-black"
            />
            <Button onClick={handleSignup} disabled={loading || !email}>
              {loading ? 'Joining...' : 'Get Early Access'}
            </Button>
          </div>
        ) : (
          <p className="text-green-400 font-medium">✅ You're on the list! Stay tuned for launch 🚀</p>
        )}
        <div className="mt-4">
          <label className="flex items-center justify-center gap-2">
            <input
              type="checkbox"
              checked={!autoRotate}
              onChange={() => setAutoRotate(!autoRotate)}
            />
            Pause Background Rotation
          </label>
          <div className="mt-2 flex gap-2 justify-center">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full ${bgIndex === index ? 'bg-white' : 'bg-gray-400'} hover:scale-110 transition`}
                onClick={() => {
                  setBgIndex(index);
                  setAutoRotate(false);
                }}
              ></button>
            ))}
          </div>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1603787834840-64e661c4e0bb?auto=format&fit=crop&w=1350&q=80"
        alt="Live Event Chat"
        className="rounded-2xl shadow-xl mt-10 max-w-full w-[600px] z-10"
      />
    </div>
  );
}
