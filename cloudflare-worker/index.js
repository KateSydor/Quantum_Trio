/**
 * Blue-Green Router — Cloudflare Worker
 *
 * ACTIVE_SLOT is a wrangler [vars] variable ("blue" or "green").
 * GitHub Actions updates it by redeploying this Worker via:
 *   npx wrangler deploy --var ACTIVE_SLOT:green
 *
 * Worker URL: https://recipeai-router.<your-subdomain>.workers.dev
 */

const BLUE_URL  = 'https://recipeai-blue.onrender.com';
const GREEN_URL = 'https://recipeai-green.onrender.com';

export default {
  async fetch(request, env) {
    const activeSlot = env.ACTIVE_SLOT ?? 'blue';
    const upstream   = activeSlot === 'green' ? GREEN_URL : BLUE_URL;

    const url       = new URL(request.url);
    const targetUrl = `${upstream}${url.pathname}${url.search}`;

    const proxiedRequest = new Request(targetUrl, {
      method:   request.method,
      headers:  request.headers,
      body:     ['GET', 'HEAD'].includes(request.method) ? null : request.body,
      redirect: 'follow',
    });

    const response = await fetch(proxiedRequest);

    const headers = new Headers(response.headers);
    headers.set('X-Active-Slot', activeSlot);

    return new Response(response.body, {
      status:     response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
