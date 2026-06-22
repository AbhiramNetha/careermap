import { ArrowDownTrayIcon } from '@heroicons/react/24/solid';

export default function DownloadButtons({ onDownload, loading }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onDownload('pdf')}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-emerald-400 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
      >
        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
        Download PDF
      </button>

      <button
        onClick={() => onDownload('docx')}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 hover:border-white/20 hover:text-white transition-all disabled:opacity-50"
      >
        <ArrowDownTrayIcon className="w-3.5 h-3.5" />
        Download DOCX
      </button>
    </div>
  );
}
