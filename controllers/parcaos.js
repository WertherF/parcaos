// Models
const Parcao = require('../models/parcao');
//

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapboxToken })

const objectId = require('mongoose').Types.ObjectId;
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const parcaos = await Parcao.find({})
    res.render('parcaos/index.ejs', { parcaos })
}


module.exports.newParcaoForm = (req, res) => {
    res.render('parcaos/new')
}

module.exports.createParcao = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.parcao.location,
        limit: 1
    }).send()
    const parcao = new Parcao(req.body.parcao);
    parcao.geometry = geoData.body.features[0].geometry
    parcao.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    parcao.author = req.user._id
    await parcao.save();
    console.log(parcao)
    req.flash('success', 'Parcão criado com sucesso! :D')
    res.redirect(`/parcaos/${parcao._id}`)
}

module.exports.showParcao = async (req, res) => {
    const { id } = req.params;
    if (!objectId.isValid(id)) {
        req.flash('error', 'Não encontramos esse Parcão, tente procurar um outro!')
        return res.redirect('/parcaos')
    }

    const parcao = await Parcao.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!parcao) {
        req.flash('error', 'Não encontramos esse Parcão, tente procurar um outro!')
        return res.redirect('/parcaos')
    }
    res.render('parcaos/show.ejs', { parcao })
}

module.exports.editParcaoForm = async (req, res) => {
    const { id } = req.params;
    if (!objectId.isValid(id)) {
        req.flash('error', 'object id Parcão, tente procurar um outro!')
        return res.redirect('/parcaos')
    }

    const parcao = await Parcao.findById(id);

    if (!parcao) {
        req.flash('error', 'Não encontramos esse Parcão, tente procurar um outro!')
        return res.redirect('/parcaos')
    }
    res.render('parcaos/edit', { parcao })
}

module.exports.editParcao = async (req, res) => {
    const { id } = req.params;
    const parcao = await Parcao.findByIdAndUpdate(id, { ...req.body.parcao });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    parcao.images.push(...imgs)
    await parcao.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await parcao.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Parcão atualizado com sucesso! :D')
    res.redirect(`/parcaos/${parcao._id}`)
}

module.exports.deleteParcao = async (req, res) => {
    const { id } = req.params;
    const parcao = await Parcao.findByIdAndDelete(id);
    for (let image of parcao.images) {
        await cloudinary.uploader.destroy(image.filename);
    }
    req.flash('success', 'Parcão excluído com sucesso! :D')
    res.redirect(`/parcaos`)
}