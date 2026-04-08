#!/usr/bin/env node

import https from 'node:https';
import tls from 'node:tls';

const apexHost = process.env.VERIFY_APEX_HOST?.trim() || 'ivo-tech.com';
const wwwHost = process.env.VERIFY_WWW_HOST?.trim() || `www.${apexHost}`;
const tlsSampleSize = Number(process.env.VERIFY_TLS_SAMPLES || 12);

function headerString(headers, name) {
  const value = headers[name.toLowerCase()];
  if (Array.isArray(value)) return value.join('; ');
  return typeof value === 'string' ? value : '';
}

function request({ hostname, path = '/', rejectUnauthorized = true }) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path,
        method: 'HEAD',
        timeout: 10_000,
        rejectUnauthorized
      },
      (res) => {
        resolve({
          statusCode: res.statusCode ?? 0,
          headers: res.headers
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`timeout for https://${hostname}${path}`));
    });
    req.end();
  });
}

function requestBody({ hostname, path = '/', rejectUnauthorized = true }) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname,
        path,
        method: 'GET',
        timeout: 10_000,
        rejectUnauthorized
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode ?? 0,
            headers: res.headers,
            body: Buffer.concat(chunks).toString('utf8')
          });
        });
      }
    );

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy(new Error(`timeout for https://${hostname}${path}`));
    });
    req.end();
  });
}

function readCertificate(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect(
      {
        host: hostname,
        servername: hostname,
        port: 443,
        rejectUnauthorized: false
      },
      () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        resolve(cert);
      }
    );

    socket.setTimeout(10_000);
    socket.on('timeout', () => {
      socket.destroy(new Error(`tls timeout for ${hostname}`));
    });
    socket.on('error', reject);
  });
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function asDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.valueOf()) ? null : d;
}

async function run() {
  console.log(`[verify-live] apex=${apexHost} www=${wwwHost}`);

  const apexRoot = await request({ hostname: apexHost, path: '/' });
  expect(apexRoot.statusCode === 200, `Expected apex / to be 200, got ${apexRoot.statusCode}`);
  const apexCsp = headerString(apexRoot.headers, 'content-security-policy');
  const apexCspReportOnly = headerString(apexRoot.headers, 'content-security-policy-report-only');
  expect(apexCsp.length > 0, 'Expected apex / to include content-security-policy');
  expect(apexCspReportOnly.length > 0, 'Expected apex / to include content-security-policy-report-only');
  expect(apexCsp.includes("script-src-attr 'none'"), "Expected apex CSP to include script-src-attr 'none'");
  expect(
    apexCspReportOnly.includes('report-uri /api/security/csp-report'),
    'Expected apex CSP report-only to include report-uri /api/security/csp-report'
  );
  expect(
    !apexCsp.includes('fonts.googleapis.com') && !apexCsp.includes('www.google.com'),
    'Expected apex CSP to keep Google sources scoped away from root'
  );

  const apexPizza = await request({ hostname: apexHost, path: '/pizza/index.html' });
  expect(apexPizza.statusCode === 200, `Expected apex /pizza/index.html to be 200, got ${apexPizza.statusCode}`);
  const pizzaCsp = headerString(apexPizza.headers, 'content-security-policy');
  expect(
    pizzaCsp.includes('fonts.googleapis.com') && pizzaCsp.includes('www.google.com'),
    'Expected pizza CSP to include scoped Google sources (fonts + maps frame)'
  );

  const wwwRoot = await request({ hostname: wwwHost, path: '/', rejectUnauthorized: false });
  expect(wwwRoot.statusCode === 308, `Expected www / to be 308, got ${wwwRoot.statusCode}`);
  expect(wwwRoot.headers.location === `https://${apexHost}/`, `Unexpected www redirect target: ${wwwRoot.headers.location}`);

  const wwwRobots = await request({ hostname: wwwHost, path: '/robots.txt', rejectUnauthorized: false });
  expect(wwwRobots.statusCode === 308, `Expected www /robots.txt to be 308, got ${wwwRobots.statusCode}`);
  expect(
    wwwRobots.headers.location === `https://${apexHost}/robots.txt`,
    `Unexpected www robots redirect target: ${wwwRobots.headers.location}`
  );

  const wwwSitemap = await request({ hostname: wwwHost, path: '/sitemap.xml', rejectUnauthorized: false });
  expect(wwwSitemap.statusCode === 308, `Expected www /sitemap.xml to be 308, got ${wwwSitemap.statusCode}`);
  expect(
    wwwSitemap.headers.location === `https://${apexHost}/sitemap.xml`,
    `Unexpected www sitemap redirect target: ${wwwSitemap.headers.location}`
  );

  const apexRobots = await requestBody({ hostname: apexHost, path: '/robots.txt' });
  expect(apexRobots.statusCode === 200, `Expected apex /robots.txt to be 200, got ${apexRobots.statusCode}`);
  expect(apexRobots.body.includes('Sitemap:'), 'Expected apex /robots.txt to include "Sitemap:"');

  const apexSitemap = await requestBody({ hostname: apexHost, path: '/sitemap.xml' });
  expect(apexSitemap.statusCode === 200, `Expected apex /sitemap.xml to be 200, got ${apexSitemap.statusCode}`);
  expect(apexSitemap.body.includes('<urlset'), 'Expected apex /sitemap.xml to contain <urlset');

  let success = 0;
  let failed = 0;
  let certNotAfter = null;
  let certIssuer = '';

  for (let i = 0; i < tlsSampleSize; i += 1) {
    try {
      const cert = await readCertificate(wwwHost);
      const notAfter = asDate(cert.valid_to);
      if (!notAfter || notAfter.valueOf() < Date.now()) {
        failed += 1;
      } else {
        success += 1;
      }

      certNotAfter = cert.valid_to ?? certNotAfter;
      certIssuer = cert.issuer?.CN ?? certIssuer;
    } catch {
      failed += 1;
    }
  }

  console.log(
    `[verify-live] www tls checks: success=${success} fail=${failed} issuer=${certIssuer || 'n/a'} notAfter=${certNotAfter || 'n/a'}`
  );

  if (success === 0) {
    throw new Error('All TLS samples for www failed. Certificate or edge propagation is broken.');
  }

  if (failed > 0) {
    console.warn('[verify-live] Warning: some TLS checks still fail. Likely edge propagation still in progress.');
  }

  console.log('[verify-live] ok');
}

run().catch((error) => {
  console.error(`[verify-live] failed: ${error.message}`);
  process.exit(1);
});
