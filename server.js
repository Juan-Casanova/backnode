const express = require ("express")
const path = require ("path")
const taskArray = require('./task.json')
const {users} = require("./models")

const app = express()
const PORT = 8000

//1. Definiendo en donde se ubicará el directorio views
app.set('views', path.join(__dirname, 'views')); 

//2. Definiendo el motor que usaremos
app.set('view engine', 'ejs');

//Configurando el directorio publico
app.use(express.static(path.join(__dirname,'./public')));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//MIDDLEWARS

app.get("/", (request, response)=>{

    response.render("pages/home", {title:"Vamos bien", items: taskArray})
})

app.get("/registro",(request, response) => {
  response.render("pages/register")
})

app.post("/registro", async (request, response, next) => {
  let {firstname, lastname, email, password} = request.body

  try {
    let results = await users.create({firstname, lastname, email, password})
    response.redirect("/registro")
  } catch (error) {
    next (error)
  }
})

app.use((error, request, response,next) => {

  const errors = require("./utils/errorsMenssages")
  response.status(404).send(errors[error.name])
})

app.listen (PORT, () => {
    console.log("se escucha en el puerto " + PORT)
})