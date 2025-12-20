const https = require("https");

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    https.get(url, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        const ms = Date.now() - start;
        resolve({ status: res.statusCode, ms, body: data });
      });
    }).on("error", reject);
  });
}

async function main() {
  const url = process.argv[2] || "https://newsclip.com/sports/";
  const res = await fetchText(url);
  const preview = (res.body || "").slice(0, 400);

  console.log(JSON.stringify({
    url,
    status: res.status,
    ms: res.ms,
    bytes: Buffer.byteLength(res.body || "", "utf8"),
    preview
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
