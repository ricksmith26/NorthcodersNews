const { User } = require('../models');

const getUserProfile = (req, res, next) => {
  const { username } = req.params;
  User.find({ username: username })
    .then(user => {
      if (user.length === 0) {
        return next({
          status: 404,
          message: 'Incorrect username'
        });
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUserProfile
};
