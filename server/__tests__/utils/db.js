const stores = {
  User: [],
  Mentorship: [],
  Newsletter: [],
  Contact: [],
};

const resetStore = (name) => {
  stores[name].length = 0;
};

const connectDB = async () => {
  Object.keys(stores).forEach(resetStore);
};

const clearDB = async () => {
  Object.keys(stores).forEach(resetStore);
};

const closeDB = async () => {
  Object.keys(stores).forEach(resetStore);
};

module.exports = {
  connectDB,
  clearDB,
  closeDB,
  stores,
};
