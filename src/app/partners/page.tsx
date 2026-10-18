import { Page, s } from "@/components/site";
import { PartnerForm } from "@/components/partner-form";
import { partnersEnabled } from "@/lib/config";
export const dynamic = "force-dynamic";
export const metadata = { title: "For community partners" };
export default function Partners() {
  const enabled = partnersEnabled();
  return (
    <Page
      title="Help your neighbors find you."
      intro="Share practical details about a pantry, meal site, or community event."
    >
      <div className={s.narrow}>
        {!enabled && (
          <p className={s.hint}>
            Partner intake is coming soon. You can try the form and review your
            details, but nothing will be sent.
          </p>
        )}
        <PartnerForm enabled={enabled} />
      </div>
    </Page>
  );
}
