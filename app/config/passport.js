const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/userModel');

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email }).select('+password');
          if (!user) {
            return done(null, false, {
              message: 'No user found with this email'
            });
          }

          if (!(await user.correctPassword(password, user.password))) {
            return done(null, false, {
              message: 'Incorrect email or password'
            });
          }
          return done(null, user, { message: 'Logged in successful' });
        } catch (err) {
          return done(null, false, {
            message: 'Something went wrong'
          });
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
