import { Page, Action, s } from "@/components/site";
export const metadata = { title: "Language" };
export default function Language() {
  return (
    <Page
      title="Choose your language."
      intro="Language access is part of Tumbleweed’s purpose."
    >
      <div className={s.narrow}>
        <div className={s.notice}>
          <h2>English</h2>
          <p>The website and examples are currently available in English.</p>
          <Action href="/">Continue in English</Action>
        </div>
        <article className={s.notice} lang="es">
          <h2>Español</h2>
          <p>
            La vista previa está disponible en inglés. Los idiomas del servicio
            se confirmarán antes del lanzamiento.
          </p>
        </article>
        <p className={s.hint}>
          Website translations and supported chatbot languages will be listed
          here as they become available.
        </p>
      </div>
    </Page>
  );
}
