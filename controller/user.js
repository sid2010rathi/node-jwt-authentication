const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../model/user');
const { JWT_SECRET } = require('../utility/utility');

async function registerUser(req, res) {
    
    const {username, password: plainTextPassword} = req.body;

    if(!username || typeof username !== 'string') {
        res.json({status: 'error', error:"Invalid Username"});
        return;
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        res.json({status: 'error', error:"Invalid Password"});
        return;
    }

    if(plainTextPassword.length < 8) {
        res.json({status: 'error', error:"Password must be 8 character long"});
        return;
    }

    const password = await bcrypt.hash(plainTextPassword, 5);

    try {
        const response = await User.create({
            username,
            password
        });
        console.log("User Created: ", response);
    } catch(error) {
        console.error(error);
        if(error.code === 11000) {
            return res.json({status: 'error', error:"Invalid username/password"});
        }
        throw error;
    }

    res.json({status: 'ok'});

}

async function login(req, res) {
    const {username, password} = req.body;
    
    const user = await User.findOne({username}).lean();

    if(!user) {
        return res.json({status:"error", error:"User not found"});
    }
    
    if(await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({
            id: user._id,
            username: user.username
        }, JWT_SECRET)
        return res.json({status: 'ok', data:token});
    }
    return res.json({status: 'error', error:"Invalid username/password"});
}

async function changePassword(req, res) {
    const { token, newPassword } = req.body;

    if(!newPassword || typeof newPassword !== 'string') {
        res.json({status: 'error', error:"Invalid Password"});
        return;
    }

    if(newPassword.length < 8) {
        res.json({status: 'error', error:"Password must be 8 character long"});
        return;
    }
    
    try {
        const user = jwt.verify(token, JWT_SECRET);
    
        const _id =  user.id;

        const password = await bcrypt.hash(newPassword, 5);
        

        await User.updateOne(
            {_id},
            {
                $set: {password}
            }
        )

        return res.json({status: 'ok'});
    } catch(error) {
        console.log(error)
        return res.json({status: 'error'});
    }
}


module.exports = {
    registerUser,
    login,
    changePassword
}