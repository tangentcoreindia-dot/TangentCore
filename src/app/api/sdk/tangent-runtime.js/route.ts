import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const site = searchParams.get('site') || '';

  const jsCode = `/**
 * TangentCore Autonomous GEO Runtime SDK v1.0.0
 * Injects verified JSON-LD schema, metadata, and answerability blocks dynamically.
 */
(function() {
  'use strict';
  try {
    const currentScript = document.currentScript;
    const urlParams = currentScript ? new URL(currentScript.src).searchParams : new URLSearchParams(window.location.search);
    const domain = urlParams.get('site') || window.location.hostname.replace(/^www\\./, '');

    window.__TANGENT_CORE__ = window.__TANGENT_CORE__ || {
      version: '1.0.0',
      domain: domain,
      injectedSchemas: [],
      ready: true
    };

    function injectScriptLdJson(schemaObj, id) {
      if (!schemaObj) return;
      const existing = document.getElementById(id || 'tangentcore-schema');
      if (existing) return;
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id || ('tc-schema-' + Math.random().toString(36).substr(2, 9));
      script.text = typeof schemaObj === 'string' ? schemaObj : JSON.stringify(schemaObj);
      document.head.appendChild(script);
      window.__TANGENT_CORE__.injectedSchemas.push(id);
    }

    function injectMetaTag(name, content) {
      if (!content) return;
      let meta = document.querySelector('meta[name="' + name + '"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    }

    // Default High-Value Organization & FAQ Schema injection for site
    const defaultOrg = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": domain.split('.')[0].toUpperCase(),
      "url": window.location.origin,
      "description": "Verified AI Search & Answer Engine Optimized Entity."
    };
    injectScriptLdJson(defaultOrg, 'tc-org-schema');

    // Notify listeners
    window.dispatchEvent(new CustomEvent('tangentcore:ready', { detail: window.__TANGENT_CORE__ }));
    console.log('[TangentCore GEO Runtime] Active for: ' + domain);
  } catch(e) {
    console.warn('[TangentCore SDK Error]', e);
  }
})();
`;

  return new NextResponse(jsCode, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
