import { findDocument } from '../../../DB/db.methods.js'
import Message from '../../../DB/models/message.model.js'
import User from '../../../DB/models/user.model.js'

//...........................send messages..................................
export const sendMessage = async (req,res,next)=>{
    const {content} = req.body
    const {sendTo} = req.params

    /* const isUserExists = await User.findById(sendTo)
    if(!isUserExists){
        return res.status(404).json({message:'user not found'})
    }*/

    const isUserExists = await findDocument(User, {sendTo})
    if(!isUserExists)
        return res.status(isUserExists.status).json({message: isUserExists.msg})

    const createdMessage = await Message.create({content,sendTo})
    if(!createdMessage){
        return res.status(400).json({message:'message creation failed'})
    }
    return res.status(201).json({message:'message creation success', createdMessage})
}

//......................... delete...............................
export const deleteMessage= async(req,res,next)=>{

    const {loggedinUserid,messageId}= req.query
    
    const deleting = await Message.findOneAndDelete({_id: messageId,sendTo: loggedinUserid})
    if(!deleting) return res.status(404).json({ message:'deleting failed' })
    return res.status(200).json({ message: 'deleted successfully'})
    
    
}

//.........................mark as read .................................
export const markMessageAsRead = async (req, res, next) => {
    const { loggedinUserid, messageId } = req.query

    const UpdateMessage = await Message.findByIdAndUpdate(
        { _id: messageId, sendTo: loggedinUserid, isViewed: false },
        { isViewed: true, $inc: { __v: 1 } },
        { new: true }
    )

if (!UpdateMessage)return res.status(404).json({ message: 'update fail' })
return res.status(200).json({ message:'update success' })

}

//........................ list ................................
export const listUserMessages = async (req,res,next)=> {
    const {loggedinUserid, isViewed} = req.query
    const messages = await Message
    .find({ sendTo: loggedinUserid, isViewed})
    .sort({ created: -1})
    res.status(200).json({message: 'your message: ', messages})
}