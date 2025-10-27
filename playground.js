const { fetchYoutubeVideos } = require("./server/utility/helper");

const run = async () => {
  const result = await fetchYoutubeVideos();
  console.log({ result });
};

run();
