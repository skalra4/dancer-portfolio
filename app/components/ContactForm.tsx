"use client";

import { useState, type FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

type Field = { name: string; email: string; message: string };
const EMPTY: Field = { name: "", email: "", message: "" };

type Props = {
  /** Owner's email address. When provided, form submissions open a pre-filled mailto. */
  ownerEmail: string;
};

export function ContactForm({ ownerEmail }: Props) {
  const [fields, setFields] = useState<Field>(EMPTY);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Partial<Field>>({});

  function validate(): boolean {
    const errs: Partial<Field> = {};
    if (!fields.name.trim()) errs.name = "Name is required.";
    if (!fields.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!fields.message.trim()) errs.message = "Message is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Field]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    if (ownerEmail) {
      const subject = encodeURIComponent(
        `Portfolio inquiry from ${fields.name}`,
      );
      const body = encodeURIComponent(
        `Name: ${fields.name}\nEmail: ${fields.email}\n\n${fields.message}`,
      );
      window.location.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;
    }

    setSent(true);
    setFields(EMPTY);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-8 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <CheckCircle
          className="size-10 text-zinc-400 dark:text-zinc-500"
          strokeWidth={1.5}
          aria-hidden
        />
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Message sent!
        </p>
        <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
          Your email client should have opened. If it didn&apos;t, feel free to
          reach out directly.
        </p>
        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-2 text-sm text-zinc-400 underline-offset-4 transition hover:text-zinc-700 hover:underline dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={fields.name}
          onChange={handleChange}
          placeholder="Your name"
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 ${
            errors.name
              ? "border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-800"
              : "border-zinc-300 focus:ring-zinc-300 dark:border-zinc-700 dark:focus:ring-zinc-600"
          }`}
        />
        {errors.name && (
          <p
            id="contact-name-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="contact-email"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={handleChange}
          placeholder="your@email.com"
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 ${
            errors.email
              ? "border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-800"
              : "border-zinc-300 focus:ring-zinc-300 dark:border-zinc-700 dark:focus:ring-zinc-600"
          }`}
        />
        {errors.email && (
          <p
            id="contact-email-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={fields.message}
          onChange={handleChange}
          placeholder="Tell me about your project or inquiry…"
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 shadow-sm outline-none transition focus:ring-2 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-600 ${
            errors.message
              ? "border-red-400 focus:ring-red-300 dark:border-red-500 dark:focus:ring-red-800"
              : "border-zinc-300 focus:ring-zinc-300 dark:border-zinc-700 dark:focus:ring-zinc-600"
          }`}
        />
        {errors.message && (
          <p
            id="contact-message-error"
            role="alert"
            className="mt-1.5 text-xs text-red-600 dark:text-red-400"
          >
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        <Send className="size-4 shrink-0" aria-hidden />
        Send Message
      </button>
    </form>
  );
}
