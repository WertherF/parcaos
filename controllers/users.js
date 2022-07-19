// Models
const User = require('../models/user');
//



module.exports.newUserForm = (req, res) => {
    res.render('users/register')
}

module.exports.createUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            } else {
                req.flash('success', 'Bem vindo ao Parcãos RJ!');
                res.redirect('/parcaos');
            }
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/registrar')
    }
}

module.exports.loginUserForm = (req, res) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res) => {
    const redirectUrl = res.locals.returnTo || '/parcaos'
    req.flash('success', "Bem vindo de volta");
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return (next(err));
        }
        req.flash('success', 'Até mais!')
        res.redirect('/parcaos')
    })
}