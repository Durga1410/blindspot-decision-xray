import React from 'react';
import { Eye, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900 bg-[#06080d] py-10 mt-16 text-slate-500 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-500" />
          <span className="font-mono text-slate-300 font-semibold">BLINDSPOT</span>
          <span className="text-slate-600">·</span>
          <span>Decision X-Ray System</span>
        </div>

        <p className="text-center sm:text-right text-[11px] text-slate-500">
          "Don't ask AI what to decide. Ask AI what you're failing to see."
        </p>
      </div>
    </footer>
  );
};
