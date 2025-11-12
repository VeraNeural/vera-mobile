'use client';
import { useState } from 'react';
import { useRegulationProtocol, REGULATION_PROTOCOLS } from '../(hooks)/useRegulationProtocol';

interface RegulationProtocolsUIProps {
  onProtocolSelect?: (protocolId: string) => void;
}

export function RegulationProtocolsUI({ onProtocolSelect }: RegulationProtocolsUIProps) {
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null);
  const [showProtocols, setShowProtocols] = useState(false);
  
  const handleSelectProtocol = (protocolId: string) => {
    setSelectedProtocolId(protocolId);
    onProtocolSelect?.(protocolId);
  };
  
  if (selectedProtocolId) {
    return (
      <ProtocolRunner 
        protocolId={selectedProtocolId}
        onBack={() => {
          setSelectedProtocolId(null);
          setShowProtocols(true);
        }}
      />
    );
  }
  
  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowProtocols(!showProtocols)}
        className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
      >
        🎯 Guided Regulation Protocols
      </button>
      
      {showProtocols && (
        <ProtocolLibrary onSelectProtocol={handleSelectProtocol} />
      )}
    </div>
  );
}

interface ProtocolLibraryProps {
  onSelectProtocol: (protocolId: string) => void;
}

function ProtocolLibrary({ onSelectProtocol }: ProtocolLibraryProps) {
  const protocols = Object.values(REGULATION_PROTOCOLS);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [filterGoal, setFilterGoal] = useState<string | null>(null);
  
  const filtered = protocols.filter(p => {
    if (filterDifficulty && p.difficulty !== filterDifficulty) return false;
    if (filterGoal && p.goal !== filterGoal) return false;
    return true;
  });
  
  return (
    <div className="space-y-4 bg-slate-900/50 backdrop-blur-md p-6 rounded-xl border border-purple-500/20">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <FilterButton
          label="All Levels"
          isActive={filterDifficulty === null}
          onClick={() => setFilterDifficulty(null)}
        />
        {['beginner', 'intermediate', 'advanced'].map(level => (
          <FilterButton
            key={level}
            label={level.charAt(0).toUpperCase() + level.slice(1)}
            isActive={filterDifficulty === level}
            onClick={() => setFilterDifficulty(level)}
            className={
              level === 'beginner' ? 'bg-green-500/20 border-green-500/50' :
              level === 'intermediate' ? 'bg-yellow-500/20 border-yellow-500/50' :
              'bg-red-500/20 border-red-500/50'
            }
          />
        ))}
      </div>
      
      <div className="flex gap-3 flex-wrap">
        <FilterButton
          label="All Goals"
          isActive={filterGoal === null}
          onClick={() => setFilterGoal(null)}
        />
        {['activation', 'regulation', 'calming', 'integration'].map(goal => (
          <FilterButton
            key={goal}
            label={goal.charAt(0).toUpperCase() + goal.slice(1)}
            isActive={filterGoal === goal}
            onClick={() => setFilterGoal(goal)}
          />
        ))}
      </div>
      
      {/* Protocol Cards */}
      <div className="grid gap-4 mt-6">
        {filtered.map(protocol => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            onSelect={() => onSelectProtocol(protocol.id)}
          />
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No protocols match your filters
        </div>
      )}
    </div>
  );
}

function FilterButton({
  label,
  isActive,
  onClick,
  className = ''
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        isActive
          ? 'bg-purple-500/50 border-purple-400 text-white'
          : `border border-slate-600 text-slate-300 hover:border-slate-500 ${className}`
      }`}
    >
      {label}
    </button>
  );
}

interface ProtocolCardProps {
  protocol: typeof REGULATION_PROTOCOLS[keyof typeof REGULATION_PROTOCOLS];
  onSelect: () => void;
}

function ProtocolCard({ protocol, onSelect }: ProtocolCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-300 border-green-500/50',
    intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    advanced: 'bg-red-500/20 text-red-300 border-red-500/50'
  };
  
  const goalIcons = {
    activation: '⚡',
    regulation: '⚖️',
    calming: '🧘',
    integration: '🌸'
  };
  
  return (
    <button
      onClick={onSelect}
      className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-purple-500/50 hover:bg-slate-800/80 transition"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {goalIcons[protocol.goal as keyof typeof goalIcons]} {protocol.name}
          </h3>
          <p className="text-sm text-slate-400 mt-1">{protocol.description}</p>
        </div>
        <div className="flex gap-2 flex-col text-xs">
          <span className={`px-2 py-1 rounded border ${difficultyColors[protocol.difficulty]}`}>
            {protocol.difficulty}
          </span>
          <span className="text-slate-400">
            {Math.floor(protocol.duration / 60)}m {protocol.duration % 60}s
          </span>
        </div>
      </div>
      
      {/* Success Criteria Preview */}
      <div className="text-xs text-slate-500 space-y-1 mt-3 pt-3 border-t border-slate-700">
        <div>✓ Vagal Tone: +{protocol.successCriteria.vagalToneIncrease}%</div>
        <div>✓ Coherence Target: {protocol.successCriteria.coherenceTarget}</div>
        <div>✓ Completion: {protocol.successCriteria.completionRate}%</div>
      </div>
    </button>
  );
}

interface ProtocolRunnerProps {
  protocolId: string;
  onBack: () => void;
}

function ProtocolRunner({ protocolId, onBack }: ProtocolRunnerProps) {
  const {
    protocol,
    currentStep,
    currentStepIndex,
    elapsedTime,
    progress,
    isRunning,
    isPaused,
    start,
    togglePause,
    stop
  } = useRegulationProtocol(protocolId);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const stepProgress = currentStepIndex / protocol.steps.length * 100;
  
  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="absolute top-6 right-6">
        <button
          onClick={onBack}
          className="text-slate-400 hover:text-white text-2xl"
        >
          ✕
        </button>
      </div>
      
      {/* Main Content */}
      <div className="max-w-3xl w-full space-y-8">
        {/* Protocol Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-light text-white">
            {protocol.name}
          </h1>
          <p className="text-slate-400">{protocol.description}</p>
        </div>
        
        {/* Visual Feedback Area */}
        <div className="h-48 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center">
          {!isRunning ? (
            <div className="text-center space-y-2">
              <p className="text-slate-300">Ready to begin?</p>
              <p className="text-sm text-slate-500">{protocol.steps.length} steps • {Math.floor(protocol.duration / 60)} minutes</p>
            </div>
          ) : currentStep ? (
            <div className="text-center space-y-4">
              <div className="text-5xl font-light text-purple-300">
                {currentStep.type === 'breathing' ? '🫁' :
                 currentStep.type === 'visualization' ? '👁️' :
                 currentStep.type === 'movement' ? '🏃' :
                 currentStep.type === 'sound' ? '🔊' :
                 '⏸️'}
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-white">{currentStep.instruction}</p>
                <p className="text-sm text-slate-400">{currentStep.type.toUpperCase()}</p>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Progress */}
        <div className="space-y-3">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">Protocol Progress</span>
              <span className="text-slate-500">{formatTime(elapsedTime)} / {formatTime(protocol.duration)}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Step Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">Step {currentStepIndex + 1} of {protocol.steps.length}</span>
              <span className="text-slate-500">{currentStep?.instruction}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Biometric Targets */}
        {currentStep?.biometricTarget && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400 mb-2">Biometric Targets</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {currentStep.biometricTarget.vagalTone && (
                <div>
                  <p className="text-slate-400">Vagal Tone</p>
                  <p className="text-white font-semibold">
                    {currentStep.biometricTarget.vagalTone.min}
                    {currentStep.biometricTarget.vagalTone.max && `–${currentStep.biometricTarget.vagalTone.max}`}
                  </p>
                </div>
              )}
              {currentStep.biometricTarget.coherence && (
                <div>
                  <p className="text-slate-400">Coherence</p>
                  <p className="text-white font-semibold">
                    ≥ {currentStep.biometricTarget.coherence.min}
                  </p>
                </div>
              )}
              {currentStep.biometricTarget.breathingRate && (
                <div>
                  <p className="text-slate-400">Breathing Rate</p>
                  <p className="text-white font-semibold">
                    {currentStep.biometricTarget.breathingRate.target} bpm
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => (isRunning ? togglePause() : start())}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            {isRunning ? (isPaused ? '▶ Resume' : '⏸ Pause') : '▶ Start'}
          </button>
          {isRunning && (
            <button
              onClick={stop}
              className="px-8 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition"
            >
              ⏹ Stop
            </button>
          )}
        </div>
        
        {/* Success Criteria */}
        {!isRunning && elapsedTime === 0 && (
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-sm">
            <p className="text-slate-400 mb-3">Success Criteria</p>
            <div className="grid grid-cols-3 gap-4 text-slate-300">
              <div>✓ Vagal Tone: +{protocol.successCriteria.vagalToneIncrease}%</div>
              <div>✓ Coherence: {protocol.successCriteria.coherenceTarget}</div>
              <div>✓ Completion: {protocol.successCriteria.completionRate}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
