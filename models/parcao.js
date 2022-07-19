const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

// Image schema inside Parcao
const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
});
//

// Enables mongoose to pass JSON stringfy as properties when using virtual schema
const opts = {
    toJSON: {
        virtuals: true
    }
}
//

const ParcaoSchema = new Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, opts)

ParcaoSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <a href="/parcaos/${this._id}">${this.title}</a>
    <p>${this.description.substring(0,50)}...</p>
    `
});

ParcaoSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Parcao', ParcaoSchema);