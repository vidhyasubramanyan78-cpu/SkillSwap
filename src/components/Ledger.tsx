import React, { useState } from 'react';
import { CreditLedgerEntry } from '../types';
import { Coins, Plus, Minus, ArrowUpRight, ArrowDownLeft, Clock, Info } from 'lucide-react';

interface LedgerProps {
  credits: number;
  completedSessions: number;
  ledger: CreditLedgerEntry[];
  onAddTransaction: (type: 'earn' | 'spend', amount: number, description: string) => void;
  offeredSkills: string[];
  wantedSkills: string[];
}

export default function Ledger({
  credits,
  completedSessions,
  ledger,
  onAddTransaction,
  offeredSkills,
  wantedSkills,
}: LedgerProps) {
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simType, setSimType] = useState<'earn' | 'spend'>('earn');
  const [partnerName, setPartnerName] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName || !selectedSkill) return;

    const desc = simType === 'earn'
      ? `Taught '${selectedSkill}' (1hr session) to ${partnerName}`
      : `Learned '${selectedSkill}' (1hr session) from ${partnerName}`;

    onAddTransaction(simType, 1, desc);
    setShowSimulateModal(false);
    setPartnerName('');
    setSelectedSkill('');
  };

  const openSimulate = (type: 'earn' | 'spend') => {
    setSimType(type);
    setSelectedSkill(type === 'earn' ? offeredSkills[0] || '' : wantedSkills[0] || '');
    setShowSimulateModal(true);
  };

  return (
    <div id="ledger-section" className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs">
      {/* Time Credits Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div id="credit-stat-card" className="bg-amber-50 border border-amber-200 rounded-lg p-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Time Credits</span>
            <Coins className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span id="credit-balance-txt" className="text-3xl font-bold text-amber-900">{credits}</span>
            <span className="text-xs text-amber-600 font-medium">credits</span>
          </div>
          <p className="text-[10px] text-amber-700 mt-1 flex items-center gap-1">
            <Info className="h-3 w-3 inline" /> 1 hour taught = +1 credit
          </p>
        </div>

        <div id="session-stat-card" className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Total Swaps</span>
            <Clock className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span id="session-count-txt" className="text-3xl font-bold text-emerald-900">{completedSessions}</span>
            <span className="text-xs text-emerald-600 font-medium">sessions</span>
          </div>
          <p className="text-[10px] text-emerald-700 mt-1">累積 exchange activity history</p>
        </div>
      </div>

      {/* Simulator Actions */}
      <div className="flex gap-2 mb-4">
        <button
          id="btn-simulate-teach"
          onClick={() => openSimulate('earn')}
          className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="h-4.5 w-4.5" />
          Simulate Teach Session
        </button>
        <button
          id="btn-simulate-learn"
          onClick={() => openSimulate('spend')}
          disabled={credits < 1}
          className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-200 disabled:text-gray-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Minus className="h-4.5 w-4.5" />
          Simulate Learn Session
        </button>
      </div>

      {/* Ledger History List */}
      <div>
        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
          <span>Credit & Activities Log</span>
          <span className="text-[10px] text-gray-400 font-normal">({ledger.length} entries)</span>
        </h4>

        <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 text-xs">
          {ledger.map((item) => (
            <div
              key={item.id}
              id={`ledger-item-${item.id}`}
              className={`p-2.5 rounded-lg border flex items-center justify-between ${
                item.type === 'earn'
                  ? 'bg-amber-50/50 border-amber-100'
                  : 'bg-indigo-50/50 border-indigo-100'
              }`}
            >
              <div className="flex gap-2 items-start max-w-[80%]">
                <div className={`p-1 rounded-full mt-0.5 ${
                  item.type === 'earn' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {item.type === 'earn' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownLeft className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-800 leading-tight">{item.description}</p>
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                </div>
              </div>
              <span className={`font-bold ${
                item.type === 'earn' ? 'text-amber-700' : 'text-indigo-700'
              }`}>
                {item.type === 'earn' ? '+1' : '-1'}
              </span>
            </div>
          ))}
          {ledger.length === 0 && (
            <p className="text-gray-400 text-center py-6">No credit transactions recorded yet.</p>
          )}
        </div>
      </div>

      {/* Simulated swap creation dialog */}
      {showSimulateModal && (
        <div id="sim-modal-overlay" className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div id="sim-modal-card" className="bg-white rounded-xl border border-gray-200 shadow-xl max-w-sm w-full p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              {simType === 'earn' ? 'Simulate Teaching Exchange' : 'Simulate Learning Exchange'}
            </h3>
            <p className="text-xs text-gray-500 mb-4 leading-normal">
              Directly records a simulated 1-hour swap. This adjusts your database time credits and adds a record to the activity ledger.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Exchange Partner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Ross, Kenji, etc."
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  {simType === 'earn' ? 'Skill You Taught' : 'Skill You Learnt'}
                </label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full text-xs p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {simType === 'earn'
                    ? offeredSkills.map(s => <option key={s} value={s}>{s}</option>)
                    : wantedSkills.map(s => <option key={s} value={s}>{s}</option>)
                  }
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                >
                  Book Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
