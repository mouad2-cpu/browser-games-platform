import type { JsonLdGraph, JsonLdObject, ValidationIssue, ValidationResult } from "./types";

function push(
  issues: ValidationIssue[],
  path: string,
  message: string,
  severity: ValidationIssue["severity"] = "error"
) {
  issues.push({ path, message, severity });
}

function isObject(value: unknown): value is JsonLdObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasType(node: JsonLdObject, type: string): boolean {
  const t = node["@type"];
  if (typeof t === "string") return t === type;
  if (Array.isArray(t)) return t.includes(type);
  return false;
}

function collectIds(nodes: JsonLdObject[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const node of nodes) {
    if (typeof node["@id"] !== "string") continue;
    counts.set(node["@id"], (counts.get(node["@id"]) ?? 0) + 1);
  }
  return counts;
}

function collectIdRefs(value: unknown, refs: Set<string>) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectIdRefs(item, refs));
    return;
  }
  if (!isObject(value)) return;
  if (typeof value["@id"] === "string" && Object.keys(value).length === 1) {
    refs.add(value["@id"]);
  }
  for (const child of Object.values(value)) {
    collectIdRefs(child, refs);
  }
}

function validateNode(node: JsonLdObject, path: string, issues: ValidationIssue[]) {
  if (!node["@type"]) {
    push(issues, path, "Missing @type");
    return;
  }

  if (hasType(node, "WebSite")) {
    if (!node.name) push(issues, `${path}.name`, "WebSite requires name");
    if (!node.url) push(issues, `${path}.url`, "WebSite requires url");
    if (!node.inLanguage) {
      push(issues, `${path}.inLanguage`, "WebSite should declare inLanguage", "warning");
    }
    if (!node.publisher) {
      push(issues, `${path}.publisher`, "WebSite should declare publisher", "warning");
    }
    if (!node.potentialAction) {
      push(issues, `${path}.potentialAction`, "WebSite should include SearchAction", "warning");
    }
  }

  if (hasType(node, "WebPage")) {
    if (!node.name) push(issues, `${path}.name`, "WebPage requires name");
    if (!node.url) push(issues, `${path}.url`, "WebPage requires url");
  }

  if (hasType(node, "Organization")) {
    if (!node.name) push(issues, `${path}.name`, "Organization requires name");
    if (!node.url) push(issues, `${path}.url`, "Organization requires url");
  }

  if (hasType(node, "VideoGame") || hasType(node, "SoftwareApplication")) {
    if (!node.name) push(issues, `${path}.name`, "VideoGame requires name");
    if (!node.url) push(issues, `${path}.url`, "VideoGame requires url");
    if (!node.image) push(issues, `${path}.image`, "VideoGame should include image", "warning");
    if (!node.offers) {
      push(issues, `${path}.offers`, "SoftwareApplication rich results require offers", "warning");
    }
  }

  if (hasType(node, "AggregateRating")) {
    if (node.ratingValue == null) {
      push(issues, `${path}.ratingValue`, "AggregateRating requires ratingValue");
    }
    if (node.ratingCount == null && node.reviewCount == null) {
      push(issues, `${path}.ratingCount`, "AggregateRating requires ratingCount or reviewCount");
    }
  }

  if (hasType(node, "BreadcrumbList")) {
    const items = node.itemListElement;
    if (!Array.isArray(items) || items.length === 0) {
      push(issues, `${path}.itemListElement`, "BreadcrumbList requires itemListElement");
    }
  }

  if (hasType(node, "ItemList") || hasType(node, "CollectionPage")) {
    if (!node.name) push(issues, `${path}.name`, "Collection/ItemList requires name", "warning");
  }

  if (hasType(node, "FAQPage")) {
    const entities = node.mainEntity;
    if (!Array.isArray(entities) || entities.length === 0) {
      push(issues, `${path}.mainEntity`, "FAQPage requires mainEntity questions");
    }
  }

  if (hasType(node, "ImageObject")) {
    if (!node.url && !node.contentUrl) {
      push(issues, `${path}.url`, "ImageObject requires url or contentUrl");
    }
    for (const key of ["name", "caption", "description", "contentUrl", "url"] as const) {
      if (node[key] == null || node[key] === "") {
        push(issues, `${path}.${key}`, `ImageObject should include ${key}`, "warning");
      }
    }
    if (node.width == null || node.height == null) {
      push(issues, `${path}.width`, "ImageObject should include width and height", "warning");
    }
    if (!node.encodingFormat) {
      push(issues, `${path}.encodingFormat`, "ImageObject should include encodingFormat", "warning");
    }
    if (node.representativeOfPage === undefined) {
      push(
        issues,
        `${path}.representativeOfPage`,
        "ImageObject should declare representativeOfPage",
        "warning"
      );
    }
  }
}

/**
 * Lightweight structural validation for Schema.org graphs we emit.
 * Does not replace Google's Rich Results Test — catches missing required fields early.
 */
export function validateJsonLd(data: JsonLdObject | JsonLdGraph | JsonLdObject[]): ValidationResult {
  const issues: ValidationIssue[] = [];
  const nodes: JsonLdObject[] = [];

  if (Array.isArray(data)) {
    nodes.push(...data.filter(isObject));
  } else if (isObject(data) && Array.isArray(data["@graph"])) {
    nodes.push(...(data["@graph"] as unknown[]).filter(isObject));
  } else if (isObject(data)) {
    nodes.push(data);
  } else {
    push(issues, "$", "JSON-LD payload must be an object or array");
    return { valid: false, issues };
  }

  nodes.forEach((node, index) => validateNode(node, `$[${index}]`, issues));

  const idCounts = collectIds(nodes);
  for (const [id, count] of idCounts) {
    if (count > 1) {
      push(issues, id, `Duplicate @id appears ${count} times`);
    }
  }

  const refs = new Set<string>();
  nodes.forEach((node) => collectIdRefs(node, refs));
  for (const ref of refs) {
    if (!idCounts.has(ref)) {
      // Cross-graph anchors (e.g. CollectionPage → /#website) are intentional;
      // warn instead of failing so pages don't re-emit duplicate Organization/WebSite nodes.
      push(
        issues,
        ref,
        "Reference @id is not defined in this @graph (may be a sitewide entity)",
        "warning"
      );
    }
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

/** Strip undefined keys so JSON.stringify stays clean. */
export function pruneUndefined<T extends JsonLdObject>(node: T): T {
  const out: JsonLdObject = {};
  for (const [key, value] of Object.entries(node)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      out[key] = value
        .map((item) => (isObject(item) ? pruneUndefined(item) : item))
        .filter((item) => item !== undefined);
      continue;
    }
    if (isObject(value)) {
      out[key] = pruneUndefined(value);
      continue;
    }
    out[key] = value;
  }
  return out as T;
}
