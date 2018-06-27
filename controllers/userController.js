const { User } = require('../models');

const getUserProfile = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUserProfile
};
