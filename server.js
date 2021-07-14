const express = require ("express")
const path = require ("path")
const app = express()
const PORT = 8000

//1. Definiendo en donde se ubicará el directorio views
app.set('views', path.join(__dirname, 'views')); 

//2. Definiendo el motor que usaremos
app.set('view engine', 'ejs');

//Configurando el directorio publico
app.use(express.static('./public'));

//MIDDLEWARS

app.get("/", (request, response)=>{

    let taskArray = [{
        "id": 1,
        "title": "Bitchip",
        "description": "Drain of R Temporal Art with Drain Dev, Perc Endo Approach"
      }, {
        "id": 2,
        "title": "Job",
        "description": "Replacement of Colic Vein with Autol Sub, Open Approach"
      }, {
        "id": 3,
        "title": "Regrant",
        "description": "Revision of Drainage Device in Thyroid Gland, Perc Approach"
      }, {
        "id": 4,
        "title": "Domainer",
        "description": "Extirpation of Matter from Papillary Muscle, Open Approach"
      }, {
        "id": 5,
        "title": "Solarbreeze",
        "description": "Release Left Ankle Joint, Percutaneous Endoscopic Approach"
      }, {
        "id": 6,
        "title": "Voltsillam",
        "description": "Drainage of Right Ankle Tendon, Percutaneous Approach"
      }, {
        "id": 7,
        "title": "Viva",
        "description": "Revision of Drain Dev in Low Bursa/Lig, Extern Approach"
      }, {
        "id": 8,
        "title": "Bitwolf",
        "description": "Extirpation of Matter from Chest Skin, External Approach"
      }, {
        "id": 9,
        "title": "Rank",
        "description": "Removal of Nonaut Sub from Finger Nail, Extern Approach"
      }, {
        "id": 10,
        "title": "Sub-Ex",
        "description": "Plain Radiography of R Jugular Vein using H Osm Contrast"
      }, {
        "id": 11,
        "title": "Alpha",
        "description": "Insertion of Int Fix into L Thumb Phalanx, Open Approach"
      }, {
        "id": 12,
        "title": "Fix San",
        "description": "Release Hymen, Open Approach"
      }, {
        "id": 13,
        "title": "Trippledex",
        "description": "Repair Bilateral Inguinal Region, Percutaneous Approach"
      }, {
        "id": 14,
        "title": "Duobam",
        "description": "Resection of Left Upper Eyelid, Open Approach"
      }, {
        "id": 15,
        "title": "Bamity",
        "description": "MRI of Oth Vein using Oth Contrast, Unenh, Enhance"
      }]

    response.render("pages/home", {title:"Vamos bien", items: taskArray})
})


app.listen (PORT, () => {
    console.log("se escucha en el puerto" + PORT)
})