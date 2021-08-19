const express = require ("express")
const path = require ("path")
const taskArray = require('./task.json')
const {users} = require("./models")
const passport = require("passport")
const session = require("express-session")
const SequelizeStore = require("connect-session-sequelize")(session.Store)

require("./config/passport")

const app = express()

let {sequelize} = require("./models")

//1. Definiendo en donde se ubicará el directorio views
app.set('views', path.join(__dirname, 'views')); 

//2. Definiendo el motor que usaremos
app.set('view engine', 'ejs');

// Middleware de terceros
app.use(session({ //!Esto ayuda a q la secion se guarde en la memoria del servidor
  secret: "juan casanova", //Cadena de caracteres con la q se va firmar esta sesion
  resave: false,  //Guarda la secion auqnue la secion haya sido modificada
  saveUninitialized: true, //Guarda la sesion aunque no este inicializada
  //store:  //Donde se va guadar la sesion
  store: new SequelizeStore({
    expiration: 24 * 60 * 60 * 1000,
    db: sequelize
  })
}))

const passportGoogleStrategy = passport.authenticate("google", {
  session: true,
  scope: ['email', 'profile']
})

const passportFacebookStrategy = passport.authenticate("facebook", {
  session: true,
  scope: ['email', 'public_profile']
})

app.use(passport.initialize()) //esto inicaliza passport para q se utilce como metodo de autentificacion 
app.use(passport.session()) // esto habilita el usu de sesiones


// Configurando el directorio publico
app.use(express.static(path.join(__dirname,'./public')));
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//MIDDLEWARS

app.get("/", (request, response)=>{

    response.render("pages/home", {title:"Vamos bien", userName: false})
})

app.get("/registro",(request, response) => {
  response.render("pages/register", {title:"Registro", userName: false})
})

app.get("/auth/google", passportGoogleStrategy)

app.get("/auth/google/callback", passport.authenticate('google', {
  successRedirect: '/task',
  failureRedirect: '/login'
}))

app.get("/auth/facebook", passportFacebookStrategy)

app.get("/auth/facebook/callback", passport.authenticate('facebook', {
  successRedirect: '/task',
  failureRedirect: '/login'
}))

app.post("/registro", async (request, response, next) => {
  let {firstname, lastname, email, password} = request.body

  try {
    let results = await users.create({firstname, lastname, email, password})
    response.redirect("/registro")
  } catch (error) {
    next (error)
  }
})

app.get("/login",(request, response) => {
  response.render("pages/login", {title: "Login", userName: false})
})

app.post("/login", passport.authenticate("local", { //Aqui utilizamos el metodo de autentificacion que definimos en el archivo pasport
    failureRedirect: "/login", //Es cuando falle la autentificacion
    successRedirect: "/task" //es cuando la autentificacion es buena
  }), (error, req, res, next) => {
  if (error) return next(error)
})

app.get("/task",(request,response) => {
  
  if(request.isAuthenticated()) {
    let fullName = `${request.user.firstname} ${request.user.lastname}`
    return response.render("pages/showTask", {title: "Tasks", items: taskArray, userName: fullName})
  }
  return response.redirect("/login")
})

app.get("/logout", (request, response)=> {
  request.logout()
  response.redirect("/login")
})

app.use((error, request, response,next) => {
  console.log(error)
  const errors = require("./utils/errorsMenssages")
  response.status(404).send(errors[error.name])
})

module.exports = app