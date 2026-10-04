import { bits, PageHero } from "./shared/PageBits";
import { SubscribeForm } from "./shared/SubscribeForm";
import x from "./shared/PageExtras.module.css";

/** /letter — structure from reference/letter.html. */
export function LetterPage() {
  return (
    <div className={bits.page}>
      <PageHero
        title="The Avishkar Letter"
        lede="One short email a month with what we're seeing across practices."
        badge="Monthly ✱ One email ✱ No spam ✱ "
      />

      <section className={bits.section} id="subscribe">
        <div className={`${bits.dark} ${x.sub}`}>
          <div>
            <h2 className={bits.h2}>Get the next issue.</h2>
            <p>Short, practical, once a month. Unsubscribe in one click.</p>
            <SubscribeForm />
          </div>
          <div className={x.mail} aria-hidden="true">
            <div className={`${x.sheet} ${x.sheetBack}`} />
            <div className={x.sheet}>
              <div className={x.from}>
                <i />
                The Avishkar Letter
              </div>
              <h3>This month: the next issue&apos;s headline lands here</h3>
              <b />
              <b style={{ width: "88%" }} />
              <b style={{ width: "94%" }} />
              <b style={{ width: "60%" }} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
