import { Action, TextAction, Conversation, s } from "@/components/site";
import { examples } from "@/content/examples";
export default function Home() {
  return (
    <>
      <section className={s.hero}>
        <h1>
          Find food nearby.
          <br />
          Start with a text.
        </h1>
        <p className={s.intro}>
          Find local food resources, ideas for meals, and help understanding
          food programs. Ask in your own words.
        </p>
        <div className={s.actions}>
          <TextAction />
          <Action href="/examples/food">See an example</Action>
        </div>
        <p className={s.hint}>
          No app download. Use your phone’s messaging app.
        </p>
        <Conversation />
      </section>
      <section className={s.section}>
        <h2>A question is a good place to start.</h2>
        <div className={s.columns}>
          {Object.entries(examples).map(([key, e]) => (
            <article className={s.service} key={key}>
              <h3>{e.label}</h3>
              <p>{e.prompt}</p>
              <p>{e.description}</p>
              <Action href={`/examples/${key}`}>
                See this example<span className="sr-only">: {e.label}</span>
              </Action>
            </article>
          ))}
        </div>
      </section>
      <section className={s.section}>
        <h2>
          One text. A little context.
          <br />A practical next step.
        </h2>
        <ol className={`${s.columns} ${s.steps}`}>
          {[
            ["Send a question", "Tell us what you need, in your own words."],
            [
              "Share a little context",
              "Your town or ingredients help narrow the answer.",
            ],
            ["Keep talking", "Ask a follow-up when you need more guidance."],
          ].map(([title, body], i) => (
            <li className={s.step} key={title}>
              <span aria-hidden="true">{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className={`${s.section} ${s.partnerBand}`}>
        <h2>
          Local knowledge.
          <br />
          More useful answers.
        </h2>
        <p>
          Run a pantry, meal site, or community event? Help people find
          practical details about your services.
        </p>
        <Action href="/partners">For community partners</Action>
      </section>
    </>
  );
}
