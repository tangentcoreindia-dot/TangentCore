'use client';

import { useState } from 'react';
import { X, Copy, Check, Code, ShieldCheck, Terminal, Layers, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/components/theme-provider';

interface SdkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

export function SdkInstallModal({ isOpen, onClose, domain }: SdkInstallModalProps) {
  const { isDark } = useTheme();
  const [platform, setPlatform] = useState<'html' | 'nextjs' | 'shopify' | 'wordpress'>('html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://tangentcore.in';
  const cleanDomain = domain || 'yourbrand.com';

  const snippets = {
    html: `<!-- TangentCore Autonomous GEO Runtime SDK -->\n<script src="${appUrl}/api/sdk/tangent-runtime.js?site=${cleanDomain}" async></script>`,
    nextjs: `// In your app/layout.tsx or pages/_document.tsx\nimport Script from 'next/script';\n\n<Script\n  src="${appUrl}/api/sdk/tangent-runtime.js?site=${cleanDomain}"\n  strategy="afterInteractive"\n/>`,
    shopify: `<!-- Paste inside theme.liquid right before </head> -->\n<script src="${appUrl}/api/sdk/tangent-runtime.js?site=${cleanDomain}" async></script>`,
    wordpress: `<!-- Paste in Appearance > Theme File Editor > header.php before </head> -->\n<script src="${appUrl}/api/sdk/tangent-runtime.js?site=${cleanDomain}" async></script>`
  };

  const currentSnippet = snippets[platform];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    toast.success('SDK snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
        isDark ? 'bg-[#181818] border-[#2A2A2A] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute right-5 top-5 p-2 rounded-xl transition-colors ${
            isDark ? 'text-zinc-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
          }`}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-500 font-extrabold uppercase tracking-widest">
            <Code className="w-4 h-4" /> 1-Line Deployable SDK
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Install TangentCore GEO Runtime
          </h3>
          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
            isDark ? 'text-zinc-300' : 'text-slate-600'
          }`}>
            Paste this snippet into your site’s &lt;head&gt;. All approved schema and metadata fixes will be injected autonomously without needing a developer or git commit.
          </p>
        </div>

        {/* Platform Selector */}
        <div className={`mt-6 flex gap-2 border-b pb-3 overflow-x-auto no-scrollbar ${
          isDark ? 'border-white/10' : 'border-slate-200'
        }`}>
          {(['html', 'nextjs', 'shopify', 'wordpress'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono uppercase transition-all shrink-0 border ${
                platform === p
                  ? isDark
                    ? 'bg-white text-black border-white font-black'
                    : 'bg-slate-900 text-white border-slate-900 font-black'
                  : isDark
                  ? 'text-zinc-400 border-transparent hover:text-white hover:bg-white/5'
                  : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p === 'nextjs' ? 'Next.js' : p}
            </button>
          ))}
        </div>

        {/* Code Snippet Box */}
        <div className={`mt-4 relative rounded-2xl border p-4 sm:p-5 font-mono text-xs ${
          isDark
            ? 'border-white/10 bg-[#0C0D10] text-emerald-400'
            : 'border-slate-300 bg-slate-950 text-emerald-400'
        }`}>
          <pre className="overflow-x-auto whitespace-pre-wrap pr-16 leading-relaxed max-h-40 scrollbar-thin">
            {currentSnippet}
          </pre>
          <button
            onClick={handleCopy}
            className="absolute right-3.5 top-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-sans font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Features Checklist */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700 font-medium'}>Deterministic JSON-LD only</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700 font-medium'}>Zero impact on page load speed</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700 font-medium'}>1-click instant rollback anytime</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className={isDark ? 'text-zinc-300' : 'text-slate-700 font-medium'}>Automated live post-deploy verification</span>
          </div>
        </div>

        {/* Done Button */}
        <div className="mt-7 flex justify-end">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
