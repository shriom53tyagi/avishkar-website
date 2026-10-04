"use client";

import { useState } from "react";
import Link from "next/link";
import { Roll } from "@/components/av/Roll";
import { isValidEmail, submitSubscribe } from "@/lib/early-access";
import { bits } from "./PageBits";
import x from "./PageExtras.module.css";

/**
 * First name + email subscribe form — same fields and consent checkbox as
 * the footer's newsletter form, restyled for the Letter page. Posts to
 * /api/subscribe.
 */
export function SubscribeForm() {
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = String(new FormData(form).get("email") ?? "");
        if (!isValidEmail(email)) {
          setMsg({ ok: false, text: "Enter a valid work email." });
          form.querySelector<HTMLInputElement>("input[name=email]")?.focus();
          return;
        }
        setPending(true);
        const result = await submitSubscribe(email, String(new FormData(form).get("firstName") ?? ""));
        setPending(false);
        if (!result.ok) {
          setMsg({ ok: false, text: result.error });
          return;
        }
        setMsg({ ok: true, text: "You're on the list. The next issue lands in your inbox." });
        form.reset();
      }}
    >
      <div className={bits.field}>
        <label htmlFor="letter-fn">First name</label>
        <input className={bits.input} id="letter-fn" name="firstName" autoComplete="given-name" />
      </div>
      <div className={bits.field}>
        <label htmlFor="letter-em">Work email</label>
        <input className={bits.input} id="letter-em" name="email" type="email" autoComplete="email" required />
      </div>
      <div className={x.full}>
        <label className={bits.agree}>
          <input type="checkbox" required />
          <span>
            I agree to the <Link href="/privacy">Privacy Policy</Link>
          </span>
        </label>
      </div>
      <div className={x.full}>
        <button className={`${bits.btn} ${bits.btnLime} ${bits.btnLg}`} type="submit" disabled={pending}>
          <Roll>Subscribe</Roll>
        </button>
        <p className={`${bits.formMsg} ${msg ? (msg.ok ? bits.formOk : bits.formErr) : ""}`} role="status">
          {msg?.text}
        </p>
      </div>
    </form>
  );
}
