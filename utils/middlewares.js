// Authentication - verifies if is logged in to access route
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'É necessário estar registrado.')
        return res.redirect('/login')
    }
    next()
}
//

// Check if parcao_id is valid to catch route error
module.exports.validateParcao = (req, res, next) => {
    const ExpressError = require('../utils/ExpressError')
    const { parcaoSchema } = require('../validationSchemas')
    const { error } = parcaoSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//

// Checks if there's a returnTo in the session to redirect later after the login
module.exports.checkReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo
    }
    next()
}
//

// Checks if current user is author and en/dis-able edit, delete
module.exports.isAuthor = async (req, res, next) => {
    const Parcao = require('../models/parcao');
    const { id } = req.params;
    const parcao = await Parcao.findById(id);
    if (!parcao.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para realizar essa ação');
        return res.redirect(`/parcaos/${id}`)
    }
    next();
}
//

// Checks if current user is author and en/dis-able edit, delete
module.exports.isReviewAuthor = async (req, res, next) => {
    const Review = require('../models/review');
    const { id, reviewsId } = req.params;
    const review = await Review.findById(reviewsId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Você não tem permissão para realizar essa ação');
        return res.redirect(`/parcaos/${id}`)
    }
    next();
}
//

//Checks if review matches the params
module.exports.validateReview = (req, res, next) => {
    const { reviewSchema } = require('../validationSchemas')
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}
//
