const express = require('express')
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync')

// Middlewares
const { validateReview } = require('../utils/middlewares')
const { isLoggedIn } = require('../utils/middlewares')
const { isReviewAuthor } = require('../utils/middlewares')
//

//Controllers
const reviews = require('../controllers/reviews')
//

//Routes
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewsId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))
//


module.exports = router;