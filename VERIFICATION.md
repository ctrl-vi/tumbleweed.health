# Implementation verification

## Completed

- Production build and TypeScript checks pass.
- Nine Playwright tests pass. Includes automated axe checks across all 11 public URLs; keyboard skip/navigation; 320px layout; no-JavaScript home/examples; actual partner review/edit values; unavailable intake; connected submission failure/recovery; chat contract, failure recovery, and reset while pending; origin/input validation; enlarged text and reduced-motion checks.
- A final route guard correction was rebuilt and the invalid `/examples/toString` route was checked separately.
- Desktop, mobile, tablet, partner, and example screenshots were inspected. Reference screenshots and structural data were read from the selected Figma Build page during implementation. The final attempted Figma refresh hit the Starter-plan tool quota; previous captured references remained the comparison source.
- Quiet Sand palette, Manrope, centered promise, sample conversation, three needs, process, and partner invitation preserved. Header wrapping was corrected after visual inspection. Typography uses rem units. Inputs have stronger functional outlines than decorative dividers.
- SMS handoff points to the user-confirmed +1 509 206-9073.

## Performance evidence

Production localhost homepage, 390×844 Chromium viewport: approximately 167 KB compressed total response bodies, including approximately 136 KB JavaScript and a 25 KB locally served font. There were no third-party requests, AI calls, or map/feed requests on the home route. The same resource set was checked under 1.6 Mbps download, 150ms latency, and 4× CPU throttling.

The headless measurement did not report an LCP entry. No LCP/INP timing or field-performance claim is made. The observed layout-shift total was zero in these runs; this is limited lab evidence, not a field guarantee. Raw results and screenshots are in ignored `test-results/`.

## Integration evidence and remaining dependencies

The supplied backend repository was inspected at commit 27f69a841c4f6200c66c30b48643088b25707645. It is Python/FastAPI, not the originally proposed TypeScript service. The Next.js adapter uses its actual `{handle,text}` → `{reply}` contract. Connected behavior was tested using a local mock service, not the real AI, database, or SMS provider.

To enable live browser chat, set TUMBLEWEED_API_URL to the deployed backend origin. No deployed origin was supplied or found in the inspected code. Partner submission requires a separate intake endpoint, absent from the supplied backend. Until configured, both flows explicitly describe their availability and never invent successful submissions or live responses.

Still unverified: real SMS delivery and native messaging-app behavior, real backend response quality, resource accuracy, VoiceOver/NVDA, Safari/Firefox, finalized translated copy, and production privacy/retention policy. The public message-location feed is intentionally unused.

Local preview: http://127.0.0.1:3000. Nothing was deployed or pushed to the remote repository.
