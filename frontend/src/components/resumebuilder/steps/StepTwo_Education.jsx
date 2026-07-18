import { useForm, useFieldArray } from 'react-hook-form';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

const inputCls = 'resume-builder-input';
const labelCls = 'block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5';
const errorCls = 'text-red-400 text-xs mt-1';

const BLANK_EDU = {
  degree: '',
  specialization: '',
  college: '',
  cgpa: '',
  year: '',
};

export default function StepTwo_Education({ onNext, onBack, defaultValues }) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      education:
        defaultValues?.education?.length > 0 ? defaultValues.education : [BLANK_EDU],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Education</h2>
        <p className="text-slate-500 text-xs">Add your degrees — most recent first.</p>
      </div>

      {fields.map((field, idx) => (
        <div
          key={field.id}
          className="relative p-4 bg-slate-950/40 border border-white/5 rounded-2xl flex flex-col gap-3"
        >
          {/* Remove button */}
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
            Degree #{idx + 1}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Degree */}
            <div>
              <label className={labelCls}>Degree*</label>
              <input
                type="text"
                placeholder="e.g. B.Tech, BCA, MCA"
                className={inputCls}
                {...register(`education.${idx}.degree`, { required: 'Required' })}
              />
              {errors.education?.[idx]?.degree && (
                <p className={errorCls}>{errors.education[idx].degree.message}</p>
              )}
            </div>

            {/* Specialization */}
            <div>
              <label className={labelCls}>Specialization*</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                className={inputCls}
                {...register(`education.${idx}.specialization`, { required: 'Required' })}
              />
              {errors.education?.[idx]?.specialization && (
                <p className={errorCls}>{errors.education[idx].specialization.message}</p>
              )}
            </div>

            {/* College */}
            <div className="sm:col-span-2">
              <label className={labelCls}>College / University*</label>
              <input
                type="text"
                placeholder="e.g. JNTU Hyderabad"
                className={inputCls}
                {...register(`education.${idx}.college`, { required: 'Required' })}
              />
              {errors.education?.[idx]?.college && (
                <p className={errorCls}>{errors.education[idx].college.message}</p>
              )}
            </div>

            {/* CGPA */}
            <div>
              <label className={labelCls}>CGPA / Percentage*</label>
              <input
                type="text"
                placeholder="e.g. 8.5 or 85%"
                className={inputCls}
                {...register(`education.${idx}.cgpa`, { required: 'Required' })}
              />
              {errors.education?.[idx]?.cgpa && (
                <p className={errorCls}>{errors.education[idx].cgpa.message}</p>
              )}
            </div>

            {/* Graduation Year */}
            <div>
              <label className={labelCls}>Graduation Year*</label>
              <input
                type="text"
                placeholder="e.g. 2026"
                className={inputCls}
                {...register(`education.${idx}.year`, { required: 'Required' })}
              />
              {errors.education?.[idx]?.year && (
                <p className={errorCls}>{errors.education[idx].year.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add Another */}
      <button
        type="button"
        onClick={() => append(BLANK_EDU)}
        className="flex items-center gap-2 text-xs font-semibold text-emerald-400 border border-emerald-500/30 rounded-xl px-4 py-2.5 hover:bg-emerald-500/10 transition-all w-fit"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        Add Another Degree
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
          Continue — Skills →
        </button>
      </div>
    </form>
  );
}
