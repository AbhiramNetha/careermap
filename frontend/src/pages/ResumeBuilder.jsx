import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import posthog from '../posthog.js';

import StepIndicator from '../components/resumebuilder/StepIndicator';
import StepOne_Personal from '../components/resumebuilder/steps/StepOne_Personal';
import StepTwo_Education from '../components/resumebuilder/steps/StepTwo_Education';
import StepThree_Skills from '../components/resumebuilder/steps/StepThree_Skills';
import StepFour_Experience from '../components/resumebuilder/steps/StepFour_Experience';
import StepFive_Projects from '../components/resumebuilder/steps/StepFive_Projects';
import StepSix_JD from '../components/resumebuilder/steps/StepSix_JD';
import ResumePreview from '../components/resumebuilder/ResumePreview';
import { SparklesIcon, DocumentTextIcon } from '@heroicons/react/24/solid';

const STEPS = ['Personal', 'Education', 'Skills', 'Experience', 'Projects', 'Job Description'];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [resumeData, setResumeData] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateFormData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = (stepData) => {
    updateFormData(stepData);
    const nextStep = currentStep + 1;
    if (currentStep === 0) {
      posthog.capture('resume_builder_started');
    }
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async (jdData) => {
    updateFormData(jdData);
    setLoading(true);

    try {
      const userData = { ...formData, ...jdData };

      const res = await axios.post(`${API_URL}/api/resume/generate`, {
        userData,
        jdText: jdData.jdText,
      });

      if (res.data.success) {
        setResumeData(res.data.resumeData);
        setKeywords(res.data.extractedKeywords || []);
        posthog.capture('resume_generated', { keywords_count: (res.data.extractedKeywords || []).length });
        toast.success('✅ Resume generated successfully!', { duration: 4000 });
      } else {
        throw new Error(res.data.error || 'Generation failed');
      }
    } catch (error) {
      posthog.captureException(error);
      const msg = error.response?.data?.error || error.message || 'Generation failed.';
      toast.error(msg, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    posthog.capture('resume_downloaded', { format });
    // PDF is handled by ResumePreview via window.print() — this is for DOCX
    if (format === 'docx') {
      const toastId = toast.loading('Generating DOCX file...');
      try {
        const res = await axios.post(
          `${API_URL}/api/resume/download/docx`,
          { resumeData },
          { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        const name = resumeData?.personalInfo?.name?.replace(/\s+/g, '_') || 'Resume';
        link.setAttribute('download', `${name}_Resume.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success('DOCX downloaded!', { id: toastId });
      } catch (error) {
        posthog.captureException(error, { format: 'docx' });
        toast.error('DOCX download failed. Make sure the backend is running.', { id: toastId });
      }
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepOne_Personal onNext={handleNext} defaultValues={formData} />;
      case 1:
        return <StepTwo_Education onNext={handleNext} onBack={handleBack} defaultValues={formData} />;
      case 2:
        return <StepThree_Skills onNext={handleNext} onBack={handleBack} defaultValues={formData} />;
      case 3:
        return <StepFour_Experience onNext={handleNext} onBack={handleBack} defaultValues={formData} />;
      case 4:
        return <StepFive_Projects onNext={handleNext} onBack={handleBack} defaultValues={formData} />;
      case 5:
        return <StepSix_JD onGenerate={handleGenerate} onBack={handleBack} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-16 lg:pt-[98px] pb-16 px-4 relative">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
            fontWeight: '600',
          },
        }}
      />

      {/* Background glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold rb-heading flex items-center justify-center gap-2 mb-2">
            <DocumentTextIcon className="w-8 h-8 text-amber-400" />
            AI <span className="text-amber-400">Resume</span> Builder
          </h1>
          <p className="rb-subtext text-sm max-w-xl mx-auto">
            Fill your details → Paste any Job Description → Gemini AI tailors a ATS-optimized resume
          </p>
          <div className="flex items-center justify-center gap-6 mt-3 rb-meta text-xs">
            <span className="flex items-center gap-1"><SparklesIcon className="w-3 h-3 text-amber-400" /> Gemini AI Powered</span>
            <span>•</span>
            <span>ATS Score Included</span>
            <span>•</span>
            <span>PDF & DOCX Export</span>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
          {/* LEFT — Form Panel */}
          <div className="resume-builder-form rb-card rounded-3xl p-6 shadow-xl">
            {renderStep()}
          </div>

          {/* RIGHT — Preview Panel */}
          <div className="flex flex-col">
            {resumeData ? (
              <ResumePreview
                resumeData={resumeData}
                keywords={keywords}
                onDownload={handleDownload}
              />
            ) : (
              <div className="rb-card rounded-3xl p-6 flex flex-col items-center justify-center gap-4 min-h-[500px]">
                <div className="w-20 h-20 rounded-2xl rb-icon-box flex items-center justify-center">
                  <DocumentTextIcon className="w-10 h-10 rb-icon-muted" />
                </div>
                <div className="text-center">
                  <p className="rb-subtext font-semibold mb-1">Resume Preview</p>
                  <p className="rb-meta text-xs max-w-xs">
                    Complete all 6 steps and click{' '}
                    <span className="text-amber-400 font-semibold">🚀 Generate My Resume</span> — your
                    live preview will appear here.
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-xs rb-meta rb-steps-list rounded-2xl p-4 w-full max-w-sm">
                  {STEPS.map((step, idx) => (
                    <div key={step} className={`flex items-center gap-2 ${idx < currentStep ? 'text-emerald-400' : idx === currentStep ? 'text-amber-400' : 'rb-meta'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${idx < currentStep ? 'bg-emerald-500 text-white' : idx === currentStep ? 'bg-amber-500 text-white' : 'rb-step-inactive'}`}>
                        {idx < currentStep ? '✓' : idx + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Regenerate option after success */}
        {resumeData && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setCurrentStep(5);
                setResumeData(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold rb-subtext rb-regen-btn px-4 py-2 rounded-xl transition-all"
            >
              ↩ Regenerate with different JD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
