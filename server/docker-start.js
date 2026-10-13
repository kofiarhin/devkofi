// Docker entry point: use the host-provided environment; never load .env here.
const app = require("./app");

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4001);

if (host !== "127.0.0.1" && host !== "::1") {
  throw new Error("Docker API must bind to loopback only");
}
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("Invalid PORT");
}

// Nginx runs on the same host; do not trust arbitrary remote proxies.
app.set("trust proxy", "loopback");

app.listen(port, host, () => {
  console.log(`DevKofi API listening on ${host}:${port}`);
});
