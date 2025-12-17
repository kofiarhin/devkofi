const User = require("../models/User");

class AuthManagement {
  constructor(userData) {
    this.user = userData;
  }

  getUser() {
    return this.user;
  }

  async registerUser() {
    const { firstName, lastName, email, password } = this.user;
    await User.deleteMany();
  }
}

module.exports = AuthManagement;
