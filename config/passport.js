const passport = require("passport")
const {users} = require ("../models")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth2").Strategy
const FacebookStrategy = require("passport-facebook").Strategy
require("dotenv").config()

//Aqui se dice q estrategia se esta usando en este caso es el local
passport.use(new LocalStrategy({
    usernameField: "email"    //por defecto viene el username como dato aqui se sustituye el username por el email
}, async(email, password, done) => {
        try {
            let results = await users.findOne({where: {email}}) //findOne busca en nuestra base de datos un regsitro con este dato
            
            if(results && results.password === password) {
                return done(null, results) //esto lo envia directo a la serializacion linea 21
            }
            return done (null, false) //si es falsa la contraseña o el correo no existe te manda directo al middleware de error
        } catch(error) {
            done(error)
        }
}))

//Estartegia de google 2.0
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID_GOOGLE,
    clientSecret: process.env.SECRET_GOOGLE,
    callbackURL: process.env.GOOGLE_REDIRECT_URL
}, (accessToken, refreshtoken, profile, done) => {
    //accesstoken: es el toque de acceso
    //refreshToken: el token tiene vigencia y por lo mismo se tiene q estar refrescando
    //profile datos del perfil
    return done(null, profile)
}))

//Estrategia de facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENTID,
    clientSecret: process.env.FB_SECRET,
    callbackURL: process.env.FB_REDIRECT_URL
},(accessToken, refreshtoken, profile, done) => {
    return done(null, profile)
}))

passport.serializeUser((profile, done) => { //esto crea una firma para poder identificar al usuario mejor
    return done (null, profile) //Aqui asignamos el id como firma
})

passport.deserializeUser(async(profile, done) => { //aqui mediante la firma creada en la serializacion se obtine los datos del usuario
    /*try {
        console.log("este es el id >>>>>>>"+id)
        let user = await users.findByPk(id, {raw:true});    //aqui se busca mediante la firma pero como es el ide pues se busca con el metodo de buscar id
        //el raw true es para solo obtener los datos del usuario y no toda la demas informacion
        done(null, user) // cuando se logra todo se coloca en el objeto de request.user
    }catch (error) {
        done(error)
    }*/
    //!Lo anterior es solo funcional para cuando el acceso es por medio local para diferentes accesos como face, google y local
    try{
        console.log(profile)
        switch(profile.provider){

            //*provedor de google
            
            case 'google':
                profile.firstname = profile.name.givenName
                profile.lastname = profile.name.familyName
                done(null,profile)
                break
            
            //*provedor de face
            
            case 'facebook':
                
                profile.firstname = profile.displayName
                profile.lastname = ""
                done(null,profile)
                break

            //*provedor por local

            default: 
                let user = await users.findByPk(profile.id, {plain: true})
                done(null, user)
                break
        }
    }catch(error) {
        done(error)
    }
})