import { useForm } from 'react-hook-form';

const inputCls =
  'w-full bg-slate-950/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-emerald-500 transition-all placeholder-slate-600';

const labelCls = 'block text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1.5';
const errorCls = 'text-red-400 text-xs mt-1';
const requiredMark = <span className="text-red-400 ml-0.5">*</span>;

export default function StepOne_Personal({ onNext, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: defaultValues?.name || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      location: defaultValues?.location || '',
      linkedin: defaultValues?.linkedin || '',
      github: defaultValues?.github || '',
      portfolio: defaultValues?.portfolio || '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-0.5">Personal Information</h2>
        <p className="text-slate-500 text-xs">Fill in your contact and profile details.</p>
      </div>

      {/* Name */}
      <div>
        <label className={labelCls}>Full Name {requiredMark}</label>
        <input
          type="text"
          placeholder="e.g. Abhiram Netha"
          className={inputCls}
          {...register('name', { required: 'Full name is required' })}
        />
        {errors.name && <p className={errorCls}>{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label className={labelCls}>Email Address {requiredMark}</label>
          <input
            type="email"
            placeholder="you@example.com"
            className={inputCls}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>Phone Number {requiredMark}</label>
          <input
            type="text"
            placeholder="+91 98765 43210"
            className={inputCls}
            {...register('phone', { required: 'Phone is required' })}
          />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>

        {/* Location */}
        <div>
          <label className={labelCls}>City, State {requiredMark}</label>
          <input
            type="text"
            placeholder="e.g. Hyderabad, Telangana"
            className={inputCls}
            {...register('location', { required: 'Location is required' })}
          />
          {errors.location && <p className={errorCls}>{errors.location.message}</p>}
        </div>

        {/* LinkedIn */}
        <div>
          <label className={labelCls}>LinkedIn URL {requiredMark}</label>
          <input
            type="text"
            placeholder="linkedin.com/in/yourprofile"
            className={inputCls}
            {...register('linkedin', { required: 'LinkedIn URL is required' })}
          />
          {errors.linkedin && <p className={errorCls}>{errors.linkedin.message}</p>}
        </div>

        {/* GitHub */}
        <div>
          <label className={labelCls}>GitHub URL {requiredMark}</label>
          <input
            type="text"
            placeholder="github.com/yourusername"
            className={inputCls}
            {...register('github', { required: 'GitHub URL is required' })}
          />
          {errors.github && <p className={errorCls}>{errors.github.message}</p>}
        </div>

        {/* Portfolio */}
        <div>
          <label className={labelCls}>Portfolio URL <span className="text-slate-600 font-normal normal-case">(optional)</span></label>
          <input
            type="text"
            placeholder="yourportfolio.com"
            className={inputCls}
            {...register('portfolio')}
          />
        </div>
      </div>

      {/* Navigation */}
      <button
        type="submit"
        className="w-full mt-2 py-3 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
      >
        Continue — Education →
      </button>
    </form>
  );
}
