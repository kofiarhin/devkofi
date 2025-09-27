const mongoose = require("mongoose");
const User = require("../../Model/userModel");
const Mentorship = require("../../Model/mentorshipModel");
const Newsletter = require("../../Model/newsletterModel");
const Contact = require("../../Model/contactModel");
const { stores } = require("./db");

const clone = (value) => JSON.parse(JSON.stringify(value));

const generateId = () => new mongoose.Types.ObjectId().toHexString();

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
});

const createQuery = (results) => {
  const exec = async () => results.map(({ _doc }) => clone(_doc));
  return {
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
    exec,
    then: (resolve, reject) => exec().then(resolve, reject),
    catch: (reject) => exec().catch(reject),
  };
};

const setupUserModel = () => {
  User.create = jest.fn(async (data) => {
    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const doc = { _id: generateId(), ...clone(data), ...timestamps };
    stores.User.push(doc);
    return wrapDoc(doc);
  });

  User.findOne = jest.fn(async (query = {}) => {
    const doc = stores.User.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  });

  User.find = jest.fn((query = {}) => {
    const docs = stores.User.filter((item) => matchesQuery(item, query)).map(wrapDoc);
    return createQuery(docs);
  });

  User.findById = jest.fn(async (id) => {
    const doc = stores.User.find((item) => item._id.toString() === id.toString());
    return doc ? wrapDoc(doc) : null;
  });

  User.countDocuments = jest.fn(() => ({
    exec: async () => stores.User.length,
  }));
};

const setupMentorshipModel = () => {
  Mentorship.create = jest.fn(async (data) => {
    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const doc = { _id: generateId(), verified: false, ...clone(data), ...timestamps };
    stores.Mentorship.push(doc);
    return wrapDoc(doc);
  });

  Mentorship.findOne = jest.fn(async (query = {}) => {
    const doc = stores.Mentorship.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  });

  Mentorship.findOneAndUpdate = jest.fn(async (filter = {}, update = {}) => {
    const index = stores.Mentorship.findIndex((item) => matchesQuery(item, filter));
    if (index === -1) {
      return null;
    }
    const current = stores.Mentorship[index];
    if (update.$set) {
      Object.assign(current, update.$set);
    } else {
      Object.assign(current, update);
    }
    current.updatedAt = new Date().toISOString();
    stores.Mentorship[index] = current;
    return wrapDoc(current);
  });
};

const setupNewsletterModel = () => {
  Newsletter.create = jest.fn(async (data) => {
    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      subscribedAt: new Date().toISOString(),
      status: "subscribed",
    };
    const doc = { _id: generateId(), ...clone(data), ...timestamps };
    stores.Newsletter.push(doc);
    return wrapDoc(doc);
  });

  Newsletter.findOne = jest.fn(async (query = {}) => {
    const doc = stores.Newsletter.find((item) => matchesQuery(item, query));
    return doc ? wrapDoc(doc) : null;
  });

  Newsletter.find = jest.fn(async (query = {}) => {
    const docs = stores.Newsletter.filter((item) => matchesQuery(item, query));
    return docs.map((doc) => clone(doc));
  });
};

const setupContactModel = () => {
  Contact.create = jest.fn(async (data) => {
    const timestamps = {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const doc = { _id: generateId(), reqlied: false, ...clone(data), ...timestamps };
    stores.Contact.push(doc);
    return wrapDoc(doc);
  });

  Contact.find = jest.fn(async (query = {}) => {
    const docs = stores.Contact.filter((item) => matchesQuery(item, query));
    return docs.map((doc) => clone(doc));
  });

  Contact.countDocuments = jest.fn((query = {}) => ({
    exec: async () =>
      stores.Contact.filter((item) => matchesQuery(item, query)).length,
  }));
};

const setupModelMocks = () => {
  setupUserModel();
  setupMentorshipModel();
  setupNewsletterModel();
  setupContactModel();
};

module.exports = {
  setupModelMocks,
};
