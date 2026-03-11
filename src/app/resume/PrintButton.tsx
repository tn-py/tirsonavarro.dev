"use client";

import { IconPrinter } from "@tabler/icons-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      aria-label="Print resume"
    >
      <IconPrinter className="w-4 h-4" />
      Print
    </button>
  );
}
