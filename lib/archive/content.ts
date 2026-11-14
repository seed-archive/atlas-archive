import { readFile } from "node:fs/promises";
import path from "node:path";

import { marked } from "marked";

import { longGuideLinks, questionOf } from "@/lib/archive/guides";
import { BASE_PATH } from "@/lib/site";

// Long text lives in content/LOCALE/NAME.md, not in the message files. These
// files are ours, so the HTML is rendered as is.
export async function readContent(name: string, locale = "en") {
  const file = path.join(process.cwd(), "content", locale, `${name}.md`);
  return withBase(
    anchorHeadings(
      await marked.parse(longGuideLinks(await readFile(file, "utf8"))),
    ),
  );
}

// A path of this site written into the HTML: Next.js prefixes only its own links,
// so a link or a picture of the text gets the section's prefix here.
function withBase(html: string) {
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${BASE_PATH}/`);
}

// A section heading gets an id from its words, so a page can link to it.
function anchorHeadings(html: string) {
  const used = new Map<string, number>();
  return html.replace(
    /<h([2-4])>(.*?)<\/h\1>/g,
    (_, level: string, inner: string) => {
      const base = inner
        .replace(/<[^>]+>/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      // A second heading of the same words gets `-2`, so every id is unique.
      const seen = (used.get(base) ?? 0) + 1;
      used.set(base, seen);
      const id = seen === 1 ? base : `${base}-${seen}`;
      return `<h${level} id="${id}">${inner}</h${level}>`;
    },
  );
}

// The bold question that opens each guide, by its slug, for the lists of the
// guides; `folder` is `quests` for the pages of the Quests section.
export async function guideQuestions(
  slugs: string[],
  folder = "statistics",
  locale = "en",
) {
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const file = path.join(
        process.cwd(),
        "content",
        locale,
        folder,
        `${slug}.md`,
      );
      return [slug, questionOf(await readFile(file, "utf8"))] as const;
    }),
  );
  return Object.fromEntries(entries);
}
