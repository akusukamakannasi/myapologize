/**
 * ============================================================================
 * ZERO-DEPENDENCY LOCAL MOBILE PREVIEW SERVER
 * Run with: node serve.js
 * ============================================================================
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = 3000;
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".ico": "image/x-icon",
};

// Get local IPv4 address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  return "localhost";
}

const server = http.createServer((req, res) => {
  let reqPath = req.url.split("?")[0];
  if (reqPath === "/") reqPath = "/index.html";

  const safePath = path.normalize(path.join(__dirname, reqPath));
  if (!safePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end("403 Forbidden");
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    });

    const stream = fs.createReadStream(safePath);
    stream.pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const localIp = getLocalIpAddress();
  console.log("\n=======================================================");
  console.log("🌸 Sweet Apology Website - Mobile Smartphone Server 🌸");
  console.log("=======================================================\n");
  console.log(`📱 To open on your smartphone:`);
  console.log(`   http://${localIp}:${PORT}\n`);
  console.log(`💻 To open on your computer:`);
  console.log(`   http://localhost:${PORT}\n`);
  console.log(`💡 Make sure your phone is connected to the same Wi-Fi!`);
  console.log(`Press Ctrl + C anytime to stop the server.`);
  console.log("=======================================================\n");
});

