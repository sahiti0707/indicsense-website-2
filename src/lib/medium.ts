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
      ["dc:creator", "creator"],
    ],
  },
});

const FEED_URL = "https://medium.com/feed/@indicsense";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractThumbnail(item: Record<string, unknown>): string | undefined {
  const thumb = item.thumbnail as { $?: { url?: string } } | string | undefined;
  if (typeof thumb === "string") return thumb;
  if (thumb?.$?.url) return thumb.$.url;
  const content = (item["content:encoded"] || item.content) as string | undefined;
  if (content) {
    const match = content.match(/<img[^>]+src="([^"]+)"/);
    if (match) return match[1];
  }
  return undefined;
}

export async function fetchMediumArticles(limit = 12): Promise<MediumArticle[]> {
  try {
    const feed = await parser.parseURL(FEED_URL);
    return (feed.items || []).slice(0, limit).map((item) => {
      const raw = item as Record<string, unknown>;
      const snippet = stripHtml(
        (item.contentSnippet || item.content || "") as string
      ).slice(0, 220);

      return {
        title: item.title || "Untitled",
        link: item.link || "",
        pubDate: item.pubDate || item.isoDate || "",
        creator: (item.creator || "Vṛttāntam") as string,
        contentSnippet: snippet + (snippet.length >= 220 ? "…" : ""),
        thumbnail: extractThumbnail(raw),
        categories: (item.categories || []) as string[],
      };
    });
  } catch (error) {
    console.error("Failed to fetch Medium feed:", error);
    return [];
  }
}
