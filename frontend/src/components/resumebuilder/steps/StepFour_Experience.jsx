import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const inputCls = 'resume-builder-input';
const textareaCls = 'resume-builder-input';
const labelCls = 'block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5';
const errorCls = 'text-red-400 text-xs mt-1';

const BLANK_EXP = {
  company: '',
  role: '',
  startDate: '',
  endDate: '',
  currentlyWorking: false,
  responsibilities: '',
};

export default function StepFour_Experience({ onNext, onBack, defaultValues }) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      experience:
        defaultValues?.experience?.length > 0
          ? defaultValues.experience
          : [], // experience is optional — start with empty
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });
  const watchedExp = watch('experience');

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Work Experience</h2>
        <p className="text-slate-500 text-xs">Add internships, jobs, or freelance work. Skip if none.</p>
      </div>

      {fields.length === 0 && (
        <div className="text-center py-6 text-slate-600 text-sm border border-dashed border-slate-800 rounded-2xl">
          No experience added yet. Click below to add.
        </div>
      )}

      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="relative p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col gap-3"
        >
          {/* Remove */}
          <button
            type="button"
            onClick={() => remove(idx)}
            className="absolute top-3 right-3 text-slate-600 hover:text-red-400 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>

          <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wide">
            Experience #{idx + 1}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Company */}
            <div>
              <label className={labelCls}>Company Name*</label>
              <input
                type="text"
                placeholder="e.g. Tech Solutions Inc."
                className={inputCls}
                {...register(`experience.${idx}.company`, { required: 'Required' })}
              />
              {errors.experience?.[idx]?.company && (
                <p className={errorCls}>{errors.experience[idx].company.message}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className={labelCls}>Role / Designation*</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer Intern"
                className={inputCls}
                {...register(`experience.${idx}.role`, { required: 'Required' })}
              />
              {errors.experience?.[idx]?.role && (
                <p className={errorCls}>{errors.experience[idx].role.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className={labelCls}>Start Date*</label>
              <input
                type="text"
                placeholder="e.g. May 2025"
                className={inputCls}
                {...register(`experience.${idx}.startDate`, { required: 'Required' })}
              />
              {errors.experience?.[idx]?.startDate && (
                <p className={errorCls}>{errors.experience[idx].startDate.message}</p>
              )}
            </div>

            {/* End Date */}
            <div>
              <label className={labelCls}>End Date</label>
              <input
                type="text"
                placeholder="e.g. July 2025"
                className={inputCls}
                disabled={watchedExp?.[idx]?.currentlyWorking}
                {...register(`experience.${idx}.endDate`)}
              />
            </div>
          </div>

          {/* Currently Working */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`cur-${idx}`}
              className="rounded accent-emerald-500"
              {...register(`experience.${idx}.currentlyWorking`)}
            />
            <label htmlFor={`cur-${idx}`} className="text-slate-400 text-xs cursor-pointer">
              Currently Working Here
            </label>
          </div>

          {/* Responsibilities */}
          <div>
            <label className={labelCls}>Key Responsibilities*</label>
            <textarea
              rows={4}
              placeholder={'• Developed React dashboard improving load time by 30%\n• Designed PostgreSQL schemas for user authentication\n• Collaborated with team to ship REST APIs on schedule'}
              className={textareaCls}
              {...register(`experience.${idx}.responsibilities`, { required: 'Required' })}
            />
            <p className="text-slate-600 text-[10px] mt-1">Use • bullet points — AI will refine them</p>
            {errors.experience?.[idx]?.responsibilities && (
              <p className={errorCls}>{errors.experience[idx].responsibilities.message}</p>
            )}
          </div>
        </div>
      ))}

      {/* Add Experience */}
      <button
        type="button"
        onClick={() => append(BLANK_EXP)}
        className="flex items-center gap-2 text-xs font-semibold text-emerald-400 border border-emerald-500/30 rounded-xl px-4 py-2.5 hover:bg-emerald-500/10 transition-all w-fit"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        Add Experience
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
          Continue — Projects →
        </button>
      </div>
    </form>
  );
}
