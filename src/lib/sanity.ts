import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "f2gpt4sb",
  dataset: "production",
  apiVersion: "2026-07-23",
  useCdn: true,
});