"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mic, Square, Play, Pause, RotateCcw, Send, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/data";

type Phase = "idle" | "recording" | "recorded" | "sending" | "sent" | "error";

const BAR_COUNT = 40;
const MAX_SECONDS = 120;

export function VoiceNote() {
  const reduce = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => new Array(BAR_COUNT).fill(0.06));
  const [isPlaying, setIsPlaying] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

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

  useEffect(() => {
    return () => {
      cleanupLive();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runMeter = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      const bucket = Math.floor(data.length / BAR_COUNT);
      const next: number[] = [];
      for (let i = 0; i < BAR_COUNT; i++) {
        let sum = 0;
        for (let j = 0; j < bucket; j++) sum += data[i * bucket + j];
        const avg = sum / bucket / 255;
        next.push(Math.max(0.06, Math.min(1, avg * 1.4)));
      }
      setLevels(next);
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, []);

  async function startRecording() {
    setError(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setError(`Recording isn't supported in this browser. Please email ${CONTACT_EMAIL}.`);
      setPhase("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) stopRecording();
          return s + 1;
        });
      }, 1000);
    } catch (err) {
      const name = (err as DOMException)?.name;
      if (name === "NotAllowedError" || name === "SecurityError") {
        setError("Microphone access was blocked. Enable it in your browser settings to record.");
      } else if (name === "NotFoundError") {
        setError("No microphone was found. Connect one and try again.");
      } else {
        setError(`We couldn't start recording. Please try again, or email ${CONTACT_EMAIL}.`);
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

    if (!name.trim()) {
      setError("Please enter your name before sending.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email so we can follow up.");
      return;
    }
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
      setError(`Network error while sending. Please try again, or email ${CONTACT_EMAIL}.`);
      setPhase("recorded");
    }
  }

  const mmss = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (phase === "sent") {
    return (
      <div className="surface flex flex-col items-center gap-3 rounded-2xl px-6 py-8 text-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
          <Check className="h-5 w-5 text-emerald-700" />
        </span>
        <div className="text-sm font-medium text-slate-900">Voice note sent</div>
        <p className="max-w-xs text-[13px] text-slate-500">
          Thanks — the team will pick it up at{" "}
          <span className="text-slate-700">{CONTACT_EMAIL}</span> and get back to you.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-slate-900/10 bg-slate-50 px-3.5 py-1.5 text-[12px] text-slate-600 transition-colors hover:text-slate-900"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Record another
        </button>
      </div>
    );
  }

  return (
    <div className="surface rounded-2xl p-5 sm:p-6">
      {/* Waveform + timer panel */}
      <div className="rounded-xl border border-slate-900/[0.08] bg-slate-50 px-4 py-5">
        <div className="flex h-16 items-center justify-center gap-[3px]">
          {levels.map((lvl, i) => {
            const active = phase === "recording";
            return (
              <motion.span
                key={i}
                className={cn(
                  "w-[3px] rounded-full",
                  active ? "bg-blue-500" : phase === "recorded" ? "bg-slate-300" : "bg-slate-200"
                )}
                animate={{ height: `${Math.max(6, lvl * 56)}px` }}
                transition={{ duration: reduce ? 0 : 0.08, ease: "linear" }}
                style={{ height: 6 }}
              />
            );
          })}
        </div>

        <div className="mt-3 text-center font-mono text-[13px] tabular-nums tracking-[0.16em] text-slate-600">
          {mmss}
          {phase === "recording" && (
            <span className="ml-2 inline-flex items-center gap-1.5 align-middle text-rose-600">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-rose-500" />
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
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-600">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
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
              className="group inline-flex items-center gap-2.5 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-[0_1px_3px_rgba(23,70,219,0.28),0_4px_12px_rgba(23,70,219,0.30),0_16px_48px_-8px_rgba(23,70,219,0.42)] transition-transform hover:-translate-y-px hover:bg-blue-700"
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
              className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-600 transition-transform hover:scale-105"
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
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-900/15 bg-slate-50 text-slate-700 transition-colors hover:border-slate-900/30"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="Re-record"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-900/15 bg-slate-50 text-slate-600 transition-colors hover:border-slate-900/30 hover:text-slate-900"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Required contact fields + send */}
        {(phase === "recorded" || phase === "sending") && (
          <div className="w-full space-y-3 border-t border-slate-900/[0.08] pt-4">
            <p className="text-[12px] text-slate-400">
              Required so we can follow up with you.{" "}
              <span className="text-rose-500">*</span>
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  Name <span className="text-rose-500">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="rounded-lg border border-slate-900/10 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                  Email <span className="text-rose-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="you@hospital.com"
                  required
                  className="rounded-lg border border-slate-900/10 bg-white px-3 py-2 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none"
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
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "bg-blue-600 text-white shadow-[0_1px_3px_rgba(23,70,219,0.28),0_4px_12px_rgba(23,70,219,0.30),0_16px_48px_-8px_rgba(23,70,219,0.42)] hover:-translate-y-px hover:bg-blue-700"
              )}
            >
              {phase === "sending" ? (
                "Sending..."
              ) : (
                <>
                  <Send className="h-4 w-4" /> Send voice note
                </>
              )}
            </button>
          </div>
        )}

        {phase === "idle" && (
          <p className="text-center text-[12px] text-slate-400">
            Prefer to talk? Leave us a quick voice note — like a voicemail.
          </p>
        )}
      </div>
    </div>
  );
}
