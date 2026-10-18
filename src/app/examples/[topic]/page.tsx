import { notFound } from "next/navigation";
import { examples, type Topic } from "@/content/examples";
import { Page, Conversation, Action, TextAction, s } from "@/components/site";
export function generateStaticParams() {
  return [...Object.keys(examples), "no-match"].map((topic) => ({ topic }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  return {
    title:
      topic === "no-match"
        ? "No-match example"
        : (examples[topic as Topic]?.label ?? "Example"),
  };
}
export default async function Example({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  if (topic === "no-match")
    return (
      <Page
        title="No match in this example."
        intro="This sample shows what happens when we cannot confirm a nearby resource."
      >
        <div className={s.narrow}>
          <div className={s.notice}>
            <h2>We couldn’t confirm a match for that location.</h2>
            <p>
              Try a nearby town, or tell us how far you can travel. Hours and
              availability should be checked with the provider before you go.
            </p>
          </div>
          <div className={s.actions}>
            <Action href="/examples/food">Try a different question</Action>
            <Action href="/examples/meals">Explore meal ideas</Action>
          </div>
        </div>
      </Page>
    );
  if (!Object.prototype.hasOwnProperty.call(examples, topic)) notFound();
  const e = examples[topic as Topic];
  return (
    <Page
      title={e.title}
      intro="Choose a topic to explore a sample conversation."
    >
      <nav className={s.topics} aria-label="Conversation topics">
        {Object.entries(examples).map(([key, value]) => (
          <Action href={`/examples/${key}`} key={key} current={key === topic}>
            {value.label}
          </Action>
        ))}
      </nav>
      <Conversation topic={topic as Topic} />
      {topic === "food" && (
        <Action href="/examples/no-match">Try the no-match example</Action>
      )}
      <TextAction />
    </Page>
  );
}
