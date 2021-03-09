const passport = require('passport');
const User = require('../../models/userModel');

function authController() {
  return {
    login(req, res) {
      res.render('auth/login');
    },
    postLogin(req, res, next) {
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }

        if (!user) {
          req.flash('error', info.message);
          res.redirect('/login');
        }

        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }
        });

        return res.redirect('/');
      })(req, res, next);
    },
    register(req, res) {
      res.render('auth/register');
    },
    async postRegister(req, res) {
      try {
        const { name, email, phone, password } = req.body;

        // Validate input data
        if (!name || !email || !phone || !password) {
          req.flash('error', 'All fields are required');
          req.flash('name', name);
          req.flash('email', email);
          req.flash('phone', phone);

          return res.redirect('/register');
        }

        // Check if email exists
        const user = await User.findOne({ email });
        if (user) {
          req.flash('error', 'Email is already registered');
          req.flash('name', name);
          req.flash('email', email);
          req.flash('phone', phone);

          return res.redirect('/register');
        }

        await User.create({ name, email, phone, password });

        res.redirect('/');
      } catch (err) {
        req.flash('error', 'Something went wrong');
        return res.redirect('/register');
      }
    },
    logout(req, res) {
      req.logout();
      return res.redirect('/login');
    }
  };
}

module.exports = authController;
