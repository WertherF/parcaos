// Models
const Review = require('../models/review');
const Parcao = require('../models/parcao');
//

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const parcao = await Parcao.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    parcao.reviews.push(review);
    console.log(review)
    await review.save();
    await parcao.save();
    req.flash('info', 'Comentário adicionado com sucesso! :D')
    res.redirect(`/parcaos/${parcao._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewsId } = req.params;
    await Parcao.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } });
    await Review.findByIdAndDelete(reviewsId);
    res.redirect(`/parcaos/${id}`)
}

