const express = require('express')
const router = express.Router({ mergeParams: true });

// For image uploads
const multer = require('multer')
const { storage } = require('../cloudinary/index')
const upload = multer({ storage })
//


// Middlewares
const { isLoggedIn } = require('../utils/middlewares')
const { validateParcao } = require('../utils/middlewares')
const { isAuthor } = require('../utils/middlewares')
const catchAsync = require('../utils/catchAsync')
//

// Controllers
const parcaos = require('../controllers/parcaos')
//


// Routes
router.route('/')
    .get(catchAsync(parcaos.index))
    .post(isLoggedIn, upload.array('image'), validateParcao, catchAsync(parcaos.createParcao))

router.get('/novo', isLoggedIn, parcaos.newParcaoForm)

router.route('/:id')
    .get(catchAsync(parcaos.showParcao))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateParcao, catchAsync(parcaos.editParcao))
    .delete(isLoggedIn, isAuthor, catchAsync(parcaos.deleteParcao))

router.get('/:id/modificar', isLoggedIn, isAuthor, catchAsync(parcaos.editParcaoForm))


//


module.exports = router;