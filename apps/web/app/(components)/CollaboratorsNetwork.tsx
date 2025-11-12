'use client';
import React, { useState, useEffect } from 'react';

export type NervousSystemState = 'ventral' | 'sympathetic' | 'dorsal';

interface TeamMember {
  id: string;
  name: string;
  vagalTone: number;
  heartCoherence: number;
  nervousSystemState: NervousSystemState;
  lastActive: number;
  avatar: string;
}

interface CollaboratorsNetworkProps {
  onSelectMember?: (member: TeamMember) => void;
}

/**
 * REVOLUTIONARY COLLABORATORS NETWORK
 * 
 * Real-time nervous system sync across team members.
 * Shows who's coherent, who needs support, shared state alignment.
 */
export function CollaboratorsNetwork({ onSelectMember }: CollaboratorsNetworkProps) {
  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'You',
      vagalTone: 65,
      heartCoherence: 72,
      nervousSystemState: 'ventral',
      lastActive: Date.now(),
      avatar: '👤',
    },
    {
      id: '2',
      name: 'Alex Chen',
      vagalTone: 58,
      heartCoherence: 65,
      nervousSystemState: 'sympathetic',
      lastActive: Date.now() - 2000,
      avatar: '🧠',
    },
    {
      id: '3',
      name: 'Maya Patel',
      vagalTone: 78,
      heartCoherence: 85,
      nervousSystemState: 'ventral',
      lastActive: Date.now() - 5000,
      avatar: '💫',
    },
    {
      id: '4',
      name: 'James Wu',
      vagalTone: 35,
      heartCoherence: 42,
      nervousSystemState: 'dorsal',
      lastActive: Date.now() - 30000,
      avatar: '🌊',
    },
  ]);

  // Simulate real-time biometric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prev => prev.map(member => {
        if (member.id === '1') return member; // Your data doesn't change in simulation
        
        // Simulate realistic fluctuations
        const newVagalTone = Math.max(0, Math.min(100, 
          member.vagalTone + (Math.random() - 0.5) * 3
        ));
        
        const newHeartCoherence = Math.max(0, Math.min(100,
          member.heartCoherence + (Math.random() - 0.5) * 2
        ));

        // Determine state based on vagal tone
        let state: NervousSystemState = 'ventral';
        if (newVagalTone > 70) state = 'ventral';
        else if (newVagalTone > 40) state = 'sympathetic';
        else state = 'dorsal';

        return {
          ...member,
          vagalTone: newVagalTone,
          heartCoherence: newHeartCoherence,
          nervousSystemState: state,
          lastActive: Date.now(),
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStateColor = (state: NervousSystemState) => {
    switch (state) {
      case 'ventral':
        return 'from-purple-500 to-purple-600 border-purple-400/30';
      case 'sympathetic':
        return 'from-amber-500 to-amber-600 border-amber-400/30';
      case 'dorsal':
        return 'from-blue-500 to-blue-600 border-blue-400/30';
    }
  };

  const getStateLabel = (state: NervousSystemState) => {
    switch (state) {
      case 'ventral':
        return 'Safe & Social';
      case 'sympathetic':
        return 'Activated';
      case 'dorsal':
        return 'Recovering';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-light text-white mb-2">Lab Team Sync</h3>
        <p className="text-xs text-gray-400">Live nervous system alignment • {members.length} connected</p>
      </div>

      {/* Team Members Grid */}
      <div className="space-y-2">
        {members.map(member => (
          <button
            key={member.id}
            onClick={() => onSelectMember?.(member)}
            className={`w-full p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer
              bg-gradient-to-r ${getStateColor(member.nervousSystemState)} 
              bg-opacity-10 hover:bg-opacity-20`}
          >
            <div className="flex items-center justify-between">
              {/* Left: Avatar & Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-2xl">{member.avatar}</div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-light text-white truncate">{member.name}</div>
                  <div className="text-xs text-gray-300">{getStateLabel(member.nervousSystemState)}</div>
                </div>
              </div>

              {/* Right: Metrics */}
              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{Math.round(member.vagalTone)}%</div>
                  <div className="text-xs text-gray-400">vagal</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-white">{Math.round(member.heartCoherence)}%</div>
                  <div className="text-xs text-gray-400">coherence</div>
                </div>
                {/* Live indicator */}
                <div className={`w-2 h-2 rounded-full ${
                  member.id === '1' 
                    ? 'bg-green-500 animate-pulse' 
                    : 'bg-gray-500'
                }`} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Coherence Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-3">Group Coherence</div>
        <div className="flex gap-2">
          <div className="flex-1 p-2 bg-purple-500/20 rounded border border-purple-500/30 text-center">
            <div className="text-xs text-purple-300 font-light">Safe & Social</div>
            <div className="text-sm text-white font-medium">{
              members.filter(m => m.nervousSystemState === 'ventral').length
            }</div>
          </div>
          <div className="flex-1 p-2 bg-amber-500/20 rounded border border-amber-500/30 text-center">
            <div className="text-xs text-amber-300 font-light">Activated</div>
            <div className="text-sm text-white font-medium">{
              members.filter(m => m.nervousSystemState === 'sympathetic').length
            }</div>
          </div>
          <div className="flex-1 p-2 bg-blue-500/20 rounded border border-blue-500/30 text-center">
            <div className="text-xs text-blue-300 font-light">Recovering</div>
            <div className="text-sm text-white font-medium">{
              members.filter(m => m.nervousSystemState === 'dorsal').length
            }</div>
          </div>
        </div>
      </div>
    </div>
  );
}
