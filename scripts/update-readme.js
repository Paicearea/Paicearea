const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");

const FEED_URL = "https://paicearea.tistory.com/rss";
const README_PATH = "README.md";
const MAX_ITEMS = 5;

(async () => {
  try {
    const res = await axios.get(FEED_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
      },
    });

    const parsed = await xml2js.parseStringPromise(res.data);
    const items = parsed.rss.channel[0].item.slice(0, MAX_ITEMS);

    const formattedPosts = items
      .map((item) => `- [${item.title[0]}](${item.link[0]})`)
      .join("\n");

    const readme = fs.readFileSync(README_PATH, "utf-8");
    const updated = readme.replace(
      /<!-- BLOG-POST-LIST:START -->([\s\S]*?)<!-- BLOG-POST-LIST:END -->/,
      `<!-- BLOG-POST-LIST:START -->\n${formattedPosts}\n<!-- BLOG-POST-LIST:END -->`
    );

    fs.writeFileSync(README_PATH, updated);
    console.log("✅ README.md updated with latest blog posts.");
  } catch (err) {
    console.error("❌ Failed to update README:", err.message);
  }
})();
