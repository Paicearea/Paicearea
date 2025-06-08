const Parser = require("rss-parser");
const fs = require("fs");

const parser = new Parser();
const FEED_URL = "https://paicearea.tistory.com/rss";
const README_PATH = "README.md";
const MAX_ITEMS = 5;

(async () => {
  try {
    const feed = await parser.parseURL(FEED_URL);
    const latestPosts = feed.items.slice(0, MAX_ITEMS);

    const formattedPosts = latestPosts
      .map((item) => `- [${item.title}](${item.link})`)
      .join("\n");

    const readme = fs.readFileSync(README_PATH, "utf-8");
    const updated = readme.replace(
      /<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
      `<!-- BLOG-POST-LIST:START -->\n${formattedPosts}\n<!-- BLOG-POST-LIST:END -->`
    );

    fs.writeFileSync(README_PATH, updated);
    console.log("✅ README.md updated with latest blog posts.");
  } catch (err) {
    console.error("❌ Failed to update README:", err);
  }
})();
