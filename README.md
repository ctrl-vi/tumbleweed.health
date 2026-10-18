# Tumbleweed website

Next.js App Router + TypeScript + CSS Modules. Implements **layout E × 5B Quiet Sand** from the [Figma Build page](https://www.figma.com/design/1vBijyrFOCXQcupTQqFy3m?node-id=39-1632). Manrope is served locally. Public content and example conversations are prerendered; chat and partner intake are isolated interactive flows.

## Run

Requires Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. For production locally: `npm run build` then `npm start`.

## What works now

- Responsive home, three sample conversations, no-match example, SMS instructions, help/privacy, language availability, partner review, and browser demo states.
- Text Tumbleweed opens `sms:+15092069073?body=Hi`. Real-device SMS app handoff/delivery still requires testing.
- Partner form validates and reviews actual entered values. With no intake endpoint it explicitly sends nothing.
- Live chat handles sending, reply, failures/retry, duplicate-send prevention, and reset while pending. With no backend URL it shows an honest unavailable state and links to examples/SMS.
- No map, message-location feed, external font requests, analytics, or browser transcript persistence.

## Backend integration

Inspected https://github.com/Viodbrain/tumbleweed/tree/main/backend at commit `27f69a841c4f6200c66c30b48643088b25707645`.

The actual backend is **Python/FastAPI**, superseding the original PDF's TypeScript backend proposal. Its `/api/chat` accepts `{ "handle": "web:<unique-id>", "text": "..." }` and returns `{ "reply": "..." }`. Maximum input is 1,000 characters. The frontend proxies this contract through its same-origin Next.js route; secrets remain on the server. The backend's `/api/feed` contains message-derived coordinates and is intentionally not exposed on the public website.

Copy `.env.example` to `.env.local` and set:

```dotenv
TUMBLEWEED_API_URL=https://YOUR-RUNNING-FASTAPI-SERVICE
```

Use the deployed API origin, without `/api/chat`. A GitHub repository URL is not an API endpoint. No deployed backend URL or credentials were supplied during this build. The frontend does not fabricate live responses.

Optional partner intake is separate: set `PARTNER_INTAKE_URL` to a trusted HTTP endpoint accepting `{ organization, email, area, details }`; set `PARTNER_INTAKE_TOKEN` if required. It must return a successful HTTP status only after receipt, and honor `Idempotency-Key` so a retry does not create duplicate entries. The supplied FastAPI repository has no partner intake route. Entries should remain pending curator review.

## Test

```sh
npx playwright install chromium
npm run build
npm test
```

Tests start the production site on 3000, a **local fake backend** on 4010, and a connected test instance on 3001. They do not send messages to the real service. Screenshots/traces are written under ignored `test-results/`. Tests cover public accessibility, 320px reflow, reference screenshots, no-JavaScript use, keyboard navigation, form validation/recovery, chat API shape/failure/reset behavior, and request validation. No automated suite establishes full WCAG conformance or real SMS delivery.

## Design references

| Implemented view | Figma reference |
|---|---|
| Home | 39:1632 desktop / 39:1737 mobile |
| Food example | 39:1843 / 39:2027 |
| Meals example | 39:1907 / 39:2092 |
| Programs example | 39:1967 / 39:2153 |
| SMS start | 39:2214 / 39:2389 |
| No match | 39:2257 / 39:2433 |
| Help | 39:2299 / 39:2476 |
| Language | 39:2350 / 39:2528 |
| Partner form/review | 39:2568, 39:2623 / 39:2669, 39:2725 |
| Tokens/accessibility | 39:2776 |

Material 3 informs semantic roles and state hierarchy, while the selected Quiet Sand values and 4px shape treatment remain intact. The prototype's fixed viewports become naturally scrolling pages. Control outlines are stronger than decorative rules for visibility. Fonts use rem sizing to honor text enlargement. Navigation uses native links so public content works without JavaScript.

## Before public launch

- Supply and verify the deployed FastAPI origin. Exercise a real reply with the team, then actual iOS/Android SMS handoff.
- Confirm coverage, languages, provider availability, retention, deletion/contact information, and reminder policy. Current privacy text is explicitly interim.
- Implement/confirm partner intake and its review owner if collecting submissions.
- Apply durable rate limiting and abuse controls at the API gateway/backend. Origin checks are not authentication or rate limiting. Backend web handles are random identifiers, not authenticated accounts; harden session ownership before using sensitive history.
- Verify VoiceOver/NVDA and Safari/Firefox behavior. Automated Chromium results do not cover those environments.
- Review metadata: pages deliberately use `noindex` while service details are unfinished. Enable indexing only for approved public pages.
- Configure environment values in Vercel; deploy this directory as a Next.js project. Keep FastAPI on its own service. No deployment or remote repository mutation is performed by this local build.

See `tumbleweed-website-build-plan.md` for the detailed source plan.
