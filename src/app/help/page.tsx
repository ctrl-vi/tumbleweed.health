import { Page, Action, s } from "@/components/site";
import { service } from "@/lib/config";
export const metadata = { title: "Help & privacy" };
export default function Help() {
  const items = [
    [
      "How do I start?",
      <>
        Use your phone’s messaging app to text “Hi” to {service.displayPhone}.{" "}
        <a href="/start">See texting instructions.</a>
      </>,
    ],
    [
      "What can I ask about?",
      "Local food resources, meal ideas based on ingredients, and help understanding food programs.",
    ],
    [
      "Which languages and places are supported?",
      "Launch areas and supported service languages are still being confirmed. The website currently provides English examples.",
    ],
    [
      "What about privacy and messaging costs?",
      <>
        Carrier messaging charges may apply. Before using the browser demo, read
        our <a href="/privacy">current privacy information</a>. Data retention
        and optional reminder policies are still being finalized.
      </>,
    ],
    [
      "Can I rely on a sample result?",
      "These are illustrative conversations. Verify hours and access details with a provider. Program eligibility is determined by the relevant program.",
    ],
    [
      "What if I cannot find a resource?",
      "Try a nearby town or explain how far you can travel. A missing result does not mean there is no help available.",
    ],
    [
      "How can my organization help?",
      <>
        Share practical information about a pantry, meal site, or event through
        the <a href="/partners">community partner page</a>.
      </>,
    ],
  ];
  return (
    <Page title="A few things to know." intro="Clear answers before you start.">
      <div className={s.faq}>
        {items.map(([title, body], i) => (
          <article key={i}>
            <h2>{title}</h2>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <Action href="/examples/food">See an example</Action>
    </Page>
  );
}
