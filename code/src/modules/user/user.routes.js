import {Router} from 'express'
import * as userController from './user.controller.js'
const route = Router()

route.post('/', userController.signUp)
route.post('/signIn', userController.signIn)
route.put('/', userController.updateUser)
route.delete('/', userController.deleteUser)
route.get('/:_id', userController.getUserData)

export default route