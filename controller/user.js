const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../model/user');
const { JWT_SECRET } = require('../utility/utility');

function loginRequired(req, res, next) {
    if(req.user) {
        next();
    } else {
        res.status(401).json({message: "Unauthorized user"});
    }
}

async function registerUser(req, res) {
    
    const {username, password: plainTextPassword} = req.body;

    if(!username || typeof username !== 'string') {
        res.status(200).json({status: 'error', error:"Invalid Username"});
        return;
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        res.status(200).json({status: 'error', error:"Invalid Password"});
        return;
    }

    if(plainTextPassword.length < 8) {
        res.status(200).json({status: 'error', error:"Password must be 8 character long"});
        return;
    }

    const password = await bcrypt.hash(plainTextPassword, 5);

    try {

        await User.create({username, password}, (err, response) => {
            response.password = undefined;
            res.status(200).json({status: 'ok', data: response});
        })
        
    } catch(error) {
        console.error(error);
        if(error.code === 11000) {
            return res.status(200).json({status: 'error', error:"User already exist"});
        }
        throw error;
    }

}

async function login(req, res) {
    const {username, password} = req.body;
    
    const user = await User.findOne({username}).lean();

    if(!user) {
        return res.status(200).json({status:"error", error:"User not found"});
    }
    
    if(await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET)
        return res.status(200).json({status: 'ok', data:token});
    } else {
        return res.status(200).json({status: 'error', error:"Invalid username/password"});
    }    
}

async function changePassword(req, res) {
    const { newPassword } = req.body;

    if(!newPassword || typeof newPassword !== 'string') {
        res.status(200).json({status: 'error', error:"Invalid Password"});
        return;
    }

    if(newPassword.length < 8) {
        res.status(200).json({status: 'error', error:"Password must be 8 character long"});
        return;
    }
    
    try {
        if(req.user) {
            const user = req.user;
            const _id =  user.id;
            const password = await bcrypt.hash(newPassword, 5);
            await User.updateOne(
                {_id},
                {
                    $set: {password}
                }
            )
    
            return res.json({status: 'ok'});
        } else {
            res.status(401).json({message: "Unauthorized user"});
        }  
    } catch(error) {
        console.error(error)
        return res.status(400).json({status: 'error'});
    }
}

async function getUsers(req, res) {
    const users = await User.find({}).lean()

    if(users.length > 0) {
        return res.status(200).json({status: 'ok', data:users});
    } else {
        return res.status(200).json({status: 'error', data:"No user found"});
    }
}


module.exports = {
    registerUser,
    login,
    changePassword,
    getUsers,
    loginRequired
}