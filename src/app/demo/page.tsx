import { Page, Action, TextAction, s } from "@/components/site";
import { Chat } from "@/components/chat";
import { chatEnabled } from "@/lib/config";
export const dynamic = "force-dynamic";
export const metadata = { title: "Try a conversation" };
export default function Demo() {
  return (
    <Page
      title="A question is a good place to start."
      intro="Food nearby, ideas for a meal, or help understanding food programs."
    >
      {chatEnabled() ? (
        <>
          <p className={s.hint}>
            Messages are sent to the Tumbleweed service. Avoid sensitive
            personal information.{" "}
            <a href="/privacy">Read privacy information.</a>
          </p>
          <Chat />
        </>
      ) : (
        <div className={s.narrow}>
          <div className={s.notice}>
            <h2>The browser demo is getting ready.</h2>
            <p>
              You can explore the sample conversations or start a text from your
              phone.
            </p>
            <div className={s.actions}>
              <Action href="/examples/food">Explore an example</Action>
              <TextAction />
            </div>
          </div>
          <p className={s.hint}>
            Samples are clearly labeled and do not send messages.
          </p>
        </div>
      )}
    </Page>
  );
}
