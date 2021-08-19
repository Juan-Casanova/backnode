const {Router} = require ('express')

const authRouter = Router()

authRouter.get('/login')
authRouter.post('/login')
authRouter.get('/registro')
authRouter.post('/registro')