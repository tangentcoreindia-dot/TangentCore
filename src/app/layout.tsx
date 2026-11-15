import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'TangentCore — Multi-Model AI Search Optimization & GEO Platform',
  description: 'TangentCore is a Scalezix Venture entity and an enterprise AI Search Optimization & GEO platform under scalezix.com. Analyze, audit, and optimize website Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) across ChatGPT, Gemini, Claude & Perplexity at tangentcore.in.',
  verification: {
    google: [
      '1Pi90OpG7fMdyDpdXEsy8htYND4h-eWxgBoSqJsbqhY',
      'b2foknT-us0J8fiUh-Ts70-AFMa-z9--AaQ8fXKvc4I',
    ],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem('tangentcore-theme');
                  var pref = localStorage.getItem('tc-theme-pref');
                  if (pref === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased bg-[#FCFCFB] text-[#181818] dark:bg-[#0B0B0C] dark:text-[#F6F6F4] min-h-screen overflow-x-hidden w-full max-w-full" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
