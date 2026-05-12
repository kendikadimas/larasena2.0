import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function HelpFaqItem({ faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg p-5 border border-[#E8E5DC] hover:border-[#D9D5CC] hover:shadow-md transition-all">
      <button
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-start justify-between gap-4"
      >
        <div className="flex-1">
          <span className="text-xs font-medium text-[#A68B6D] uppercase tracking-wide block mb-1">{faq.category}</span>
          <h3 className="text-base font-semibold text-[#3F6D5F]">{faq.question}</h3>
        </div>
        <span className="flex-shrink-0 text-[#7A9B8F] mt-0.5">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {open && (
        <div className="mt-4 pt-4 border-t border-[#EBF2EF] text-[#5F8070] text-sm leading-relaxed">
          {faq.answer}
        </div>
      )}
    </div>
  );
}
