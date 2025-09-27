const { startServer } = require("./server");

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
