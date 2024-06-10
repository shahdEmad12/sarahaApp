import {Router} from 'express'
import * as messageController from './message.controller.js'
const route = Router()

route.post('/:sendTo', messageController.sendMessage)
route.delete('/', messageController.deleteMessage)
route.put('/', messageController.markMessageAsRead)
route.get('/', messageController.listUserMessages)


export default route