const passport = require("passport")
const {users} = require ("../models")
const LocalStrategy = require("passport-local").Strategy

//Aqui se dice q estrategia se esta usando en este caso es el local
passport.use(new LocalStrategy({
    usernameField: "email"    //por defecto viene el username como dato aqui se sustituye el username por el email
}, async(email, password, done) => {
        try {
            let results = await users.findOne({where: {email}}) //findOne busca en nuestra base de datos un regsitro con este dato
            console.log(results)
            if(results && results.password === password) {
                return done(null, results) //esto lo envia directo a la serializacion linea 21
            }
            return done (null, false) //si es falsa la contraseña o el correo no existe te manda directo al middleware de error
        } catch(error) {
            done(error)
        }
}))

passport.serializeUser((user, done) => { //esto crea una firma para poder identificar al usuario mejor
    return done (null, user.id) //Aqui asignamos el id como firma
})

passport.deserializeUser(async(id, done) => { //aqui mediante la firma creada en la serializacion se obtine los datos del usuario
    try {
        let user = await users.findByPk(id, {raw:true});    //aqui se busca mediante la firma pero como es el ide pues se busca con el metodo de buscar id
        //el raw true es para solo obtener los datos del usuario y no toda la demas informacion
        done(null, user) // cuando se logra todo se coloca en el objeto de request.user
    }catch (error) {
        done(error)
    }
})