const mongoose = require("mongoose");
const Contact = require("../Model/contactModel");
const Mentorship = require("../Model/mentorshipModel");
const Newsletter = require("../Model/newsletterModel");
const User = require("../Model/userModel");

const stores = {
  Contact: [],
  Mentorship: [],
  Newsletter: [],
  User: [],
};

const clone = (value) => JSON.parse(JSON.stringify(value)); // CODex: ensure nested objects aren't mutated across calls

const generateId = () => new mongoose.Types.ObjectId().toHexString(); // CODex: reuse Mongo-style ids for consistency

const matchesQuery = (doc, query = {}) => {
  return Object.entries(query || {}).every(([key, value]) => {
    if (value && typeof value === "object" && !(value instanceof Date)) {
      if (value.$set) {
        return matchesQuery(doc, value.$set);
      }

      return Object.entries(value).every(([innerKey, innerValue]) => {
        return doc[innerKey] === innerValue;
      });
    }

    return doc[key] === value;
  });
};

const wrapDoc = (doc) => ({
  ...doc,
  _doc: { ...doc },
  toObject: () => ({ ...doc }),
  toJSON: () => ({ ...doc }),
});

const createQuery = (results) => {
  const exec = async () => results.map(({ _doc }) => clone(_doc));
  return {
    exec,
    select: (projection) => {
      if (projection === "-password") {
        return Promise.resolve(
          results.map(({ _doc }) => {
            const { password, ...rest } = _doc;
            return clone(rest);
          })
        );
      }

      return exec();
    },
    then: (resolve, reject) => exec().then(resolve, reject),
    catch: (reject) => exec().catch(reject),
  };
};

const createTimestamps = () => ({
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const ensureStore = (name) => {
  if (!stores[name]) {
    stores[name] = [];
  }

  return stores[name];
};

const setupUserModel = () => {
  const store = ensureStore("User");

  User.create = async (data = {}) => {
    const doc = {
      _id: generateId(),
      ...clone(data),
      ...createTimestamps(),
    };
    store.push(doc);
    return wrapDoc(doc);
  }; // CODex: emulate mongoose create for offline mode

  User.findOne = async (query = {}) => {
    const doc = store.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  };

  User.find = (query = {}) => {
    const docs = store.filter((item) => matchesQuery(item, query)).map(wrapDoc);
    return createQuery(docs);
  };

  User.findById = async (id) => {
    const doc = store.find((item) => item._id.toString() === id.toString());
    return doc ? wrapDoc(doc) : null;
  };

  User.countDocuments = () => ({
    exec: async () => store.length,
  });
};

const setupMentorshipModel = () => {
  const store = ensureStore("Mentorship");

  Mentorship.create = async (data = {}) => {
    const doc = {
      _id: generateId(),
      verified: false,
      ...clone(data),
      ...createTimestamps(),
    };
    store.push(doc);
    return wrapDoc(doc);
  }; // CODex: simulate persistence for mentorship onboarding during offline dev

  Mentorship.findOne = async (query = {}) => {
    const doc = store.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  };

  Mentorship.findOneAndUpdate = async (filter = {}, update = {}) => {
    const index = store.findIndex((item) => matchesQuery(item, filter));
    if (index === -1) {
      return null;
    }

    const current = store[index];
    if (update.$set) {
      Object.assign(current, update.$set);
    } else {
      Object.assign(current, update);
    }
    current.updatedAt = new Date().toISOString();
    store[index] = current;
    return wrapDoc(current);
  };
};

const setupNewsletterModel = () => {
  const store = ensureStore("Newsletter");

  Newsletter.create = async (data = {}) => {
    const doc = {
      _id: generateId(),
      status: "subscribed",
      subscribedAt: new Date().toISOString(),
      ...clone(data),
      ...createTimestamps(),
    };
    store.push(doc);
    return wrapDoc(doc);
  }; // CODex: mirror subscription writes without MongoDB

  Newsletter.findOne = async (query = {}) => {
    const doc = store.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  };

  Newsletter.find = async (query = {}) => {
    return store
      .filter((item) => matchesQuery(item, query))
      .map((doc) => clone(doc));
  };
};

const setupContactModel = () => {
  const store = ensureStore("Contact");

  Contact.create = async (data = {}) => {
    const doc = {
      _id: generateId(),
      replied: false,
      ...clone(data),
      ...createTimestamps(),
    };
    store.push(doc);
    return wrapDoc(doc);
  }; // CODex: allow contact form to store messages offline

  Contact.find = async (query = {}) => {
    return store
      .filter((item) => matchesQuery(item, query))
      .map((doc) => clone(doc));
  };

  Contact.countDocuments = (query = {}) => ({
    exec: async () => store.filter((item) => matchesQuery(item, query)).length,
  });
};

let initialized = false;

const setupInMemoryModels = () => {
  if (initialized) {
    return stores; // CODex: avoid re-binding model overrides on repeated calls
  }

  initialized = true;
  setupUserModel();
  setupMentorshipModel();
  setupNewsletterModel();
  setupContactModel();
  return stores;
};

const resetInMemoryStores = () => {
  Object.keys(stores).forEach((key) => {
    stores[key].length = 0;
  }); // CODex: wipe ephemeral state between test/dev runs
  initialized = false;
};

module.exports = {
  setupInMemoryModels,
  resetInMemoryStores,
  stores,
};
