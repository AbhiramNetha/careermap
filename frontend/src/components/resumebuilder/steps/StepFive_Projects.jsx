import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const inputCls = 'resume-builder-input';
const textareaCls = 'resume-builder-input';
const labelCls = 'block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5';
const errorCls = 'text-red-400 text-xs mt-1';

const BLANK_PROJ = {
  name: '',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  description: '',
};

export default function StepFive_Projects({ onNext, onBack, defaultValues }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projects:
        defaultValues?.projects?.length > 0 ? defaultValues.projects : [BLANK_PROJ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'projects' });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Projects</h2>
        <p className="text-slate-500 text-xs">Showcase your best projects — personal, academic, or freelance.</p>
      </div>

      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="relative p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col gap-3"
        >
          {/* Remove */}
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(idx)}
              className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}

          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">
            Project #{idx + 1}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Project Name */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Project Name*</label>
              <input
                type="text"
                placeholder="e.g. CareerMap Platform"
                className={inputCls}
                {...register(`projects.${idx}.name`, { required: 'Required' })}
              />
              {errors.projects?.[idx]?.name && (
                <p className={errorCls}>{errors.projects[idx].name.message}</p>
              )}
            </div>

            {/* Tech Stack */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Tech Stack Used*</label>
              <input
                type="text"
                placeholder="e.g. React.js, Node.js, PostgreSQL, Docker"
                className={inputCls}
                {...register(`projects.${idx}.techStack`, { required: 'Required' })}
              />
              {errors.projects?.[idx]?.techStack && (
                <p className={errorCls}>{errors.projects[idx].techStack.message}</p>
              )}
            </div>

            {/* Live URL */}
            <div>
              <label className={labelCls}>Live URL <span className="text-slate-600 font-normal normal-case">(optional)</span></label>
              <input
                type="text"
                placeholder="https://yourproject.com"
                className={inputCls}
                {...register(`projects.${idx}.liveUrl`)}
              />
            </div>

            {/* GitHub URL */}
            <div>
              <label className={labelCls}>GitHub URL <span className="text-slate-600 font-normal normal-case">(optional)</span></label>
              <input
                type="text"
                placeholder="github.com/username/project"
                className={inputCls}
                {...register(`projects.${idx}.githubUrl`)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description*</label>
            <textarea
              rows={3}
              placeholder={'• Built a full-stack platform helping freshers identify career paths\n• Designed ATS resume checker with rules-based compatibility scores'}
              className={textareaCls}
              {...register(`projects.${idx}.description`, { required: 'Required' })}
            />
            <p className="text-slate-600 text-[10px] mt-1">Write 2-3 bullet points — AI will enhance them</p>
            {errors.projects?.[idx]?.description && (
              <p className={errorCls}>{errors.projects[idx].description.message}</p>
            )}
          </div>
        </div>
      ))}

      {/* Add Project */}
      <button
        type="button"
        onClick={() => append(BLANK_PROJ)}
        className="flex items-center gap-2 text-xs font-semibold text-emerald-400 border border-emerald-500/30 rounded-xl px-4 py-2.5 hover:bg-emerald-500/10 transition-all w-fit"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        Add Another Project
      </button>

      {/* Navigation */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-slate-900 border border-white/10 text-sm font-bold text-slate-300 hover:border-white/20 transition-all"
        >
          ← Back
        </button>
        <button
          type="submit"
          className="flex-[2] py-3 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all"
        >
          Continue — Job Description →
        </button>
      </div>
    </form>
  );
}
