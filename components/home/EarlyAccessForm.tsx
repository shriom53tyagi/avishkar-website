"use client";

import { useEffect, useState, type FormEvent } from "react";
import { EARLY_ACCESS } from "@/lib/content";
import { isValidEmail, submitEarlyAccess } from "@/lib/early-access";
import { cn } from "@/lib/utils";

const DONE_KEY = "early-access-done";

export function EarlyAccessForm({
  idPrefix = "early-access",
  compact = false,
}: {
  idPrefix?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DONE_KEY) === "1") setDone(true);
    } catch {
      /* private mode */
    }
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = email.trim();

    if (!isValidEmail(next)) {
      setError("Enter a valid work email.");
      return;
    }

    setError("");
    setPending(true);

    const result = await submitEarlyAccess(next);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    try {
      sessionStorage.setItem(DONE_KEY, "1");
    } catch {
      /* private mode */
    }
    setDone(true);
  }

  const emailId = `${idPrefix}-email`;
  const errorId = `${idPrefix}-error`;
  const noteId = `${idPrefix}-note`;

  if (done) {
    return (
      <div
        className={cn(
          "rounded border border-line bg-surface",
          compact ? "border-0 p-0" : "p-5"
        )}
        aria-live="polite"
      >
        <p className="text-h3 font-serif font-normal tracking-[-0.01em] text-ink">{EARLY_ACCESS.successTitle}</p>
        <p className="mt-2 text-small text-ink-muted">{EARLY_ACCESS.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={cn(
        "rounded border-line bg-surface",
        compact ? "border-t pt-5" : "border p-5"
      )}
    >
      <p className="text-small font-medium text-ink">{EARLY_ACCESS.formLabel}</p>

      <div className="mt-4">
        <label htmlFor={emailId} className="text-label uppercase text-ink-subtle">
          {EARLY_ACCESS.emailLabel}
        </label>
        <div
          className={cn(
            "mt-2 flex gap-3",
            compact ? "flex-col" : "flex-col sm:flex-row sm:items-stretch"
          )}
        >
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (error) setError("");
            }}
            placeholder={EARLY_ACCESS.emailLabel}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : noteId}
            className="w-full rounded border border-line-strong bg-canvas px-4 py-3 text-small text-ink placeholder:text-ink-subtle sm:flex-1"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded bg-accent px-5 py-3 text-small font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? "Sending" : EARLY_ACCESS.submit}
            {!pending && (
              <span aria-hidden className="translate-y-[0.5px]">
                &rarr;
              </span>
            )}
          </button>
        </div>
      </div>

      {error ? (
        <p id={errorId} className="mt-3 text-small text-attention" role="alert">
          {error}
        </p>
      ) : (
        <p id={noteId} className="mt-3 text-small text-ink-subtle">
          {EARLY_ACCESS.footnote}
        </p>
      )}
    </form>
  );
}
