'use client';
import React from 'react';
import { useBiometrics, type NervousSystemState } from '../(hooks)/useBiometrics';

/**
 * Example usage of useBiometrics hook
 * Shows how to connect to real devices or start simulation
 */
export function BiometricsDashboard() {
  const { 
    vagalTone, 
    heartCoherence, 
    nervousSystemState, 
    isConnected,
    connect,
    disconnect 
  } = useBiometrics();

  const stateColors: Record<NervousSystemState, string> = {
    ventral: 'from-purple-500 to-purple-700',
    sympathetic: 'from-amber-500 to-amber-700',
    dorsal: 'from-blue-500 to-blue-700',
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Connection Status */}
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-300">
          {isConnected ? 'Connected to biometric device' : 'Not connected'}
        </span>
      </div>

      {/* Biometric Readouts */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-900/50 p-4 rounded-lg border border-purple-500/30">
          <div className="text-gray-400 text-xs font-light mb-2">Vagal Tone</div>
          <div className="text-3xl font-light text-purple-300">{vagalTone}%</div>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-lg border border-blue-500/30">
          <div className="text-gray-400 text-xs font-light mb-2">Heart Coherence</div>
          <div className="text-3xl font-light text-blue-300">{heartCoherence}%</div>
        </div>
        <div className={`bg-gradient-to-br ${stateColors[nervousSystemState]} p-4 rounded-lg border border-gray-700`}>
          <div className="text-gray-100 text-xs font-light mb-2">Nervous System State</div>
          <div className="text-xl font-light text-white capitalize">{nervousSystemState}</div>
        </div>
      </div>

      {/* Connection Controls */}
      <div className="flex gap-3">
        <button
          onClick={connect}
          disabled={isConnected}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Connect Device
        </button>
        <button
          onClick={disconnect}
          disabled={!isConnected}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg text-sm transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Info */}
      <div className="text-xs text-gray-400 space-y-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <p className="font-semibold text-gray-300">Real Device Support:</p>
        <p>• Heart Rate Monitors (BLE)</p>
        <p>• HRV Sensors (via Bluetooth)</p>
        <p>• Breathing Rate Detection</p>
        <p className="text-gray-500 pt-2">Falls back to simulation mode if no device found</p>
      </div>
    </div>
  );
}
