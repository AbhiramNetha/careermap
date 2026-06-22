import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center mb-8 px-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          {/* Step Circle */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                idx < currentStep
                  ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : idx === currentStep
                  ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
              }`}
            >
              {idx < currentStep ? (
                <CheckIcon className="w-4 h-4" />
              ) : (
                <span>{idx + 1}</span>
              )}
            </div>
            <span
              className={`text-[9px] uppercase tracking-wider font-semibold hidden sm:block transition-colors ${
                idx <= currentStep ? 'text-emerald-400' : 'text-slate-600'
              }`}
            >
              {step}
            </span>
          </div>

          {/* Connector Line */}
          {idx < steps.length - 1 && (
            <div
              className={`h-0.5 flex-1 mx-2 sm:mx-3 transition-all duration-500 rounded-full ${
                idx < currentStep ? 'bg-emerald-500' : 'bg-slate-800'
              }`}
              style={{ maxWidth: '80px' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
