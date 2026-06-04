import Parser from "rss-parser";

export interface MediumArticle {
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  contentSnippet: string;
  thumbnail?: string;
  categories: string[];
}

const parser = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "thumbnail", { keepArray: false }],
      ["content:encoded", "contentEncoded"],
      ["dc:creator", "creator"],
    ],
  },
});

const FEED_URL = "https://medium.com/feed/@indicsense";

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getNestedUrl(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  const directUrl = getString(record.url);
  if (directUrl) return directUrl;

  const attrs = record.$;
  if (attrs && typeof attrs === "object") {
    return getString((attrs as Record<string, unknown>).url);
  }

  return undefined;
}

function extractImageCandidates(html?: string): string[] {
  if (!html) return [];

  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)];
  return matches.map((match) => decodeHtmlEntities(match[1]));
}

function isUsableMediumImage(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname.toLowerCase();
    const fullUrl = parsed.href.toLowerCase();

    if (path.startsWith("/_/stat")) return false;
    if (fullUrl.includes("event=post.clientviewed")) return false;
    if (fullUrl.includes("tracking")) return false;
    if (fullUrl.includes("pixel")) return false;

    return (
      host.includes("medium.com") ||
      host.includes("mediumcdn.com") ||
      host.includes("cdn-images") ||
      host.includes("miro.medium.com")
    );
  } catch {
    return false;
  }
}

function extractThumbnail(item: Record<string, unknown>): string | undefined {
  const content = getString(item.contentEncoded) || getString(item["content:encoded"]) || getString(item.content);
  const enclosure = getNestedUrl(item.enclosure);
  const thumbnail = getNestedUrl(item.thumbnail) || getNestedUrl(item["media:thumbnail"]);

  const candidates = [
    thumbnail,
    enclosure,
    ...extractImageCandidates(content),
  ].filter((url): url is string => Boolean(url));

  return candidates.find(isUsableMediumImage);
}

function extractSnippet(item: Record<string, unknown>): string {
  const content =
    getString(item.contentSnippet) ||
    getString(item.content) ||
    getString(item.contentEncoded) ||
    getString(item["content:encoded"]) ||
    "";
  const snippet = stripHtml(content).slice(0, 220);

  if (!snippet) return "";
  return snippet + (snippet.length >= 220 ? "..." : "");
}

export async function fetchMediumArticles(limit = 12): Promise<MediumArticle[]> {
  try {
    const feed = await parser.parseURL(FEED_URL);

    return (feed.items || []).slice(0, limit).map((item) => {
      const raw = item as Record<string, unknown>;

      return {
        title: item.title || "Untitled",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || "",
        creator: (item.creator || "Vrittantam") as string,
        contentSnippet: extractSnippet(raw),
        thumbnail: extractThumbnail(raw),
        categories: (item.categories || []) as string[],
      };
    });
  } catch (error) {
    console.error("Failed to fetch Medium feed:", error);
    return [];
  }
}
