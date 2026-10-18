import http from "node:http";
http
  .createServer(async (req, res) => {
    res.setHeader("Content-Type", "application/json");
    if (req.url === "/health") {
      res.end('{"ok":true}');
      return;
    }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const body = JSON.parse(raw || "{}");
    if (req.url === "/api/chat") {
      if (body.text === "fail") {
        res.writeHead(503);
        res.end("{}");
        return;
      }
      if (
        !/^web:[A-Za-z0-9-]{1,64}$/.test(body.handle) ||
        typeof body.text !== "string"
      ) {
        res.writeHead(422);
        res.end("{}");
        return;
      }
      if (body.text === "slow") await new Promise((r) => setTimeout(r, 1500));
      res.end(
        JSON.stringify({
          reply: "Test reply: what town or ZIP code should I look near?",
        }),
      );
      return;
    }
    if (req.url === "/partners") {
      res.end('{"received":true}');
      return;
    }
    res.writeHead(404);
    res.end("{}");
  })
  .listen(4010, "127.0.0.1");
