'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Globe, CheckCircle2, ArrowRight, ExternalLink, Calendar, Building2, MapPin, Phone } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AiBackground } from '@/components/ui/ai-background';
import { ScrollProgress } from '@/components/ui/scroll-progress';

export default function PrivacyPage() {
  const { isDark } = useTheme();

  const sections = [
    { id: 'sec-1', number: '1', title: 'Introduction' },
    { id: 'sec-2', number: '2', title: 'Information We Collect' },
    { id: 'sec-3', number: '3', title: 'How We Use Information' },
    { id: 'sec-4', number: '4', title: 'WhatsApp & Meta Integration' },
    { id: 'sec-5', number: '5', title: 'How We Share Information' },
    { id: 'sec-6', number: '6', title: 'Data Storage and Security' },
    { id: 'sec-7', number: '7', title: 'Data Retention' },
    { id: 'sec-8', number: '8', title: 'Customer Data Responsibilities' },
    { id: 'sec-9', number: '9', title: 'Cookies & Technologies' },
    { id: 'sec-10', number: '10', title: 'International Data Transfers' },
    { id: 'sec-11', number: '11', title: 'Your Privacy Rights' },
    { id: 'sec-12', number: '12', title: 'Third-Party Services' },
    { id: 'sec-13', number: '13', title: "Children's Privacy" },
    { id: 'sec-14', number: '14', title: 'Changes to This Policy' },
    { id: 'sec-15', number: '15', title: 'Contact Information' },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans relative transition-colors duration-500 ${
      isDark ? 'bg-[#0B0B0C] text-[#F6F6F4]' : 'bg-[#FCFCFB] text-[#181818]'
    }`}>
      <ScrollProgress />
      <AiBackground isDark={isDark} />
      <Navbar ctaText="Contact Privacy" ctaHref="mailto:tangentcoreindia@gmail.com" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-xs font-mono font-bold ${
            isDark ? 'bg-[#121315] border-white/10 text-[#C7A15A]' : 'bg-[#F6F5F3] border-[#E5E3DF] text-[#B87333]'
          } shadow-sm`}>
            <ShieldCheck className="w-3.5 h-3.5 text-[#C7A15A]" />
            <span className="uppercase tracking-wider">OFFICIAL POLICY • EFFECTIVE 16 NOVEMBER 2026</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-[#181818]'}`}>
            Privacy Policy – Tangentcore
          </h1>

          <div className={`flex flex-wrap items-center justify-center gap-4 text-xs font-mono ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C7A15A]" />
              <strong>Effective Date:</strong> 16 November 2026
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#C7A15A]" />
              <strong>Last Updated:</strong> 16 November 2026
            </span>
          </div>

          <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'} max-w-2xl mx-auto`}>
            This Privacy Policy explains how Tangentcore collects, uses, stores, processes, discloses, and protects personal information when you visit our website, use our software, or interact with our services.
          </p>
        </div>

        {/* Layout Grid: Quick Navigation & Full Policy Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quick Table of Contents Sidebar */}
          <aside className="lg:col-span-4 sticky top-24 space-y-4 order-2 lg:order-1">
            <div className={`p-6 rounded-3xl border ${
              isDark ? 'bg-[#121315] border-white/10' : 'bg-white border-[#E5E3DF]'
            } shadow-xl space-y-4`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C7A15A]" />
                <h3 className={`text-xs font-mono uppercase font-black tracking-wider ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
                  Table of Contents
                </h3>
              </div>
              <nav className="space-y-1 text-xs max-h-[70vh] overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
                      isDark 
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold text-[#C7A15A] w-5">{sec.number}.</span>
                    <span className="truncate font-medium">{sec.title}</span>
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/10 text-xs">
                <span className="font-bold block mb-1">Privacy Questions?</span>
                <p className={`text-[11px] mb-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Reach out directly to our compliance team.
                </p>
                <a
                  href="mailto:tangentcoreindia@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#C7A15A] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" /> tangentcoreindia@gmail.com
                </a>
              </div>
            </div>
          </aside>

          {/* Full Policy Content Card */}
          <div className={`lg:col-span-8 p-6 sm:p-10 rounded-3xl border ${
            isDark ? 'bg-[#121315] border-white/10' : 'bg-white border-[#E5E3DF]'
          } space-y-10 shadow-2xl leading-relaxed text-sm order-1 lg:order-2`}>

            {/* 1. Introduction */}
            <section id="sec-1" className="space-y-3 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A] flex items-center gap-2">
                <span>1. Introduction</span>
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Welcome to Tangentcore (<strong>"Tangentcore"</strong>, <strong>"we"</strong>, <strong>"our"</strong>, or <strong>"us"</strong>).
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Tangentcore provides a business communication and automation platform that enables businesses to connect their WhatsApp Business Accounts, communicate with customers, manage conversations, create message templates, run campaigns, and automate business communication using the WhatsApp Business Platform.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                This Privacy Policy explains how we collect, use, store, process, disclose, and protect personal information when you visit our website, use our software, or interact with our services.
              </p>
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'} text-xs font-medium`}>
                By using our services, you acknowledge that you have read this Privacy Policy.
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section id="sec-2" className="space-y-5 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                2. Information We Collect
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We may collect the following categories of information:
              </p>

              {/* 2.1 */}
              <div className="space-y-2 pl-3 border-l-2 border-[#C7A15A]/40">
                <h3 className="font-bold text-sm text-white dark:text-white">
                  2.1 Account and Business Information
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  When you register for Tangentcore, we may collect:
                </p>
                <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
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

              {/* 2.2 */}
              <div className="space-y-2 pl-3 border-l-2 border-[#C7A15A]/40">
                <h3 className="font-bold text-sm text-white dark:text-white">
                  2.2 WhatsApp Business Information
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  When you connect your WhatsApp Business Account through Meta's authorization and Embedded Signup process, we may access and process information such as:
                </p>
                <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                  <li>WhatsApp Business Account ID (WABA ID)</li>
                  <li>Business Portfolio information made available through authorized permissions</li>
                  <li>WhatsApp phone numbers and phone number IDs</li>
                  <li>WhatsApp Business profile information</li>
                  <li>Message templates and their approval status</li>
                  <li>Account configuration and integration information</li>
                  <li>Webhook events and delivery statuses</li>
                </ul>
                <p className={`text-xs italic ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  We access this information only to provide the services and functionality authorized by the connected business.
                </p>
              </div>

              {/* 2.3 */}
              <div className="space-y-2 pl-3 border-l-2 border-[#C7A15A]/40">
                <h3 className="font-bold text-sm text-white dark:text-white">
                  2.3 Customer and Communication Information
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  Depending on the features used by your business, we may process:
                </p>
                <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                  <li>Customer names and phone numbers</li>
                  <li>WhatsApp messages and conversation history</li>
                  <li>Message attachments and media</li>
                  <li>Message delivery and read statuses</li>
                  <li>Customer contact lists</li>
                  <li>Campaign information</li>
                  <li>Customer support records</li>
                  <li>Automation and workflow data</li>
                </ul>
                <p className={`text-xs font-semibold ${isDark ? 'text-amber-300/90' : 'text-amber-800'}`}>
                  Businesses using Tangentcore are responsible for ensuring that they have the necessary permissions, notices, and lawful basis to communicate with their customers and share relevant information with our platform.
                </p>
              </div>

              {/* 2.4 */}
              <div className="space-y-2 pl-3 border-l-2 border-[#C7A15A]/40">
                <h3 className="font-bold text-sm text-white dark:text-white">
                  2.4 Technical and Usage Information
                </h3>
                <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                  We may automatically collect:
                </p>
                <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                  <li>IP addresses</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Login timestamps</li>
                  <li>Application usage activity</li>
                  <li>Error logs</li>
                  <li>API request logs</li>
                  <li>Security and diagnostic information</li>
                </ul>
              </div>
            </section>

            {/* 3. How We Use Information */}
            <section id="sec-3" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                3. How We Use Information
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We use collected information for the following purposes:
              </p>
              <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                {[
                  'To create and manage user accounts.',
                  'To provide WhatsApp Business Platform integration.',
                  'To connect and manage authorized WhatsApp Business Accounts.',
                  'To send and receive messages through the WhatsApp Business Platform.',
                  'To manage WhatsApp message templates.',
                  'To provide customer communication dashboards.',
                  'To support campaign management and automation features.',
                  'To provide analytics and reporting.',
                  'To process subscriptions and payments.',
                  'To provide technical support.',
                  'To maintain platform security and prevent unauthorized access.',
                  'To comply with applicable legal obligations.',
                  'To improve our services and user experience.',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A15A] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. WhatsApp and Meta Platform Integration */}
            <section id="sec-4" className="space-y-4 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                4. WhatsApp and Meta Platform Integration
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Tangentcore integrates with Meta's WhatsApp Business Platform and related Meta services.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                When a business connects its WhatsApp Business Account to Tangentcore, the business authorizes the relevant integration and permissions through Meta's official authorization process.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Depending on the permissions granted, our platform may access business information, WhatsApp account information, phone number details, message templates, and messaging data.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We use this information to provide WhatsApp-related functionality requested by the connected business.
              </p>
              <p className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Tangentcore does not claim ownership of customers' WhatsApp Business Accounts or their underlying business information.
              </p>
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-white dark:text-white">
                  Your use of WhatsApp services is also subject to Meta's applicable terms and policies:
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://www.facebook.com/privacy/policy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#C7A15A] hover:underline font-mono"
                  >
                    <span>Meta Privacy Policy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://www.whatsapp.com/legal/business-terms/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#C7A15A] hover:underline font-mono"
                  >
                    <span>WhatsApp Business Terms</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </section>

            {/* 5. How We Share Information */}
            <section id="sec-5" className="space-y-4 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                5. How We Share Information
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We may share information with the following categories of service providers when necessary to operate our platform:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-white text-sm">5.1 Meta Platforms</h3>
                  <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                    We exchange relevant information with Meta to facilitate WhatsApp Business Account authorization, messaging, template management, and webhook functionality.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-white text-sm">5.2 Infrastructure and Hosting Providers</h3>
                  <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                    We may use third-party infrastructure providers for Cloud hosting, Database management, File storage, Application deployment, and Monitoring & security.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-white text-sm">5.3 Payment Service Providers</h3>
                  <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                    Where applicable, payment providers may process billing and subscription transactions.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-white text-sm">5.4 Legal and Regulatory Authorities</h3>
                  <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                    We may disclose information when required by applicable law, regulation, court order, or valid legal process.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                  <h3 className="font-bold text-white text-sm">5.5 Business Transfers</h3>
                  <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                    Information may be transferred as part of a merger, acquisition, restructuring, or sale of business assets, subject to applicable legal requirements.
                  </p>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border font-bold text-center ${
                isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
              }`}>
                We do not sell personal information to third parties.
              </div>
            </section>

            {/* 6. Data Storage and Security */}
            <section id="sec-6" className="space-y-4 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                6. Data Storage and Security
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We implement reasonable technical and organizational safeguards designed to protect information against unauthorized access, disclosure, alteration, loss, and misuse.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Depending on the services and infrastructure used, safeguards may include:
              </p>
              <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                <li>Access controls and authentication</li>
                <li>Secure API communication</li>
                <li>Encryption in transit</li>
                <li>Protected credential and token storage</li>
                <li>Database access restrictions</li>
                <li>Security monitoring</li>
                <li>Backup and recovery procedures</li>
              </ul>
              <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                Access to information is limited to authorized personnel and service providers who require it to perform their responsibilities.
              </p>
              <p className={`text-xs italic ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                No electronic storage or transmission system can be guaranteed to be completely secure.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section id="sec-7" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                7. Data Retention
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We retain personal information only for as long as reasonably necessary to:
              </p>
              <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                <li>Provide our services.</li>
                <li>Maintain business and account records.</li>
                <li>Fulfil contractual obligations.</li>
                <li>Resolve disputes.</li>
                <li>Meet legal and regulatory requirements.</li>
                <li>Protect the security of our platform.</li>
              </ul>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                When information is no longer required, we will delete, anonymize, or securely dispose of it, subject to applicable legal obligations and legitimate retention requirements.
              </p>
              <p className={`text-xs font-semibold ${isDark ? 'text-[#C7A15A]' : 'text-[#B87333]'}`}>
                Customers may request deletion of their accounts and associated information, subject to applicable requirements.
              </p>
            </section>

            {/* 8. Customer Data and Business Responsibilities */}
            <section id="sec-8" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                8. Customer Data and Business Responsibilities
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Businesses using Tangentcore remain responsible for the personal information they collect from their own customers.
              </p>
              <div className={`p-4 rounded-2xl border space-y-2 text-xs ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="font-bold text-white dark:text-white">Businesses must:</div>
                <ul className={`list-disc pl-5 space-y-1 ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                  <li>Obtain appropriate consent or other lawful authorization where required.</li>
                  <li>Provide suitable privacy notices to their customers.</li>
                  <li>Follow applicable WhatsApp messaging and opt-in requirements.</li>
                  <li>Avoid sending unlawful, misleading, or unsolicited communications.</li>
                  <li>Ensure that customer information is used for legitimate business purposes.</li>
                  <li>Respond to privacy requests concerning information they control.</li>
                </ul>
              </div>
              <p className={`text-xs italic ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                Tangentcore processes customer information as necessary to provide the services requested by its business customers.
              </p>
            </section>

            {/* 9. Cookies and Similar Technologies */}
            <section id="sec-9" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                9. Cookies and Similar Technologies
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Our website and platform may use cookies and similar technologies to:
              </p>
              <ul className={`list-disc pl-5 space-y-1 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                <li>Maintain login sessions.</li>
                <li>Remember user preferences.</li>
                <li>Improve application functionality.</li>
                <li>Understand website usage.</li>
                <li>Support security and performance monitoring.</li>
              </ul>
              <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                Users may manage cookies through their browser settings. Disabling certain cookies may affect some platform functionality.
              </p>
            </section>

            {/* 10. International Data Transfers */}
            <section id="sec-10" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                10. International Data Transfers
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Depending on our hosting infrastructure and third-party service providers, information may be processed or stored in countries outside the user's country of residence.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Where applicable, we take reasonable steps to ensure that such transfers comply with relevant data protection requirements.
              </p>
            </section>

            {/* 11. Your Privacy Rights */}
            <section id="sec-11" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                11. Your Privacy Rights
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Subject to applicable laws, users may have the right to:
              </p>
              <ul className={`grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs ${isDark ? 'text-[#D4D4D4]' : 'text-slate-700'}`}>
                {[
                  'Request access to their personal information.',
                  'Request correction of inaccurate information.',
                  'Request deletion of personal information.',
                  'Withdraw consent where processing is based on consent.',
                  'Raise concerns regarding the handling of personal information.',
                  'Request information about how their data is processed.',
                ].map((right, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C7A15A] shrink-0 mt-0.5" />
                    <span>{right}</span>
                  </li>
                ))}
              </ul>
              <p className={`text-xs ${isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}`}>
                To exercise these rights, contact us using the details provided below.
              </p>
              <p className={`text-xs italic ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                If you are an end customer of a business using Tangentcore, you may also need to contact that business directly regarding information it controls.
              </p>
            </section>

            {/* 12. Third-Party Services */}
            <section id="sec-12" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                12. Third-Party Services
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Our platform may contain integrations or links to third-party services, including Meta platforms, hosting providers, payment providers, and other business tools.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                These services may have their own privacy policies and data processing practices. Tangentcore is not responsible for the independent privacy practices of third-party services.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We encourage users to review the privacy policies of the relevant third-party providers.
              </p>
            </section>

            {/* 13. Children's Privacy */}
            <section id="sec-13" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                13. Children's Privacy
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Tangentcore is designed for business use and is not intended for children under the age of 18.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We do not knowingly collect personal information directly from children under 18 for account registration. If we become aware that such information has been collected inappropriately, we will take reasonable steps to address it in accordance with applicable law.
              </p>
            </section>

            {/* 14. Changes to This Privacy Policy */}
            <section id="sec-14" className="space-y-3 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                14. Changes to This Privacy Policy
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                We may update this Privacy Policy periodically to reflect changes in our services, business operations, technology, or legal requirements.
              </p>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                Updated versions will be published on our website with a revised effective date. We encourage users to review this page periodically.
              </p>
            </section>

            {/* 15. Contact Information */}
            <section id="sec-15" className="space-y-4 border-t border-white/10 pt-8 scroll-mt-28">
              <h2 className="text-xl font-extrabold text-[#C7A15A]">
                15. Contact Information
              </h2>
              <p className={isDark ? 'text-[#B7B7B5]' : 'text-[#5C5C5C]'}>
                For questions, requests, or concerns regarding this Privacy Policy or our data handling practices, please contact:
              </p>

              <div className={`p-6 rounded-2xl border space-y-3 text-xs font-mono ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#C7A15A]" />
                  <span className="text-white dark:text-white font-bold">Company:</span>
                  <span>Tangentcore</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C7A15A]" />
                  <span className="text-white dark:text-white font-bold">Website:</span>
                  <a href="https://tangentcore.in" target="_blank" rel="noopener noreferrer" className="text-[#C7A15A] hover:underline">
                    https://tangentcore.in
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C7A15A]" />
                  <span className="text-white dark:text-white font-bold">Email:</span>
                  <a href="mailto:tangentcoreindia@gmail.com" className="text-[#C7A15A] hover:underline">
                    tangentcoreindia@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C7A15A]" />
                  <span className="text-white dark:text-white font-bold">Registered Business Address:</span>
                  <span>Tangentcore, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C7A15A]" />
                  <span className="text-white dark:text-white font-bold">Country:</span>
                  <span>India</span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-center text-xs font-medium ${
                isDark ? 'bg-white/5 border-white/10 text-zinc-400' : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}>
                By using Tangentcore's services, you acknowledge that you have read and understood this Privacy Policy.
              </div>
            </section>

          </div>
        </div>

      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
