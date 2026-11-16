'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Mail, Globe, ExternalLink, Calendar, Building2, MapPin, ChevronRight 
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AiBackground } from '@/components/ui/ai-background';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function PrivacyPage() {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('sec-1');

  const sections = [
    { id: 'sec-1', number: '01', title: 'Introduction' },
    { id: 'sec-2', number: '02', title: 'Information We Collect' },
    { id: 'sec-3', number: '03', title: 'How We Use Information' },
    { id: 'sec-4', number: '04', title: 'WhatsApp & Meta Platform' },
    { id: 'sec-5', number: '05', title: 'How We Share Information' },
    { id: 'sec-6', number: '06', title: 'Data Storage & Security' },
    { id: 'sec-7', number: '07', title: 'Data Retention' },
    { id: 'sec-8', number: '08', title: 'Customer Responsibilities' },
    { id: 'sec-9', number: '09', title: 'Cookies & Technologies' },
    { id: 'sec-10', number: '10', title: 'International Transfers' },
    { id: 'sec-11', number: '11', title: 'Your Privacy Rights' },
    { id: 'sec-12', number: '12', title: 'Third-Party Services' },
    { id: 'sec-13', number: '13', title: "Children's Privacy" },
    { id: 'sec-14', number: '14', title: 'Changes to This Policy' },
    { id: 'sec-15', number: '15', title: 'Contact Information' },
  ];

  // Auto-highlight sidebar as user scrolls through each section level
  useEffect(() => {
    const handleScroll = () => {
      // If user reaches near the bottom of the page, lock to the last section
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 250;
      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1].id);
        return;
      }

      const triggerPoint = 200; // Trigger line from top of viewport
      let currentId = sections[0].id;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerPoint) {
            currentId = sections[i].id;
          }
        }
      }

      setActiveSection(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Ensure active sidebar nav item is smoothly scrolled into view inside the sidebar if needed
  useEffect(() => {
    const activeBtn = document.getElementById(`nav-${activeSection}`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-500 ${
      isDark ? 'bg-[#0B0B0C] text-[#F6F6F4]' : 'bg-[#FCFCFB] text-[#181818]'
    }`}>
      <ScrollProgress />
      <AiBackground isDark={isDark} />
      <Navbar ctaText="Contact Privacy" ctaHref="mailto:tangentcoreindia@gmail.com" />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
          
          {/* ================= DESKTOP STICKY LEFT SIDEBAR (HIDDEN ON MOBILE / TABLET) ================= */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-28 self-start">
            <div className={`rounded-3xl border p-5 xl:p-6 shadow-xl ${
              isDark 
                ? 'bg-[#121315]/95 backdrop-blur-xl border-white/10 text-white' 
                : 'bg-white/95 backdrop-blur-xl border-[#E5E3DF] text-[#181818]'
            } flex flex-col max-h-[calc(100vh-8.5rem)] select-none`}>
              
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b pb-3 mb-3 border-slate-200 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C7A15A]" />
                  <h3 className={`text-xs font-mono uppercase font-black tracking-wider ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
                    Privacy Navigation
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">15 Articles</span>
              </div>

              {/* 15 Section Links (Highlights automatically as you scroll to each level) */}
              <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
                {sections.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      id={`nav-${sec.id}`}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all text-xs xl:text-sm font-medium ${
                        isActive
                          ? isDark
                            ? 'bg-[#C7A15A]/20 text-[#C7A15A] font-bold border border-[#C7A15A]/40 shadow-sm'
                            : 'bg-[#B87333]/15 text-[#B87333] font-bold border border-[#B87333]/30 shadow-sm'
                          : isDark
                          ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`font-mono text-[11px] font-bold ${isActive ? (isDark ? 'text-[#C7A15A]' : 'text-[#B87333]') : 'text-zinc-400'}`}>
                          {sec.number}
                        </span>
                        <span className="truncate">{sec.title}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[#C7A15A]" />}
                    </button>
                  );
                })}
              </nav>

              {/* Sidebar Support Link */}
              <div className={`mt-3 pt-3 border-t border-slate-200 dark:border-white/10 shrink-0 text-xs font-mono flex items-center justify-between ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}>
                <span>Inquiries:</span>
                <a 
                  href="mailto:tangentcoreindia@gmail.com" 
                  className="text-[#C7A15A] font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Mail className="w-3 h-3" /> tangentcoreindia@gmail.com
                </a>
              </div>

            </div>
          </aside>

          {/* ================= MAIN DOCUMENT PANE (FULL WIDTH ON MOBILE, SPACIOUS ON DESKTOP) ================= */}
          <div className="flex-1 min-w-0 max-w-4xl space-y-12">
            
            {/* Document Header */}
            <div className="space-y-4 border-b border-slate-200 dark:border-white/10 pb-8">
              <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-mono font-bold ${
                isDark ? 'bg-[#121315] border-white/10 text-[#C7A15A]' : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#B87333]'
              } shadow-sm`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#C7A15A]" />
                <span className="uppercase tracking-wider">OFFICIAL POLICY • EFFECTIVE 16 NOVEMBER 2026</span>
              </div>

              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#181818]'}`}>
                Privacy Policy – Tangentcore
              </h1>

              <div className={`flex flex-wrap items-center gap-4 text-sm font-mono ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C7A15A]" />
                  <strong>Effective Date:</strong> 16 November 2026
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#C7A15A]" />
                  <strong>Last Updated:</strong> 16 November 2026
                </span>
              </div>
            </div>

            {/* Document Content Sections (Large, High-Legibility Typography) */}
            <div className="space-y-12 text-base sm:text-lg leading-relaxed">
              
              {/* 1. Introduction */}
              <section id="sec-1" className="space-y-4 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  1. Introduction
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Welcome to Tangentcore (&quot;Tangentcore&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;).
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Tangentcore provides a business communication and automation platform that enables businesses to connect their WhatsApp Business Accounts, communicate with customers, manage conversations, create message templates, run campaigns, and automate business communication using the WhatsApp Business Platform.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  This Privacy Policy explains how we collect, use, store, process, disclose, and protect personal information when you visit our website, use our software, or interact with our services.
                </p>
                <div className={`p-4 rounded-xl border text-sm sm:text-base font-medium ${
                  isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  By using our services, you acknowledge that you have read this Privacy Policy.
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section id="sec-2" className="space-y-6 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  2. Information We Collect
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We may collect the following categories of information:
                </p>

                <div className="space-y-5">
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      2.1 Account and Business Information
                    </h3>
                    <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-700'}>
                      When you register for Tangentcore, we may collect:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                      <li>Full name</li>
                      <li>Business or company name</li>
                      <li>Email address</li>
                      <li>Phone number</li>
                      <li>Business address</li>
                      <li>Account login credentials</li>
                      <li>Business profile information</li>
                      <li>Billing and subscription information</li>
                    </ul>
                  </div>

                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      2.2 WhatsApp Business Information
                    </h3>
                    <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-700'}>
                      When you connect your WhatsApp Business Account through Meta&apos;s authorization and Embedded Signup process, we may access and process information such as:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                      <li>WhatsApp Business Account ID (WABA ID)</li>
                      <li>Business Portfolio information made available through authorized permissions</li>
                      <li>WhatsApp phone numbers and phone number IDs</li>
                      <li>WhatsApp Business profile information</li>
                      <li>Message templates and their approval status</li>
                      <li>Account configuration and integration information</li>
                      <li>Webhook events and delivery statuses</li>
                    </ul>
                    <p className="text-sm font-medium text-[#C7A15A] pt-2">
                      We access this information only to provide the services and functionality authorized by the connected business.
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      2.3 Customer and Communication Information
                    </h3>
                    <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-700'}>
                      Depending on the features used by your business, we may process:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                      <li>Customer names and phone numbers</li>
                      <li>WhatsApp messages and conversation history</li>
                      <li>Message attachments and media</li>
                      <li>Message delivery and read statuses</li>
                      <li>Customer contact lists</li>
                      <li>Campaign information</li>
                      <li>Customer support records</li>
                      <li>Automation and workflow data</li>
                    </ul>
                    <p className="text-sm italic text-zinc-500 dark:text-zinc-400 pt-2">
                      Businesses using Tangentcore are responsible for ensuring that they have the necessary permissions, notices, and lawful basis to communicate with their customers and share relevant information with our platform.
                    </p>
                  </div>

                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-3`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                      2.4 Technical and Usage Information
                    </h3>
                    <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-700'}>
                      We may automatically collect:
                    </p>
                    <ul className="list-disc list-inside space-y-1.5 pl-2">
                      <li>IP addresses</li>
                      <li>Browser type and version</li>
                      <li>Device information and operating system</li>
                      <li>Login timestamps</li>
                      <li>Application usage activity</li>
                      <li>Error logs and API request logs</li>
                      <li>Security and diagnostic information</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 3. How We Use Information */}
              <section id="sec-3" className="space-y-6 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  3. How We Use Information
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We use collected information for the following purposes:
                </p>
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <ul className="list-disc list-inside space-y-2">
                    <li>To create and manage user accounts.</li>
                    <li>To provide WhatsApp Business Platform integration.</li>
                    <li>To connect and manage authorized WhatsApp Business Accounts.</li>
                    <li>To send and receive messages through the WhatsApp Business Platform.</li>
                    <li>To manage WhatsApp message templates.</li>
                    <li>To provide customer communication dashboards.</li>
                    <li>To support campaign management and automation features.</li>
                    <li>To provide analytics and reporting.</li>
                    <li>To process subscriptions and payments.</li>
                    <li>To provide technical support.</li>
                    <li>To maintain platform security and prevent unauthorized access.</li>
                    <li>To comply with applicable legal obligations.</li>
                    <li>To improve our services and user experience.</li>
                  </ul>
                </div>
              </section>

              {/* 4. WhatsApp and Meta Platform Integration */}
              <section id="sec-4" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  4. WhatsApp and Meta Platform Integration
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Tangentcore integrates with Meta&apos;s WhatsApp Business Platform and related Meta services.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  When a business connects its WhatsApp Business Account to Tangentcore, the business authorizes the relevant integration and permissions through Meta&apos;s official authorization process.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Depending on the permissions granted, our platform may access business information, WhatsApp account information, phone number details, message templates, and messaging data.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We use this information to provide WhatsApp-related functionality requested by the connected business.
                </p>
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Tangentcore does not claim ownership of customers&apos; WhatsApp Business Accounts or their underlying business information.
                </p>
                <div className={`p-5 rounded-2xl border space-y-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="font-medium text-sm">Your use of WhatsApp services is also subject to Meta&apos;s applicable terms and policies:</p>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1 text-sm font-mono">
                    <a 
                      href="https://www.facebook.com/privacy/policy/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#C7A15A] hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      Meta Privacy Policy <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="hidden sm:inline text-zinc-400">•</span>
                    <a 
                      href="https://www.whatsapp.com/legal/business-terms/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#C7A15A] hover:underline inline-flex items-center gap-1 font-bold"
                    >
                      WhatsApp Business Terms <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </section>

              {/* 5. How We Share Information */}
              <section id="sec-5" className="space-y-6 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  5. How We Share Information
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We may share information with the following categories of service providers when necessary to operate our platform:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                    <h4 className="font-bold text-slate-900 dark:text-white">5.1 Meta Platforms</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      We exchange relevant information with Meta to facilitate WhatsApp Business Account authorization, messaging, template management, and webhook functionality.
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                    <h4 className="font-bold text-slate-900 dark:text-white">5.2 Infrastructure and Hosting Providers</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      We may use third-party infrastructure providers for cloud hosting, database management, file storage, application deployment, monitoring, and security.
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                    <h4 className="font-bold text-slate-900 dark:text-white">5.3 Payment Service Providers</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Where applicable, payment providers may process billing and subscription transactions.
                    </p>
                  </div>

                  <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                    <h4 className="font-bold text-slate-900 dark:text-white">5.4 Legal and Regulatory Authorities</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      We may disclose information when required by applicable law, regulation, court order, or valid legal process.
                    </p>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                  <h4 className="font-bold text-slate-900 dark:text-white">5.5 Business Transfers</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Information may be transferred as part of a merger, acquisition, restructuring, or sale of business assets, subject to applicable legal requirements.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[#C7A15A] font-bold text-center">
                  We do not sell personal information to third parties.
                </div>
              </section>

              {/* 6. Data Storage and Security */}
              <section id="sec-6" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  6. Data Storage and Security
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We implement reasonable technical and organizational safeguards designed to protect information against unauthorized access, disclosure, alteration, loss, and misuse.
                </p>
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                  <p className="font-semibold text-slate-900 dark:text-white">Safeguards include:</p>
                  <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base">
                    <li>Access controls and authentication</li>
                    <li>Secure API communication and encryption in transit</li>
                    <li>Protected credential and token storage</li>
                    <li>Database access restrictions</li>
                    <li>Security monitoring and logging</li>
                    <li>Backup and recovery procedures</li>
                  </ul>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Access to information is limited to authorized personnel and service providers who require it to perform their responsibilities. No electronic storage or transmission system can be guaranteed to be completely secure.
                </p>
              </section>

              {/* 7. Data Retention */}
              <section id="sec-7" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  7. Data Retention
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We retain personal information only for as long as reasonably necessary to:
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-4">
                  <li>Provide our services.</li>
                  <li>Maintain business and account records.</li>
                  <li>Fulfil contractual obligations.</li>
                  <li>Resolve disputes.</li>
                  <li>Meet legal and regulatory requirements.</li>
                  <li>Protect the security of our platform.</li>
                </ul>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  When information is no longer required, we will delete, anonymize, or securely dispose of it, subject to applicable legal obligations and legitimate retention requirements.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Customers may request deletion of their accounts and associated information, subject to applicable requirements.
                </p>
              </section>

              {/* 8. Customer Data and Business Responsibilities */}
              <section id="sec-8" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  8. Customer Data and Business Responsibilities
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Businesses using Tangentcore remain responsible for the personal information they collect from their own customers.
                </p>
                <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} space-y-2`}>
                  <p className="font-semibold text-slate-900 dark:text-white">Businesses must:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Obtain appropriate consent or other lawful authorization where required.</li>
                    <li>Provide suitable privacy notices to their customers.</li>
                    <li>Follow applicable WhatsApp messaging and opt-in requirements.</li>
                    <li>Avoid sending unlawful, misleading, or unsolicited communications.</li>
                    <li>Ensure that customer information is used for legitimate business purposes.</li>
                    <li>Respond to privacy requests concerning information they control.</li>
                  </ul>
                </div>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Tangentcore processes customer information as necessary to provide the services requested by its business customers.
                </p>
              </section>

              {/* 9. Cookies and Similar Technologies */}
              <section id="sec-9" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  9. Cookies and Similar Technologies
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Our website and platform may use cookies and similar technologies to maintain login sessions, remember user preferences, improve application functionality, understand website usage, and support security and performance monitoring.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Users may manage cookies through their browser settings. Disabling certain cookies may affect some platform functionality.
                </p>
              </section>

              {/* 10. International Data Transfers */}
              <section id="sec-10" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  10. International Data Transfers
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Depending on our hosting infrastructure and third-party service providers, information may be processed or stored in countries outside the user&apos;s country of residence.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Where applicable, we take reasonable steps to ensure that such transfers comply with relevant data protection requirements.
                </p>
              </section>

              {/* 11. Your Privacy Rights */}
              <section id="sec-11" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  11. Your Privacy Rights
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Subject to applicable laws, users may have the right to request access to their personal information, request correction of inaccurate information, request deletion of personal information, withdraw consent where processing is based on consent, raise concerns regarding the handling of personal information, and request information about how their data is processed.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  To exercise these rights, contact us using the details provided below. If you are an end customer of a business using Tangentcore, you may also need to contact that business directly regarding information it controls.
                </p>
              </section>

              {/* 12. Third-Party Services */}
              <section id="sec-12" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  12. Third-Party Services
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Our platform may contain integrations or links to third-party services, including Meta platforms, hosting providers, payment providers, and other business tools. These services may have their own privacy policies and data processing practices.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Tangentcore is not responsible for the independent privacy practices of third-party services. We encourage users to review the privacy policies of the relevant third-party providers.
                </p>
              </section>

              {/* 13. Children's Privacy */}
              <section id="sec-13" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  13. Children&apos;s Privacy
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Tangentcore is designed for business use and is not intended for children under the age of 18. We do not knowingly collect personal information directly from children under 18 for account registration.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  If we become aware that such information has been collected inappropriately, we will take reasonable steps to address it in accordance with applicable law.
                </p>
              </section>

              {/* 14. Changes to This Privacy Policy */}
              <section id="sec-14" className="space-y-5 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  14. Changes to This Privacy Policy
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  We may update this Privacy Policy periodically to reflect changes in our services, business operations, technology, or legal requirements.
                </p>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  Updated versions will be published on our website with a revised effective date. We encourage users to review this page periodically.
                </p>
              </section>

              {/* 15. Contact Information */}
              <section id="sec-15" className="space-y-6 border-t border-slate-200 dark:border-white/10 pt-10 scroll-mt-28">
                <h2 className="text-2xl sm:text-3xl font-black text-[#C7A15A] tracking-tight">
                  15. Contact Information
                </h2>
                <p className={isDark ? 'text-[#D4D4D2]' : 'text-slate-800'}>
                  For questions, requests, or concerns regarding this Privacy Policy or our data handling practices, please contact:
                </p>

                <div className={`p-6 sm:p-8 rounded-3xl border space-y-4 text-sm sm:text-base font-mono ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-[#C7A15A] font-bold w-36 shrink-0 flex items-center gap-2">
                      <Building2 className="w-4 h-4" /> Company:
                    </span>
                    <span className="text-slate-900 dark:text-white font-semibold">Tangentcore</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-[#C7A15A] font-bold w-36 shrink-0 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Website:
                    </span>
                    <a href="https://tangentcore.in/" target="_blank" rel="noopener noreferrer" className="text-[#C7A15A] hover:underline font-bold">
                      https://tangentcore.in/
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-[#C7A15A] font-bold w-36 shrink-0 flex items-center gap-2">
                      <Mail className="w-4 h-4" /> Email:
                    </span>
                    <a href="mailto:tangentcoreindia@gmail.com" className="text-[#C7A15A] hover:underline font-bold">
                      tangentcoreindia@gmail.com
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                    <span className="text-[#C7A15A] font-bold w-36 shrink-0 flex items-center gap-2 mt-0.5">
                      <MapPin className="w-4 h-4" /> Address:
                    </span>
                    <span className="leading-relaxed text-slate-800 dark:text-zinc-200 font-sans text-sm sm:text-base font-medium">
                      Plot No. 60, Ground Floor, Rameshwar Nagar, sr 80, Gandhidham, Kachchh, Gujarat – 370205, India
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-[#C7A15A] font-bold w-36 shrink-0 flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Country:
                    </span>
                    <span className="text-slate-900 dark:text-white font-semibold">India</span>
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border text-center text-xs sm:text-sm font-medium ${
                  isDark ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-slate-100 border-slate-300 text-slate-600'
                }`}>
                  © {new Date().getFullYear()} Tangentcore. By using Tangentcore&apos;s services, you acknowledge that you have read and understood this Privacy Policy.
                </div>
              </section>

            </div>
          </div>

        </div>
      </main>

      {/* ================= PROPER FULL-WIDTH FOOTER (AT THE VERY BOTTOM OF THE WEBSITE) ================= */}
      <Footer isDark={isDark} />

    </div>
  );
}
