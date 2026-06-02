"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Square, Play, Pause, RotateCcw, Send, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Apple-style voice note recorder, behaving like the iPhone voice-memo UX:
 * tap to record → live animated waveform + timer → stop → playback / re-record /
 * send. Uses the MediaRecorder API with graceful mic-permission handling.
 *
 * On send, the audio is POSTed as multipart/form-data to `/api/voice-note`,
 * which acknowledges receipt (see that route for where it would be stored or
 * forwarded to info@avishakar.com).
 *
 * SSR-safe: all browser APIs are touched only inside effects/handlers, and the
 * live bars fall back to a static state under `prefers-reduced-motion`.
 */

type Phase = "idle" | "recording" | "recorded" | "sending" | "sent" | "error";

const BAR_COUNT = 40;
const MAX_SECONDS = 120; // auto-stop after 2 minutes

export function VoiceNote() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => new Array(BAR_COUNT).fill(0.06));
  const [isPlaying, setIsPlaying] = useState(false);

  // Optional contact fields so the team can reply.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Refs for the live recording machinery.
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  /** Tear down all live audio resources (stream, context, timers, raf). */
  const cleanupLive = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    analyserRef.current = null;
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // Clean up everything on unmount + revoke any object URL.
  useEffect(() => {
    return () => {
      cleanupLive();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Drive the live waveform from the analyser node. */
  const runMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      // Reduce the spectrum to BAR_COUNT bars by averaging buckets.
      const bucket = Math.floor(data.length / BAR_COUNT);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < bucket; j++) sum += data[i * bucket + j];
        const avg = sum / bucket / 255; // 0..1
        next.push(Math.max(0.06, Math.min(1, avg * 1.4)));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  async function startRecording() {
    setError(null);

    // Feature-detect first so we fail gracefully on unsupported browsers.
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError("Recording isn't supported in this browser. Please email info@avishakar.com.");
      setPhase("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up analyser for the live waveform.
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Pick a widely supported container.
      const mime = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : "";
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || "audio/webm" });
        audioBlobRef.current = blob;
        const url = URL.createObjectURL(blob);
        setAudioUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setPhase("recorded");
        cleanupLive();
        setLevels(new Array(BAR_COUNT).fill(0.18));
      };

      recorder.start();
      setSeconds(0);
      setPhase("recording");
      if (!reduce) runMeter();

      // Timer + auto-stop guard.
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) stopRecording();
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      // Permission denied / no device / other constraints.
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone access was blocked. Enable it in your browser settings to record.");
      } else if (name === "NotFoundError") {
        setError("No microphone was found. Connect one and try again.");
      } else {
        setError("We couldn't start recording. Please try again, or email info@avishakar.com.");
      }
      setPhase("error");
      cleanupLive();
    }
  }

  function stopRecording() {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") rec.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }

  function reset() {
    cleanupLive();
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    audioBlobRef.current = null;
    setAudioUrl(null);
    setSeconds(0);
    setIsPlaying(false);
    setLevels(new Array(BAR_COUNT).fill(0.06));
    setError(null);
    setPhase("idle");
  }

  function togglePlayback() {
    const el = audioElRef.current;
    if (!el) return;
    if (el.paused) {
      el.play();
      setIsPlaying(true);
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }

  async function sendNote() {
    if (!audioBlobRef.current) return;

    // Client-side required field validation
    if (!name.trim()) {
      setError("Please enter your name before sending.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email so we can follow up.");
      return;
    }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setPhase("sending");
    setError(null);
    try {
      const form = new FormData();
      const ext = (audioBlobRef.current.type.includes("mp4") ? "mp4" : "webm");
      form.append("audio", audioBlobRef.current, `voice-note.${ext}`);
      if (name.trim()) form.append("name", name.trim());
      if (email.trim()) form.append("email", email.trim());

      const res = await fetch("/api/voice-note", { method: "POST", body: form });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (res.ok && data.ok) {
        setPhase("sent");
      } else {
        setError(data.error || "We couldn't send that. Please try again.");
        setPhase("recorded");
      }
    } catch {
      setError("Network error while sending. Please try again, or email info@avishakar.com.");
      setPhase("recorded");
    }
  }

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  // ---- Sent confirmation state -------------------------------------------
  if (phase === "sent") {
    return (
      <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10">
          <Check className="h-5 w-5 text-emerald-400" />
        </span>
        <div className="text-sm font-medium text-white">Voice note sent</div>
        <p className="max-w-xs text-[13px] text-white/55">
          Thanks — the team will pick it up at{" "}
          <span className="text-white/80">info@avishakar.com</span> and get back to you.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[12px] text-white/70 transition-colors hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Record another
        </button>
      </div>
    );
  }

  return (
    <div className="surface rounded-2xl p-5 sm:p-6">
      {/* Waveform + timer panel */}
      <div className="rounded-xl border border-white/[0.06] bg-ink-900/50 px-4 py-5">
        <div className="flex h-16 items-center justify-center gap-[3px]">
          {levels.map((lvl, i) => {
            const active = phase === "recording";
            return (
              <motion.span
                key={i}
                className={cn(
                  "w-[3px] rounded-full",
                  active ? "bg-cyan-400" : phase === "recorded" ? "bg-white/35" : "bg-white/15"
                )}
                animate={{ height: `${Math.max(6, lvl * 56)}px` }}
                transition={{ duration: reduce ? 0 : 0.08, ease: "linear" }}
                style={{ height: 6 }}
              />
            );
          })}
        </div>

        <div className="mt-3 text-center font-mono text-[13px] tabular-nums tracking-[0.16em] text-white/70">
          {mmss}
          {phase === "recording" && (
            <span className="ml-2 inline-flex items-center gap-1.5 align-middle text-rose-400">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-rose-400" />
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/60" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em]">rec</span>
            </span>
          )}
        </div>
      </div>

      {/* Hidden audio element for playback */}
      {audioUrl && (
        <audio
          ref={audioElRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {/* Error line */}
      {error && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-400/20 bg-rose-400/5 px-3 py-2 text-[12.5px] text-rose-200/90">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Controls */}
      <div className="mt-5 flex flex-col items-center gap-4">
        {/* Primary control row */}
        <div className="flex items-center justify-center gap-3">
          {(phase === "idle" || phase === "error") && (
            <button
              type="button"
              onClick={startRecording}
              className="group inline-flex items-center gap-2.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)] transition-transform hover:-translate-y-px"
            >
              <Mic className="h-4 w-4" />
              {phase === "error" ? "Try again" : "Tap to record"}
            </button>
          )}

          {phase === "recording" && (
            <button
              type="button"
              onClick={stopRecording}
              aria-label="Stop recording"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-rose-400/40 bg-rose-400/10 text-rose-300 transition-transform hover:scale-105"
            >
              <Square className="h-5 w-5 fill-current" />
            </button>
          )}

          {(phase === "recorded" || phase === "sending") && (
            <>
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause" : "Play"}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="Re-record"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-colors hover:border-white/30 hover:text-white"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Required contact fields + send (shown once recording is done) */}
        {(phase === "recorded" || phase === "sending") && (
          <div className="w-full space-y-3 border-t border-white/[0.06] pt-4">
            <p className="text-[12px] text-white/40">
              Required so we can follow up with you.{" "}
              <span className="text-rose-400">*</span>
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Name <span className="text-rose-400">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
                  Email <span className="text-rose-400">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@hospital.com"
                  required
                  className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[13px] text-white placeholder:text-white/30 focus:border-white/25 focus:outline-none"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={sendNote}
              disabled={phase === "sending" || !name.trim() || !email.trim()}
              className={cn(
                "inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-transform",
                phase === "sending" || !name.trim() || !email.trim()
                  ? "cursor-not-allowed bg-white/15 text-white/40"
                  : "bg-white text-ink-950 shadow-[0_0_0_1px_rgba(255,255,255,0.5),0_10px_40px_-10px_rgba(34,211,238,0.6)] hover:-translate-y-px"
              )}
            >
              {phase === "sending" ? (
                "Sending…"
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send voice note
                </>
              )}
            </button>
          </div>
        )}

        {phase === "idle" && (
          <p className="text-center text-[12px] text-white/40">
            Prefer to talk? Leave us a quick voice note — like a voicemail.
          </p>
        )}
      </div>
    </div>
  );
}
