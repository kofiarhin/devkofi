const { fetchYoutubeVideos } = require("./server/utility/helper");

const run = async () => {
  const result = await fetchYoutubeVideos();
  console.log({ result, message: "thisis a test message" });
};

run();
