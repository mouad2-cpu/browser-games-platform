"use server";

import { headers } from "next/headers";
import { contactMessageDelegate, PRISMA_REGEN_HINT } from "@/lib/prisma-delegates";
import { contactSchema } from "@/lib/validators";
import { rateLimit } from "@/lib/rate-limit";

export async function submitContactForm(
  formData: FormData
): Promise<{ ok?: true; error?: string }> {
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const limit = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!limit.allowed) {
    return { error: "Too many messages. Please try again later." };
  }

  const raw = {
    issueType: formData.get("issueType") as string,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    subject: (formData.get("subject") as string) ?? "",
    message: formData.get("message") as string,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const contactMessage = contactMessageDelegate();
  if (!contactMessage) {
    return { error: PRISMA_REGEN_HINT };
  }

  const messageBody = parsed.data.subject?.trim()
    ? `Subject: ${parsed.data.subject.trim()}\n\n${parsed.data.message}`
    : parsed.data.message;

  try {
    await contactMessage.create({
      data: {
        issueType: parsed.data.issueType,
        name: parsed.data.name,
        email: parsed.data.email,
        message: messageBody,
      },
    });
  } catch (err) {
    console.error("Contact form save failed:", err);
    return { error: "Could not send your message. Please try again later." };
  }

  return { ok: true };
}
