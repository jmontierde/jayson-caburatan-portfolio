"use client";
import { ReactNode } from "react";

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-[#BDBDBD] font-medium">{label}</span>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "rounded-lg bg-[#0a0a0e] border border-[#2a2a30] px-3 py-2 outline-none focus:border-[#EDFF21]/50 text-sm " +
        (props.className ?? "")
      }
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={
        "rounded-lg bg-[#0a0a0e] border border-[#2a2a30] px-3 py-2 outline-none focus:border-[#EDFF21]/50 text-sm font-mono " +
        (props.className ?? "")
      }
    />
  );
}

export function Button({
  variant = "primary",
  ...props
}: { variant?: "primary" | "ghost" | "danger" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 transition";
  const styles =
    variant === "primary"
      ? "bg-[#EDFF21] text-black hover:bg-[#d9eb1c]"
      : variant === "danger"
      ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
      : "bg-white/5 text-white border border-white/10 hover:bg-white/10";
  return <button {...props} className={`${base} ${styles} ${props.className ?? ""}`} />;
}

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#15151a] border border-[#2a2a30] rounded-2xl p-6 flex flex-col gap-4">
      {children}
    </div>
  );
}

export function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}
