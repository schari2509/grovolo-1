const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require("config");
const jwt = require('jsonwebtoken')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

//@route POST api/auth
//@desc auth user
//@access public
router.post('/',(req,res)=>{
    const { email,password } =req.body
    if(!email || !password){
        return res.status(400).json({msg:"please enter all fields"})
    }

    User.findOne({ email })
    .then((user) => {
        if(!user) return res.status(400).json({msg:"user does not exists"})

        bcrypt.compare(password,user.password)
        .then((isMatch)=>{
            if(!isMatch) return res.status(400).json({msg:"invalid credentials"})
            jwt.sign(
                {id:user.id},
                config.get('jwtSecret'),
                {expiresIn:21600},
                (err,token)=>{
                    if(err) throw err
                    res.json({
                        token,
                        user:{
                            id:user.id,
                            name:user.name,
                            email:user.email
                        }
                    })
                }
            )
        })

    })
})

//@route GET api/auth/user
//@desc get user data
//@access private
router.get('/user',auth,(req,res)=>{
    User.findById(req.user.id)
    .select('-password')
    .then((user)=>res.json(user));
})

module.exports = router