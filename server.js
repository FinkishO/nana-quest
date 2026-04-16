const http = require("http");
const { execSync } = require("child_process");

const PORT = 5555;
const REPO = "FinkishO/nana-quest";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.method === "POST" && req.url === "/api/publish") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        const { content } = JSON.parse(body);
        if (!content || typeof content !== "string") {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Missing content field" }));
          return;
        }

        // 1. Get current SHA of content.js
        const shaRaw = execSync(
          `gh api repos/${REPO}/contents/content.js --jq '.sha'`,
          { encoding: "utf8", timeout: 15000 }
        ).trim();

        if (!shaRaw || shaRaw.length < 10) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Could not get file SHA" }));
          return;
        }

        // 2. Push updated content.js via GitHub Contents API
        const contentBase64 = Buffer.from(content).toString("base64");
        const payload = JSON.stringify({
          message: "Update content via editor",
          content: contentBase64,
          sha: shaRaw
        });

        execSync(
          `gh api repos/${REPO}/contents/content.js -X PUT --input - <<'GHEOF'\n${payload}\nGHEOF`,
          { encoding: "utf8", timeout: 15000, shell: "/bin/bash" }
        );

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, message: "Published! Site will update in ~30 seconds." }));
      } catch (err) {
        console.error("Publish error:", err.message);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message.substring(0, 300) }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, "0.0.0.0", () => console.log(`Publish API running on 0.0.0.0:${PORT}`));
