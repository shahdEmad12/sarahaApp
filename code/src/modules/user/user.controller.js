import User from '../../../DB/models/user.model.js'
import bcrypt from 'bcryptjs'

//...........................signup..................................
export const signUp = async (req,res,next)=>{
    const {username, email, password} = req.body

    const isUserNameDuplicated = await User.findOne({username})
    if(isUserNameDuplicated){
        return res.status(409).json({message:'username already exists'})
    }

    const isEmailDuplicated = await User.findOne({email})
    if(isEmailDuplicated){
        return res.status(409).json({message:'email already exists'})
    }

    const hashedPassword = bcrypt.hashSync(password, +process.env.SALT_ROUNDS)
    const newUser = await User.create({username, email, password:hashedPassword})
    if(!newUser){
        return res.status(500).json({message:'user registration failed'})
    }
    return res.status(201).json({message:'user registration success', newUser})
}

//...........................signin..................................
export const signIn = async (req,res,next)=>{
    const {username, email, password} = req.body
    const user = await User.findOne({
        $or: [
            {username}, {email}
        ]
    })
    if(!user){
        return res.status(400).json({message:'invalid login credentials'})
    }
    const isPasswordMatch = bcrypt.compareSync(password, user.password)
    if(!isPasswordMatch){
        return res.status(400).json({message:'invalid login credentials'})
    }
    return res.status(200).json({message:'login success'})
}

//...........................update..................................
export const updateUser = async (req,res,next)=>{
    const {username, email} = req.body
    const {_id, loggedInId} = req.query
    if(_id !== loggedInId){
        return res.status(400).json({message:'update failed-unauthorized'})
    }
    let updateObject = {}
    if(username){
        const isUserNameExists = await User.findOne({username})
        if(isUserNameExists){
            return res.status(400).json({message:'username already exists'})
        }
        updateObject.username = username
    }
    if(email){
        const isEmailNameExists = await User.findOne({email})
        if(isEmailNameExists){
            return res.status(400).json({message:'email already exists'})
        }
        updateObject.email = email
    }
    
    const updating = await User.updateOne({_id},updateObject)
    if(!updating.modifiedCount){
        return res.status(400).json({message:'invalid userID'})
    }
    return res.status(200).json({message:'updated successfully'})
}

//...........................delete..................................
export const deleteUser = async (req,res,next)=>{
    const {loggedInId} = req.query
    const deleting = await User.findOneAndDelete({ _id: loggedInId })
    if(!deleting){
        return res.status(400).json({message:'deleting failed'})
    }
    return res.status(200).json({message:'deleted successfully'})
}

//...........................getuserdata..................................
export const getUserData = async (req,res,next)=>{
    const {_id} = req.params
    const getData = await User.findById({_id})
    if(!getData){
        return res.status(400).json({message:'user not found'})
    }
    return res.status(200).json({message:'done', getData})
}