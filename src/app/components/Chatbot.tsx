"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  User,
  Mail,
  MessageSquare,
  Check,
  Download,
  ArrowLeft,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function formatMessage(text: string) {
  const formatted = text.replace(/(\d+)\.\s+\*\*/g, "\n\n$1. **");

  return formatted.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      const linkParts = part.split(/(\[[^\]]+\]\([^)]+\))/g);
      return linkParts.map((lp, k) => {
        const linkMatch = lp.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          return (
            <a
              key={`${j}-${k}`}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#EDFF21] underline underline-offset-2"
            >
              {linkMatch[1]}
            </a>
          );
        }
        return lp;
      });
    });

    return (
      <span key={i}>
        {i > 0 && <br />}
        {parts}
      </span>
    );
  });
}

// ── Mini Calendar Scheduler ──

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type ScheduleStep = "date" | "time" | "details" | "confirmed";

function generateICS(
  date: Date,
  time: string,
  name: string,
  email: string,
  message: string
) {
  const [hourStr, minutePart] = time.split(":");
  const [minutes, period] = minutePart.split(" ");
  let hour = parseInt(hourStr);
  if (period === "PM" && hour !== 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const start = new Date(date);
  start.setHours(hour, parseInt(minutes), 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Jayson Portfolio//Meeting//EN",
    "BEGIN:VEVENT",
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:Meeting with ${name}`,
    `DESCRIPTION:Scheduled via portfolio.\\nName: ${name}\\nEmail: ${email}\\nMessage: ${message}`,
    `ORGANIZER;CN=${name}:mailto:${email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function MiniScheduler({ onBack }: { onBack: () => void }) {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<ScheduleStep>("date");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [icsData, setIcsData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleCalUrl, setGoogleCalUrl] = useState<string | null>(null);
  const [meetLink, setMeetLink] = useState<string | null>(null);
  const [autoCreated, setAutoCreated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [step]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const isPast = (day: number) =>
    new Date(year, month, day) <
    new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const isWeekend = (day: number) => {
    const dow = new Date(year, month, day).getDay();
    return dow === 0 || dow === 6;
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const isSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === month &&
    selectedDate?.getFullYear() === year;

  const canGoPrev =
    year > today.getFullYear() ||
    (year === today.getFullYear() && month > today.getMonth());

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else setMonth(month + 1);
  };

  const selectDay = (day: number) => {
    if (isPast(day) || isWeekend(day)) return;
    setSelectedDate(new Date(year, month, day));
    setStep("time");
  };

  const selectTime = (time: string) => {
    setSelectedTime(time);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    // Generate .ics as fallback
    const ics = generateICS(
      selectedDate,
      selectedTime,
      form.name,
      form.email,
      form.message
    );
    setIcsData(ics);

    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          time: selectedTime,
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (data.success && data.htmlLink) {
        setGoogleCalUrl(data.htmlLink);
        setMeetLink(data.meetLink || null);
        setAutoCreated(true);
      } else if (data.googleCalendarUrl) {
        setGoogleCalUrl(data.googleCalendarUrl);
      } else {
        setGoogleCalUrl(buildGoogleCalUrl());
      }
    } catch {
      setGoogleCalUrl(buildGoogleCalUrl());
    } finally {
      setIsSubmitting(false);
      setStep("confirmed");
    }
  };

  const buildGoogleCalUrl = () => {
    if (!selectedDate || !selectedTime) return "";
    const [hourStr, minutePart] = selectedTime.split(":");
    const [minutes, period] = minutePart.split(" ");
    let hour = parseInt(hourStr);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    const start = new Date(selectedDate);
    start.setHours(hour, parseInt(minutes), 0, 0);
    const end = new Date(start);
    end.setHours(start.getHours() + 1);

    const fmt = (d: Date) =>
      d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Meeting with ${form.name}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Scheduled via portfolio\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message || "N/A"}`,
      add: `${form.email},caburatanjayson92@gmail.com`,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const downloadICS = () => {
    if (!icsData) return;
    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "meeting-with-jayson.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const sendEmail = () => {
    if (!selectedDate || !selectedTime) return;
    const dateStr = selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const subject = encodeURIComponent(
      `Meeting Request - ${dateStr} at ${selectedTime}`
    );
    const body = encodeURIComponent(
      `Hi Jayson,\n\nI'd like to schedule a meeting.\n\nDate: ${dateStr}\nTime: ${selectedTime}\nName: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n\nLooking forward to it!`
    );
    window.open(
      `mailto:caburatanjayson92@gmail.com?subject=${subject}&body=${body}`,
      "_blank"
    );
  };

  const fmtDate = () =>
    selectedDate?.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

  return (
    <div ref={scrollRef} className="flex flex-col h-full overflow-y-auto">
      {/* Scheduler header */}
      <div className="sticky top-0 z-10 bg-[#101014] border-b border-white/10 px-4 py-3 flex items-center gap-2">
        <button
          onClick={onBack}
          className="text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <CalendarDays size={16} className="text-[#EDFF21]" />
        <span className="text-white font-medium text-sm">
          Schedule a Meeting
        </span>
      </div>

      {/* Selection chips */}
      {(selectedDate || selectedTime) && step !== "confirmed" && (
        <div className="flex items-center gap-2 px-4 pt-3 flex-wrap">
          {selectedDate && (
            <button
              onClick={() => setStep("date")}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:border-[#EDFF21]/50 transition-colors"
            >
              <CalendarDays size={11} />
              {fmtDate()}
            </button>
          )}
          {selectedTime && (
            <button
              onClick={() => setStep("time")}
              className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 hover:border-[#EDFF21]/50 transition-colors"
            >
              <Clock size={11} />
              {selectedTime}
            </button>
          )}
        </div>
      )}

      <div className="flex-1 px-4 py-3">
        <AnimatePresence mode="wait">
          {/* DATE STEP */}
          {step === "date" && (
            <motion.div
              key="date"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white/50 text-xs mb-3">Pick a date</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                {/* Month nav */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={prevMonth}
                    disabled={!canGoPrev}
                    className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-white text-xs font-medium">
                    {MONTHS[month]} {year}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-1 rounded-md hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[10px] text-white/25 font-medium py-0.5"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-0.5">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isPast(day) || isWeekend(day);
                    return (
                      <button
                        key={day}
                        onClick={() => selectDay(day)}
                        disabled={disabled}
                        className={`aspect-square rounded-lg text-xs font-medium transition-all ${
                          isSelected(day)
                            ? "bg-[#EDFF21] text-[#101014]"
                            : isToday(day)
                              ? "bg-white/10 text-white ring-1 ring-[#EDFF21]/40"
                              : disabled
                                ? "text-white/10 cursor-not-allowed"
                                : "text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="text-white/20 text-[10px] mt-2">
                Weekends unavailable
              </p>
            </motion.div>
          )}

          {/* TIME STEP */}
          {step === "time" && (
            <motion.div
              key="time"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white/50 text-xs mb-3">Select a time</p>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => selectTime(time)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedTime === time
                        ? "bg-[#EDFF21] text-[#101014] border-[#EDFF21]"
                        : "bg-white/5 border-white/10 text-white/60 hover:border-[#EDFF21]/40 hover:text-white"
                    }`}
                  >
                    <Clock size={12} className="opacity-40" />
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* DETAILS STEP */}
          {step === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-white/50 text-xs mb-3">Your details</p>
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#EDFF21]/40 transition-colors">
                  <User size={14} className="text-white/25 shrink-0" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Your name"
                    className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#EDFF21]/40 transition-colors">
                  <Mail size={14} className="text-white/25 shrink-0" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Your email"
                    className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-white/20"
                  />
                </div>

                <div className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-[#EDFF21]/40 transition-colors">
                  <MessageSquare
                    size={14}
                    className="text-white/25 mt-0.5 shrink-0"
                  />
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="What would you like to discuss?"
                    rows={2}
                    className="flex-1 bg-transparent text-white text-xs outline-none placeholder:text-white/20 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-[#EDFF21] text-[#101014] font-semibold text-xs hover:brightness-110 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <Loader2 size={13} className="animate-spin" />
                      Creating event...
                    </span>
                  ) : (
                    "Confirm Meeting"
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* CONFIRMED STEP */}
          {step === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-[#EDFF21]/10 flex items-center justify-center mx-auto mb-3">
                  <Check size={20} className="text-[#EDFF21]" />
                </div>
                <h3 className="text-white font-semibold text-sm mb-0.5">
                  {autoCreated ? "Meeting Created!" : "Meeting Scheduled!"}
                </h3>
                <p className="text-white/40 text-xs mb-1">
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </p>
                {autoCreated && (
                  <p className="text-[#EDFF21]/60 text-[10px] mb-3">
                    Calendar invite sent to both parties
                  </p>
                )}
                {!autoCreated && <div className="mb-3" />}

                <div className="flex flex-col gap-2">
                  {meetLink && (
                    <a
                      href={meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-[#EDFF21] text-[#101014] font-semibold text-xs hover:brightness-110 transition-all"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                      Join Google Meet
                    </a>
                  )}
                  <a
                    href={googleCalUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 w-full py-2 rounded-xl font-semibold text-xs hover:brightness-110 transition-all ${
                      meetLink
                        ? "bg-white/10 text-white hover:bg-white/15"
                        : "bg-[#EDFF21] text-[#101014]"
                    }`}
                  >
                    <CalendarDays size={13} />
                    {autoCreated ? "View in Google Calendar" : "Add to Google Calendar"}
                  </a>
                  <button
                    onClick={downloadICS}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition-colors"
                  >
                    <Download size={13} />
                    Download .ics File
                  </button>
                  <button
                    onClick={sendEmail}
                    className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white/10 text-white font-medium text-xs hover:bg-white/15 transition-colors"
                  >
                    <Mail size={13} />
                    Send Email to Jayson
                  </button>
                </div>

                <button
                  onClick={onBack}
                  className="mt-3 text-white/30 text-[10px] hover:text-white/50 transition-colors"
                >
                  Back to chat
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── Main Chatbot ──

const SUGGESTED_QUESTIONS = [
  "What are Jayson's skills?",
  "Tell me about his projects",
  "Schedule a meeting",
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Jayson's portfolio assistant. Ask me anything about his skills, projects, or services!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [schedulingMode, setSchedulingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !showScheduler) {
      inputRef.current?.focus();
    }
  }, [isOpen, showScheduler]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const isSchedulingIntent =
      /schedul|book.*(meeting|call)|set.*(meeting|call)|meeting|appointment/i.test(
        messageText
      );

    const userMessage: Message = { role: "user", content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    // Conversational scheduling flow
    if (schedulingMode || isSchedulingIntent) {
      if (!schedulingMode) setSchedulingMode(true);
      try {
        // Only send scheduling-related turns
        const convo = newMessages.filter((_, i) => i > 0);
        const parseRes = await fetch("/api/parse-schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: convo }),
        });
        const parsed = await parseRes.json();

        const replyText: string =
          parsed.reply || "Could you share the missing details?";
        const missing: string[] = parsed.missing || [];

        if (
          missing.length === 0 &&
          parsed.date &&
          parsed.time &&
          parsed.name &&
          parsed.email
        ) {
          // All info present — create the event
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: replyText },
          ]);

          const schedRes = await fetch("/api/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              date: new Date(parsed.date).toISOString(),
              time: parsed.time,
              name: parsed.name,
              email: parsed.email,
              message: parsed.message || "Meeting scheduled via chatbot",
            }),
          });
          const schedData = await schedRes.json();

          if (schedData.success) {
            const prettyDate = new Date(parsed.date).toLocaleDateString(
              "en-US",
              { weekday: "long", month: "long", day: "numeric", year: "numeric" }
            );
            let successMsg = `✅ **Meeting Created!**\n${prettyDate} at ${parsed.time}\nInvites sent to both parties.`;
            if (schedData.meetLink) {
              successMsg += `\n\n[Join Google Meet](${schedData.meetLink})`;
            }
            if (schedData.htmlLink) {
              successMsg += `\n[View in Google Calendar](${schedData.htmlLink})`;
            }
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: successMsg },
            ]);
            setSchedulingMode(false);
          } else {
            const fallbackUrl = schedData.googleCalendarUrl;
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: fallbackUrl
                  ? `I couldn't auto-create the event, but you can [add it to Google Calendar here](${fallbackUrl}).`
                  : "Sorry, I couldn't create the meeting. Please try again or email caburatanjayson92@gmail.com.",
              },
            ]);
            setSchedulingMode(false);
          }
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: replyText },
          ]);
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, something went wrong while scheduling. Please try again or email caburatanjayson92@gmail.com.",
          },
        ]);
        setSchedulingMode(false);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.filter((_, i) => i > 0),
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please try again or reach out to Jayson directly at caburatanjayson92@gmail.com",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const showSuggestions = messages.length <= 1 && !isLoading;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-[360px] max-sm:w-[calc(100vw-48px)] max-sm:right-[-12px] bg-[#1a1a1f] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "500px" }}
          >
            <AnimatePresence mode="wait">
              {showScheduler ? (
                <motion.div
                  key="scheduler"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="flex flex-col h-full"
                >
                  <MiniScheduler onBack={() => setShowScheduler(false)} />
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="flex flex-col h-full"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-[#101014] border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#EDFF21] animate-pulse" />
                      <span className="text-white font-medium text-sm">
                        Chat with Jayson&apos;s AI
                      </span>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="text-white/50 hover:text-white transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${
                          msg.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "bg-[#EDFF21] text-[#101014] rounded-br-md"
                              : "bg-white/10 text-white/90 rounded-bl-md"
                          }`}
                        >
                          {msg.role === "assistant"
                            ? formatMessage(msg.content)
                            : msg.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 px-3 py-2 rounded-2xl rounded-bl-md">
                          <Loader2
                            size={16}
                            className="animate-spin text-white/50"
                          />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Suggested Questions */}
                  {showSuggestions && (
                    <div className="px-4 pb-2 flex flex-wrap gap-2">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() =>
                            q === "Schedule a meeting"
                              ? sendMessage(q)
                              : sendMessage(q)
                          }
                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                            q === "Schedule a meeting"
                              ? "border-[#EDFF21]/30 text-[#EDFF21]/70 hover:text-[#EDFF21] hover:border-[#EDFF21]/60"
                              : "border-white/10 text-white/60 hover:text-white hover:border-[#EDFF21]/50"
                          }`}
                        >
                          {q === "Schedule a meeting" && (
                            <CalendarDays
                              size={11}
                              className="inline-block mr-1 -mt-0.5"
                            />
                          )}
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="px-3 py-3 border-t border-white/10">
                    <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Jayson..."
                        className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        className="text-[#EDFF21] disabled:text-white/20 transition-colors"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#EDFF21] text-[#101014] flex items-center justify-center shadow-lg shadow-[#EDFF21]/20 hover:shadow-[#EDFF21]/40 transition-shadow"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
