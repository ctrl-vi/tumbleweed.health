import { Page, s } from "@/components/site";
export const metadata = { title: "Privacy information" };
export default function Privacy() {
  return (
    <Page
      title="Know what you’re sharing."
      intro="Privacy information for the current Tumbleweed preview."
    >
      <div className={s.faq}>
        <article>
          <h2>Sample conversations</h2>
          <p>
            Examples are written demonstrations. Reading them does not send a
            message to the chatbot.
          </p>
        </article>
        <article>
          <h2>Browser conversations</h2>
          <p>
            When the live demo is available, your messages are sent to
            Tumbleweed’s backend. The backend uses an AI service and stores
            conversation records, including location details when provided. The
            website does not save your transcript in browser storage. Starting a
            new conversation does not delete records already received by the
            backend.
          </p>
        </article>
        <article>
          <h2>Partner information</h2>
          <p>
            When submissions are unavailable, the form lets you review details
            locally without sending them. When enabled, submitting sends those
            details to the configured partner intake service for review.
          </p>
        </article>
        <article>
          <h2>Text messages</h2>
          <p>
            The Text Tumbleweed link opens your messaging app. Sending a text
            shares your number and message with the messaging service and
            Tumbleweed. Carrier charges may apply.
          </p>
        </article>
        <article>
          <h2>Details still being finalized</h2>
          <p>
            The team is confirming retention periods, deletion/contact
            procedures, and optional reminder policies. Avoid sharing sensitive
            personal information during the preview. This page is interim
            information, not a completed launch policy.
          </p>
        </article>
      </div>
    </Page>
  );
}
