const express = require('express')
const router = express.Router({ mergeParams: true });

// NPM Modules
const passport = require('passport')
//

// Middlewares
const { checkReturnTo } = require('../utils/middlewares')
const catchAsync = require('../utils/catchAsync')
//

// Controllers
const users = require('../controllers/users')
//

// Routes
router.route('/registrar')
    .get(users.newUserForm)
    .post(catchAsync(users.createUser))

router.route('/login')
    .get(users.loginUserForm)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.get('/logout', users.logoutUser)
//



module.exports = router;