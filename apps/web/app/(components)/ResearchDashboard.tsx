'use client';
import React, { useState } from 'react';

interface ResearchItem {
  id: string;
  title: string;
  type: 'paper' | 'data' | 'experiment';
  focus: string;
  timestamp: string;
  participants: number;
}

/**
 * REVOLUTIONARY RESEARCH DASHBOARD
 * 
 * Unified access to papers, data, and active experiments.
 * Biometric-driven research insights.
 */
export function ResearchDashboard() {
  const [items] = useState<ResearchItem[]>([
    {
      id: '1',
      title: 'Vagal Coherence in Co-presence',
      type: 'paper',
      focus: 'Nervous system synchronization',
      timestamp: '3 days ago',
      participants: 12,
    },
    {
      id: '2',
      title: 'Heart Rate Variability Trends',
      type: 'data',
      focus: 'HRV patterns across team',
      timestamp: 'Last updated 2h ago',
      participants: 28,
    },
    {
      id: '3',
      title: 'Embodied Presence Study',
      type: 'experiment',
      focus: 'Deep focus mode',
      timestamp: 'Now',
      participants: 5,
    },
  ]);

  const getTypeColor = (type: ResearchItem['type']) => {
    switch (type) {
      case 'paper':
        return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'data':
        return 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30';
      case 'experiment':
        return 'from-pink-500/20 to-pink-600/20 border-pink-500/30';
    }
  };

  const getTypeIcon = (type: ResearchItem['type']) => {
    switch (type) {
      case 'paper':
        return '📄';
      case 'data':
        return '📊';
      case 'experiment':
        return '🧪';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-light text-white mb-2">Research Lab</h3>
        <p className="text-xs text-gray-400">Papers • Data • Active Experiments</p>
      </div>

      {/* Research Items */}
      <div className="space-y-2">
        {items.map(item => (
          <button
            key={item.id}
            className={`w-full p-4 rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer
              bg-gradient-to-r ${getTypeColor(item.type)} 
              hover:shadow-lg`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: Icon & Content */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="text-xl mt-1 flex-shrink-0">{getTypeIcon(item.type)}</div>
                <div className="text-left min-w-0">
                  <div className="text-sm font-light text-white truncate">{item.title}</div>
                  <div className="text-xs text-gray-300 mt-1">{item.focus}</div>
                  <div className="text-xs text-gray-400 mt-2">
                    {item.timestamp} • {item.participants} participants
                  </div>
                </div>
              </div>

              {/* Right: Status Badge */}
              <div className="flex-shrink-0">
                {item.type === 'experiment' && (
                  <div className="px-2 py-1 bg-pink-500/30 border border-pink-500/50 rounded text-xs text-pink-300 font-light">
                    Live
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Add New Research */}
      <button className="w-full mt-4 p-3 rounded-lg border border-dashed border-gray-600 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-300 text-sm font-light">
        + Start New Research
      </button>
    </div>
  );
}
