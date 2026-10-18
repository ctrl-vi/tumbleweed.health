import { Page, Action } from "@/components/site";
export default function NotFound() {
  return (
    <Page
      title="Let’s find your next step."
      intro="That page isn’t here. You can start from home or explore a conversation."
    >
      <Action href="/">Back to home</Action>
      <Action href="/examples/food">See an example</Action>
    </Page>
  );
}
