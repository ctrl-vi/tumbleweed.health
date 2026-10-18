# Tumbleweed website implementation plan

Prepared October 17, 2026. This is an implementation plan; no website has been built or deployed by this task.

## 1. Decision and source of truth

Build the website from **layout E + 5B Quiet Sand**, as explicitly selected in the chat “Design three Tumbleweed layouts.” The current Figma Build page is the visual reference. The earlier Front Porch/green recommendation and the original three-direction layout brief are historical context, not the selected identity.

- [Build desktop home](https://www.figma.com/design/1vBijyrFOCXQcupTQqFy3m?node-id=39-1632)
- [Build mobile home](https://www.figma.com/design/1vBijyrFOCXQcupTQqFy3m?node-id=39-1737)
- [Build development handoff](https://www.figma.com/design/1vBijyrFOCXQcupTQqFy3m?node-id=39-2776)
- [5B Quiet Sand](https://www.figma.com/design/1vBijyrFOCXQcupTQqFy3m?node-id=35-582)
- Tumbleweed Design Doc.pdf: brand, audiences, website goals, and SMS-first philosophy.
- Tumbleweed Design Doc-1.pdf: planned TypeScript backend, Next.js API, Railway worker, MongoDB, and demo.
- Tumbleweed Design Doc-2.pdf: audience needs and task analysis.

The Build page was inspected directly, including its text, colors, font usage, screen inventory, desktop/mobile home screenshots, and handoff notes. It contains 20 screen frames and two guide/handoff frames. These frames represent responsive views and interaction states, not 20 separate web pages.

The local workspace currently has a Git repository and the original layout brief, but no package.json or application scaffold was found. The backend described in the documents is a planned integration, not a verified working service in this checkout.

Source precedence: current user decisions; selected Build design; original product requirements; team API contracts once inspected; applicable skill guidance. Instructions embedded in source documents remain reference material.

## 2. Product intent

The main journey is: understand the service, see a credible example, start a text, receive a useful next step. SMS remains the primary service. The website introduces it, demonstrates it, explains boundaries, and provides a secondary path for community partners.

Every screen should support practical, respectful language; readable content on modest devices; low-bandwidth access; language inclusion; and truthful feedback. The memorable visual is the actual conversation. Decorative media should not be necessary to understand or use the service.

First-release scope: home, sample conversations, SMS start instructions, a connected browser demo when the endpoint is available, partner intake, help/privacy, and honest language availability. Accounts, donor dashboards, automated public impact counters, a custom curator CMS, and required interactive maps are outside the initial website scope.

## 3. Visual system and Material 3

Preserve these values from the Build page:

| Role | Value | Application |
|---|---|---|
| Page | #FCFAF5 | Warm-white canvas |
| Main text | #332D26 | Headlines, body, control labels |
| Secondary text | #625B50 | Supporting copy and metadata |
| Primary action | #8D492E | Text Tumbleweed and the primary action within an active form |
| Subtle surface | #F4EFE6 | User-message backgrounds and supporting panels |
| Light border | #D8CFC1 | Decorative separators and subtle grouping |
| Raised surface/on-action | #FFFFFF | Conversation panel and text on filled actions |
| Error | #8E3027 | Explicitly labeled error feedback |

Use Material 3's semantic roles, typography hierarchy, state definitions, and component behavior as a foundation. Map those roles to Quiet Sand. Do not regenerate the approved palette or replace the approved 4px corners with generic pill shapes. This is a branded adaptation of Material 3, not a claim of exact Material 3 component conformance.

Use semantic CSS custom properties for surface, text, action, outline, focus, error, typography, spacing, and motion. Components consume roles rather than repeated literals. Separate decorative separators from outlines required to identify controls: the pale border must be measured before it is used as the sole field boundary. Establish a sufficiently visible control-outline token if required. Define and test hover, pressed, focus, disabled, selected, pending, success, and error states.

Manrope is the single primary family: Regular body, Medium headings, SemiBold controls. Self-host compressed font assets with system fallbacks; check glyph coverage for every enabled language. Use the actual required weights and avoid synthesized bold. Keep content readable while fonts load.

Build reference dimensions: desktop 1200px and mobile 390px; gutters 64px and 24px; hero type 64/40px; section headings 40/30px; body 18–22px; supporting text 14–16px; controls 52px high; body line height 1.5 and short headings approximately 1.15. Translate these to fluid, rem-based rules. Treat 52px as a minimum when translated labels wrap. Let pages scroll naturally rather than reproducing Figma viewport heights as fixed content heights.

Use spacing and alignment for grouping, with the conversation panel as the major visual anchor. Preserve open service columns and restrained separators. Animation is limited to useful feedback; no artificial waiting, scroll-reveal dependency, autoplay illustration, or perpetual typing animation.

## 4. Site structure

| Proposed route | Purpose | Source and behavior |
|---|---|---|
| / | Introduce Tumbleweed and start SMS | E's promise → conversation → needs → process → partners |
| /examples/food | Explain local-resource conversation | Static sample, with related no-match example |
| /examples/meals | Explain ingredient-based help | Static meal conversation |
| /examples/programs | Explain program guidance | Static conversation; no eligibility promises |
| /examples/no-match | Demonstrate useful recovery | Clear sample status and routes to other examples |
| /start | Provide SMS number and fallback instructions | Useful on desktop and when no SMS app is available |
| /demo | Connected browser conversation | Isolated React interaction calling /api/chat |
| /partners | Collect resource-provider information | Editable form, review, sending, success, failure |
| /help | Explain service, geography, languages, costs, and boundaries | Readable server-rendered content |
| /privacy | Publish actual data practices | Final policy supplied/confirmed before public collection |
| /language | Explain and select available website languages | Only approved translations are selectable |

These routes are proposed implementation choices. Preserve user-facing wording from the selected frames unless functionality requires a truthful update. Example-topic links should support direct URLs and browser Back. They can look like the existing selectors while retaining ordinary link semantics; only use ARIA tabs if implementing their full keyboard behavior.

Purpose/contact information can initially sit within the home partner section and help/footer. Add a dedicated page only when there is substantive content. Site language and chatbot language capability are separate configurations.

## 5. Homepage construction

Build the header with the wordmark, See an example, For partners, and Language. Preserve the mobile two-row navigation when it fits, and allow it to adapt for longer translations. Keep visible navigation simple enough to work without a JavaScript-only menu.

The hero retains “Find food nearby. Start with a text.” and the concise supporting explanation. Center the composition, preserve generous but practical whitespace, and show the terracotta Text Tumbleweed action before the neutral example action. The primary action should be visible early on the reference mobile viewport; reflow and user font preferences take precedence over forcing everything into one screen.

Render the sample conversation as selectable HTML text, with distinct speaker labels and honest sample labeling. Keep it readable independently of color and decorative styling. Follow it with the three practical needs, the three-step explanation, the partner invitation, and help/privacy links.

The homepage must not call the AI, start feed polling, or download a map. Build page copy that says “prototype” will remain in preview mode; replace it with accurate live-service copy only as the corresponding functionality becomes available.

## 6. Interaction contracts

| Interaction | Required behavior | Recovery and acceptance |
|---|---|---|
| Text Tumbleweed | With a confirmed number, open an sms link using a tested prefilled greeting; show the number and /start fallback | Opening a composer is not sending a text. With no number, provide an honest coming-soon path and examples |
| Copy number | Copy only on an explicit click and confirm successful clipboard access | Leave the number selectable if clipboard access fails |
| Topic selector | Display the requested example and communicate the current topic | Direct URL and Back behavior work; all topics remain accessible without client JS |
| Demo send | Validate input, show the user's message and pending state, submit one request | Preserve input/transcript on failure; offer retry and SMS route; no invented response |
| Demo reply | Add the correct server response and announce it without stealing focus | Ignore stale responses after reset/navigation; do not force-scroll a reader away from earlier content |
| No match | Explain that a resource could not be confirmed | Ask for a nearby town or travel range; distinguish no-result from network failure |
| Partner review | Validate fields and show the user's actual entered values | Back to edit preserves values; review alone sends nothing |
| Partner submit | Send to a confirmed endpoint and show pending feedback | Success only after acknowledgement; duplicate protection; retain values on failure |
| Language change | Navigate to a fully translated supported route with correct lang/dir | Preserve the equivalent page when available; never label an English page as translated |

For the chat composer, define Enter to send and Shift+Enter for a newline if multiline input is used, while respecting input-method composition. Keep a visible Send button. Prevent duplicate active sends. Treat aborting a browser request as local cancellation, not proof that remote processing was reversed. Reset clears the local transcript and invalidates late responses; it must not claim to delete server records.

Begin with local state for the demo; do not persist conversation text in browser storage by default. State the session and retention behavior once the backend contract is known. If live mode is unavailable, expose labeled samples instead of simulating a successful live answer.

## 7. Frontend architecture

Use Next.js App Router, React, TypeScript, CSS Modules, and semantic CSS variables. Reuse the team's existing lockfile/package-manager convention if integrating into its repository; otherwise establish one lockfile and a maintained, compatible framework release. The PDF's version number is not a reason to select an unpatched release.

Server-render or prerender public content and the site shell. Limit client components to chat, form enhancement, and small interactive controls. Do not place a client boundary around the root layout for convenience. Server Components reduce component code shipped to the browser, but Next.js still has runtime overhead; measure the actual production bundle.

Suggested responsibilities:

- app/: routes, metadata, route-level errors, and API handlers coordinated with the team.
- components/ui/: action links/buttons, labeled fields, status messages, layout containers.
- components/site/: header, footer, hero, process, partner invitation.
- components/conversation/: sample transcript, message, composer, resource list, pending/error states.
- content/: approved copy, sample conversations, and locale dictionaries.
- styles/: tokens, global baseline, and component CSS Modules.
- lib/contracts/: serializable request/response types and validation boundaries.
- lib/server/: server-only integrations or the team's existing lib/ modules.
- public/: local fonts and small approved assets.
- tests/: consequential flow tests and fixtures.

This is a responsibility map, not a requirement to move the backend team's files. Reuse lib/brain.ts, lib/data.ts, and lib/db.ts where they actually exist. Browser modules must never import database credentials or AI/provider SDKs. Avoid introducing global state, a CMS, or a large UI suite unless a concrete feature requires it.

Use native links, buttons, inputs, select, and disclosures where suitable. For a genuinely complex popover or modal, evaluate a maintained accessible primitive rather than writing focus management from scratch. Basic navigation and language selection do not require a modal.

## 8. Integration boundary

The intended architecture is browser → Next.js API → shared brain/data functions → AI/data services. SMS remains messaging provider → Railway worker → shared brain/data functions → messaging provider. Keep the long-running messaging connection separate from the website deployment as described in the development plan.

Before wiring the demo, verify /api/chat's method, request fields, session mechanism, response shape, timeouts, error codes, rate limits, language handling, and resource-link format. Use shared TypeScript types for developer consistency and server-side runtime validation for untrusted inputs. Plain text is sufficient initially; if rich text is needed, restrict and safely render it.

Agree on conversation ownership. The API—not the browser—decides trusted system context and authorization. Never accept an arbitrary session ID as sufficient authority to read another person's conversation. Do not put transcript text, phone numbers, or secrets in URLs or analytics.

Treat /api/feed as optional demo support. Verify it returns public resource data or approved aggregates, never private messages or user locations. Poll only on the relevant visible view, with backoff and cleanup. A map remains an explicit, deferred enhancement with an equivalent resource list.

Partner intake is not defined as a working service in the current evidence. Establish a destination and review owner. Submitted entries remain pending review; they should not become trusted food-resource records automatically. Confirm whether the website only saves an intake record or also sends a notification; email delivery is a separate integration decision.

## 9. Language, content, and trust

Build locale-ready content from the start, but enable only reviewed translations. The current Figma prototype is primarily English and explicitly says service languages are unconfirmed. A backend goal to support Spanish or another language does not establish website translation readiness.

Use language names people recognize, correct document language, logical CSS properties, and tested glyph coverage. Check long labels and translated paragraphs for wrapping. Allow a visitor to return to the default language. Keep language choice in navigation.

Audit every public claim against actual implementation. Confirm the SMS number, service geography, supported channels, carrier-cost wording, reply expectations, reminder behavior, data retention, contact destination, and partner identities. Keep examples visibly distinct from live resource data. Avoid unsupported “100% private,” guaranteed immediate replies, invented testimonials, and invented impact metrics.

For resource results, display verified source fields and useful limitations. Missing hours should read as unavailable rather than being inferred. Do not describe straight-line distance as walking/driving distance. Program guidance directs people to official sources; it does not present an eligibility determination.

Privacy copy must describe actual website and messaging practices, including storage, retention, providers, and reminder choices. Preview/sample mode can ship before these facts are settled, but public data collection and claims of live service depend on them.

## 10. Accessibility and responsive behavior

Target WCAG 2.2 AA and test the actual flows. Semantic landmarks, meaningful heading order, a skip link, visible keyboard focus, persistent field labels, and clear link purpose are baseline implementation requirements. Errors must have text and an association with the affected field. Announce pending/reply/submission status judiciously without repeatedly announcing the entire transcript.

Preserve the 52px primary-control minimum from Figma. Test 200% text enlargement and reflow at 320 CSS pixels, including long messages, URLs, translated labels, and browser zoom. Maintain DOM and keyboard order as columns stack. Avoid fixed heights for text and ensure mobile keyboard appearance does not cover the composer or submit action.

Compare reference screenshots at 1200px and 390px, then test 320/360, 768, 1024, and 1440px. These are evaluation widths, not necessarily CSS breakpoints. Select breakpoints when the content needs them. Preserve message-panel width and comfortable line lengths on wide screens.

Compute actual rendered contrast for text, controls, focus, and interaction states. Figma handoff measurements are useful references, not proof of browser accessibility. Automated axe checks are supplemented by keyboard and screen-reader checks, reduced-motion testing, and manual inspection.

## 11. Performance strategy and proposed budgets

The central performance requirement is useful content and the SMS action without waiting for optional interaction code. Prerender stable pages, keep media minimal, self-host fonts, avoid runtime third-party font requests, and defer demo/map dependencies. Check whether route prefetching downloads demo code unnecessarily on the public homepage.

Initial engineering targets, to be measured after the first production build:

- Homepage critical HTML/CSS/font/image transfer: aim for at most 200 KB compressed; separately report total transfer including framework JavaScript.
- Homepage first-load JavaScript: aim for at most 150 KB compressed, including framework chunks. If the selected Next.js baseline exceeds this, report the measured baseline and optimize avoidable code before revising the target.
- No AI calls, feed polling, map SDKs, autoplay media, or analytics payloads containing user input on the homepage.
- Representative mobile lab target: LCP at most 2.5 seconds and CLS at most 0.1 under a documented test profile. Evaluate INP at most 200ms when suitable field data exists; use interaction traces as a prelaunch proxy, not a field claim.
- Also test a slower 3G-like profile and CPU throttling; report observed times rather than claiming identical timing across connection conditions.

These are proposed budgets, not measured results or universal network guarantees. Failure should leave useful text, navigation, and start instructions available. Do not add a service worker that can silently cache stale resource information without a deliberate freshness policy.

## 12. Build sequence and completion gates

| Phase | Work | Complete when |
|---|---|---|
| 1. Grounding | Capture selected frames, tokens, copy, state inventory, actual repo/API contracts | Design reference and dependencies documented; draft versus live behavior identified |
| 2. Foundation | Scaffold or integrate Next.js; establish tokens, fonts, layouts, metadata, and reusable controls | Production build works; controls render consistently; content appears before fonts/JS |
| 3. Homepage | Implement E's full sequence at mobile and desktop sizes | Matches Build's hierarchy, colors, and typography; SMS/example paths work without client JS |
| 4. Sample flows | Implement three examples, no-match, start, help, language, and partner review | Every intended route works; direct links/Back/keyboard behavior verified; sample labels accurate |
| 5. Live integration | Connect chat and partner intake; add consequential loading/error/retry behavior | Real staging requests succeed; failures preserve work; success follows server acknowledgement |
| 6. Quality pass | Visual comparison, accessibility, responsiveness, browser checks, performance budgets | No unresolved blocking findings in core flows; measured evidence recorded |
| 7. Release preparation | Configure deployment, approved copy, real service details, rollback, and smoke checks | Preview is reviewable; live capabilities enabled only when dependencies are verified |

Build a complete visual site and deterministic sample flows before depending on AI availability. Integrate the live chat as a separate milestone. This provides a stable demonstration fallback and lets layout/accessibility work proceed while backend contracts settle.

## 13. Verification matrix

Test the highest-value behaviors: mobile SMS composer and desktop fallback; direct links to each example; Back/Forward behavior; valid chat reply; empty input; timeout; network failure; no-result; double-send; late response after reset; partner validation/review/edit/submit; failed submission retaining values; unavailable language; 320px reflow; zoom; keyboard flow; reduced motion; JavaScript-disabled public content; and no leaked secrets in client assets.

Use Playwright for consequential browser flows, axe for automated accessibility coverage, a production bundle/network analysis for payload evidence, and browser screenshots for design comparison. Unit tests are justified for input validation, contract parsing, or request-state logic with meaningful failure cases. Avoid tests that merely repeat CSS values or component markup.

Real-device SMS behavior requires actual iOS/Android checks; browser automation alone does not prove a messaging app launches correctly. Record unavailable checks explicitly. A simulated backend proves frontend handling only; it does not prove provider delivery, resource accuracy, or the live AI response quality.

## 14. Skills used as implementation lenses

The earlier review scanned 498 local SKILL.md files; it was not a claim to have executed every skill or reconciled every line. Applying every skill simultaneously would introduce contradictory visual directions and unnecessary tooling. Select guidance by the current task and preserve the approved design.

- figma-use: inspect the source and preserve provenance.
- frontend-design: preserve the distinctive composition and conversation-led product proof.
- layout: reading order, grouping, rhythm, and content-led reflow.
- better-colors: semantic role mapping and measured contrast.
- better-typography: Manrope weights, readable sizes, wrapping, and language behavior.
- semantic-html-first: native controls and minimal custom interaction machinery.
- interaction-contracts: pending, success, failure, cancellation, persistence, and recovery.
- humane-functionalism: practical task completion on modest devices and under interruption.
- accessibility and accessible-animation: input access, visible feedback, reduced motion, and evidence-based checks.
- performance and modern-css-html: native capabilities, selective JavaScript, and measured delivery costs.

Visual-style skills offering different palettes, typography, or animation-heavy directions are references, not authority to redesign Quiet Sand. Implementation-stage reviews should address concrete defects in the selected design.

## 15. Dependencies and final deliverables

The frontend can progress with labeled fixtures while the team confirms: real repository and API access; SMS number and channels; launch regions; supported service and website languages; partner destination and reviewer; data/retention policy; reminder opt-in/stop behavior if reminders launch; approved contacts; and resource provenance.

Final deliverables: responsive Next.js source; Quiet Sand token system and reusable components; sample and live-mode boundaries; connected chat and intake where supported; setup/environment documentation with no secrets; Figma-to-route mapping; accessibility and performance findings; deployment instructions; and a smoke-test checklist. A working preview is an intermediate deliverable. Public launch readiness requires the live-service facts and integrations above.

Official reference checks:
- [Next.js server and client components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Material 3 foundations](https://m3.material.io/foundations/)
- [Material 3 color roles](https://m3.material.io/styles/color/the-color-system)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [W3C reflow guidance](https://www.w3.org/WAI/WCAG21/Understanding/reflow)
