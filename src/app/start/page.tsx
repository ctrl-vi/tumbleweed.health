import { Page, TextAction, Action, s } from "@/components/site";
import { service } from "@/lib/config";
import { CopyNumber } from "@/components/copy-number";
export const metadata = { title: "Start with a text" };
export default function Start() {
  return (
    <Page
      title="Your next step is a text."
      intro="Send “Hi” to Tumbleweed and tell us what you need help with."
    >
      <div className={s.narrow}>
        <div className={s.notice}>
          <p className={s.hint}>Text Tumbleweed at</p>
          <p className={s.phone}>{service.displayPhone}</p>
          <p>
            On your phone, open a conversation with “Hi” ready to send. You
            choose when to send it.
          </p>
          <div className={s.actions}>
            <TextAction />
            <CopyNumber />
          </div>
        </div>
        <p>
          On a computer? Open your phone’s messaging app and enter the number
          above.
        </p>
        <p className={s.hint}>
          Carrier messaging charges may apply. Service coverage and supported
          languages are being confirmed.{" "}
          <a href="/help">A few things to know before you start.</a>
        </p>
        <Action href="/examples/food">Explore an example</Action>
      </div>
    </Page>
  );
}
