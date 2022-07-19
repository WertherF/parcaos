const port = 3000;
const mongoose = require('mongoose');
const Parcao = require('../models/parcao');
const bairros = require('./bairros')
const { lugar, adjetivo } = require('./nomes')

mongoose.connect('mongodb://localhost:27017/parcao', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Parcao.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const random165 = Math.floor(Math.random() * 165);
        const price = Math.floor(Math.random() * 120) + 20
        const parc = new Parcao({
            author: '62c44ef20358947421af8774',
            location: `${bairros[random165].bairro}, ${bairros[random165].municipio}`,
            geometry:{
                type: "Point",
                coordinates:[
                    bairros[random165].longitude,
                    bairros[random165].latitude,
              ]
            },
            title: `${sample(lugar)} ${sample(adjetivo)}`,
            images: [{
                url: 'https://images.unsplash.com/photo-1621533642341-bbfa81ee9d35?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
                filename: 'Teste'
            }],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore fugit error maxime vitae similique qui cum repellendus vel veniam est! Reprehenderit deleniti libero blanditiis non debitis ratione fugiat omnis ipsam!',
            price: price

        })
        await parc.save();
    }

}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })
