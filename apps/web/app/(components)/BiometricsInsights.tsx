'use client';
import React, { useState, useEffect } from 'react';

interface BiometricInsight {
  metric: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  label: string;
  target: number;
}

/**
 * REVOLUTIONARY BIOMETRIC INSIGHTS
 * 
 * Real-time nervous system metrics with polyvagal analysis.
 * HRV • State • Predictive insights.
 */
export function BiometricsInsights() {
  const [insights, setInsights] = useState<BiometricInsight[]>([
    {
      metric: 'hrv',
      value: 72,
      trend: 'up',
      label: 'Heart Rate Variability',
      target: 80,
    },
    {
      metric: 'vagal',
      value: 68,
      trend: 'stable',
      label: 'Vagal Tone',
      target: 75,
    },
    {
      metric: 'coherence',
      value: 81,
      trend: 'up',
      label: 'Heart Coherence',
      target: 85,
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setInsights(prev => prev.map(insight => {
        const change = (Math.random() - 0.5) * 4;
        const newValue = Math.max(0, Math.min(100, insight.value + change));
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (newValue > insight.value + 1) trend = 'up';
        else if (newValue < insight.value - 1) trend = 'down';

        return {
          ...insight,
          value: newValue,
          trend,
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getTrendIcon = (trend: BiometricInsight['trend']) => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'stable':
        return '→';
    }
  };

  const getTrendColor = (trend: BiometricInsight['trend']) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-amber-400';
      case 'stable':
        return 'text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-light text-white mb-2">Your Nervous System</h3>
        <p className="text-xs text-gray-400">HRV • State • Real-time insights</p>
      </div>

      {/* Biometric Metrics */}
      <div className="space-y-3">
        {insights.map(insight => (
          <div
            key={insight.metric}
            className="p-4 rounded-lg bg-gradient-to-r from-gray-900/50 to-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="text-sm font-light text-white">{insight.label}</div>
                <div className="text-xs text-gray-400 mt-1">Target: {insight.target}%</div>
              </div>
              <div className={`text-lg font-light ${getTrendColor(insight.trend)}`}>
                {getTrendIcon(insight.trend)}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${insight.value}%` }}
              />
              {/* Target indicator */}
              <div
                className="absolute top-0 h-full w-0.5 bg-gray-500"
                style={{ left: `${insight.target}%` }}
              />
            </div>

            {/* Value Display */}
            <div className="flex items-center justify-between mt-2">
              <div className="text-2xl font-light text-white">{Math.round(insight.value)}%</div>
              <div className="text-xs text-gray-400">
                {insight.value > insight.target ? '↑ above target' : '↓ below target'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 mb-3">Nervous System State</div>
        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg">
          <div className="text-sm text-white font-light mb-1">Ventral (Safe & Social)</div>
          <div className="text-xs text-gray-300">Coherence optimal. Ready for deep work & collaboration.</div>
        </div>
      </div>
    </div>
  );
}
