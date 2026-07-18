import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function PremiumRoute({ children }) {
  const { isPremium, togglePremium } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // If user is authenticated AND premium status is unlocked
  if (currentUser && isPremium) {
    return <>{children}</>;
  }

  const handleUpgradeClick = () => {
    if (!currentUser) {
      navigate('/login');
    } else {
      togglePremium();
    }
  };

  return (
    <div className="relative w-full min-h-[calc(100vh-var(--topbar-height))] flex flex-col justify-start">
      {/* Blurred background content */}
      <div className="blur-md pointer-events-none select-none filter blur-[10px] opacity-25 w-full h-full flex-1">
        {children}
      </div>

      {/* Start-Aligned Premium Unlock Overlay Card */}
      <div 
        className="absolute inset-0 flex flex-col items-center justify-start z-40 p-4 bg-black/10"
        style={{ paddingTop: '80px' }}
      >
        <div
          className="w-full max-w-md bg-neutral-950/80 border border-amber-500/20 backdrop-blur-md rounded-2xl p-8 text-center shadow-2xl transition-all"
          style={{
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(251, 191, 36, 0.1)',
          }}
        >


          <h2 className="text-2xl font-bold text-white mb-2">
            {!currentUser ? 'Login Required' : 'Unlock Premium Access'}
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            {!currentUser
              ? 'You must login to access this premium page. Click the button below to login and unlock Way2Fresher PRO.'
              : 'This is a premium feature. Upgrade your account to Way2Fresher PRO to unlock Branch Guide, Compare, Resume Builder, ATS Checker, and more.'}
          </p>

          <button
            onClick={handleUpgradeClick}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm py-3 px-6 rounded-lg transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 border-none cursor-pointer"
          >
            {!currentUser ? 'Log In to Upgrade' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>
    </div>
  );
}
