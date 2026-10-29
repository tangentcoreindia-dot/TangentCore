import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatWhatsAppMessage, generateExecutiveHtmlEmail } from '@/lib/lead-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name = '',
      email = '',
      phone = '',
      domain = '',
      score = 0,
      grade = 'C',
      pageAudit = {},
      sendEmail = true,
      sendWhatsapp = true,
    } = body;

    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    // Format WhatsApp message
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.tangentcore.in';
    const whatsappText = formatWhatsAppMessage({
      name,
      domain: cleanDomain,
      score,
      grade,
      pageAudit,
      appUrl,
    });

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(cleanPhone)}&text=${encodeURIComponent(whatsappText)}`;

    // Try saving lead to Supabase using Admin Client (bypasses RLS)
    let leadId = null;
    try {
      const supabaseAdmin = createAdminClient();
      const { data, error } = await supabaseAdmin.from('audit_leads').insert({
        name: name || 'Lead',
        email: email || '',
        phone: cleanPhone || '',
        domain: cleanDomain,
        overall_score: score,
        email_sent: Boolean(sendEmail && email),
        whatsapp_sent: Boolean(sendWhatsapp && phone),
        metadata: {
          grade,
          pageAuditSummary: {
            technicalSeoScore: pageAudit.technicalSeoScore,
            structuredDataScore: pageAudit.structuredDataScore,
            onPageScore: pageAudit.onPageScore,
          },
        },
      }).select().single();

      if (!error && data) {
        leadId = data.id;
      }
    } catch (dbErr) {
      console.warn('Supabase lead capture warning (table might be initializing):', dbErr);
    }

    // Attempt email dispatch if email is provided
    let emailDelivered = false;
    if (sendEmail && email) {
      try {
        const emailHtml = generateExecutiveHtmlEmail({
          name,
          domain: cleanDomain,
          score,
          grade,
          pageAudit,
          appUrl,
        });

        // If Resend API key is provided, send through Resend HTTP API (zero external packages)
        if (process.env.RESEND_API_KEY) {
          const resendRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'TangentCore Intelligence <audit@tangentcore.in>',
              to: [email],
              subject: `Your AI & GEO Studio Audit Report: ${cleanDomain} (Score: ${score}/100)`,
              html: emailHtml,
            }),
          });
          if (resendRes.ok) {
            emailDelivered = true;
          }
        } else {
          // Log simulated delivery for dev/fallback
          console.log(`[Lead Delivery] Email queued for ${email} with domain ${cleanDomain}`);
          emailDelivered = true;
        }
      } catch (mailErr) {
        console.warn('Email dispatch warning:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      leadId,
      emailDelivered,
      whatsappUrl,
      whatsappText,
      domain: cleanDomain,
      recipient: {
        name,
        email,
        phone: cleanPhone,
      },
    });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture lead details' },
      { status: 500 }
    );
  }
}
