import { useState } from 'react';
import CompanyDashboard from './CompanyDashboard';
import InfluencerPortal from './InfluencerPortal';

function App() {
  const [view, setView] = useState('home'); // 'home', 'company', 'influencer'

  if (view === 'company') {
    return (
      <div>
        <button
          onClick={() => setView('home')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white transition"
        >
          ← Back to Home
        </button>
        <CompanyDashboard />
      </div>
    );
  }

  if (view === 'influencer') {
    return (
      <div>
        <button
          onClick={() => setView('home')}
          className="fixed top-4 left-4 z-50 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-white transition"
        >
          ← Back to Home
        </button>
        <InfluencerPortal />
      </div>
    );
  }

  // Home Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[30%] w-[40%] h-[40%] bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            <span className="gradient-text">BrainStroming</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-2">
            Decentralized Influencer Marketing Platform
          </p>
          <p className="text-slate-400">
            Transparent campaigns. Automatic payments. Powered by blockchain.
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Company Card */}
          <div className="glass-panel p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => setView('company')}>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">For Companies</h2>
            <p className="text-slate-400 mb-6">
              Create campaigns, set budgets, and manage influencer partnerships with complete transparency.
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Create unlimited campaigns
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Automatic influencer payments
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real-time campaign analytics
              </li>
            </ul>
            <button className="btn-primary w-full py-3 group-hover:scale-105 transition-transform">
              Launch Dashboard →
            </button>
          </div>

          {/* Influencer Card */}
          <div className="glass-panel p-8 hover:scale-105 transition-transform cursor-pointer group" onClick={() => setView('influencer')}>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-3">For Influencers</h2>
            <p className="text-slate-400 mb-6">
              Browse campaigns, join with your X handle, and earn ETH automatically when you hit targets.
            </p>
            <ul className="space-y-2 text-sm text-slate-300 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Browse active campaigns
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Instant ETH payments
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Transparent reward tracking
              </li>
            </ul>
            <button className="btn-primary w-full py-3 group-hover:scale-105 transition-transform">
              Browse Campaigns →
            </button>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="mt-12 glass-panel p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold gradient-text">5%</p>
              <p className="text-sm text-slate-400 mt-1">Platform Fee</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">∞</p>
              <p className="text-sm text-slate-400 mt-1">Campaigns</p>
            </div>
            <div>
              <p className="text-3xl font-bold gradient-text">100%</p>
              <p className="text-sm text-slate-400 mt-1">Transparent</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Powered by Ethereum • Sepolia Testnet</p>
        </div>
      </div>
    </div>
  );
}

export default App;
