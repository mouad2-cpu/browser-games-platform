import type { JsonLdGraph, JsonLdObject } from "@/lib/structured-data/types";
import { validateJsonLd } from "@/lib/structured-data/validate";

type Props = {
  data: JsonLdObject | JsonLdGraph | JsonLdObject[];
};

/**
 * Server-safe JSON-LD script tag.
 * Validates in development and serializes with XSS-safe escaping for </script>.
 */
export function JsonLd({ data }: Props) {
  if (process.env.NODE_ENV !== "production") {
    const result = validateJsonLd(data);
    if (!result.valid) {
      console.warn("[JsonLd] invalid structured data:", result.issues);
    }
  }

  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
