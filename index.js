const express = require('express');
const mongoose = require('mongoose')
const app = express();
const jwt = require('jsonwebtoken')
const secretKey='secretkey'
app.use(express.json())

const userData = [{username: 'usman', email: 'usman@test.com', password: "1234"},{username: 'ali', email: 'ali@test.com', password: "1234"},{username: 'umar', email: 'umar@test.com', password: "1234"}];

const connectDB = async() =>{
    try {
        await mongoose.connect('mongodb+srv://xusmanmalik:Xmalik123@learning.8opywcd.mongodb.net/AssignmentDB?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.error(error);
    }
}
connectDB();

function validate(req,res,next){
    if(req.body.token){
        next()
    } else {
        res.status(403).send(`Token not available`)
         next()
    }
}

app.get('/users',validate, (req,res)=>{
    res.send(userData)
})

app.post('/createuser', (req,res)=>{
    const {username,email, password} = req.body
    if(username && email && password){
    let user = userData.find(obj=>obj.username === username)
    if(user){
        res.send(`User already exits`)
    }else {
        let newUser = {
            username: username,
            email: email,
            password: password
        }
        userData.push(newUser)
        res.send(userData)
    }
    }
    else {
        res.send(`Please provide username, email and password`)
    }

})

app.put('/updateuser', (req,res)=>{
    const {username,email, password, updatedPassword} = req.body
    if(username && email && password && updatedPassword){
    let user = userData.find(obj=>obj.username === username)
    if(user){
        let userIndex = userData.findIndex(obj=>obj.name === user.name)
        userData[userIndex].password = updatedPassword; 
        res.send(userData[userIndex])
    }else {
        res.send(`Username not found`)
    }
}else{
    res.send(`Please provide username, email, password and updated password`)
}
    
})

app.delete('/deleteuser', (req,res)=>{
    const {username,email, password} = req.body
    if(username && email && password){
        let newUserData = userData.filter(obj=>obj.username !== username)
        res.send(newUserData)
    }else{
    res.send(`User doesnot exist`) 
}
})

app.post('/login', (req,res)=>{
    // const {username,password} = req.body

    const user={
        id:1,
        username: 'usman',
        email: 'usman@test.com'
    }
    
    jwt.sign({user},secretKey,{expiresIn: '1000s'}, (err,token)=>{
        res.json({token})
    })
})

app.post('/profile', verifyToken, (req,res)=>{
    jwt.verify(req.token, secretKey,(err,authData)=>{
        if(err){
            res.send({
                result: "Invalid Token"
            })
        }else {
            res.json({
                message: "Profile accessed",
                authData
            })
        }
    })

})

function verifyToken(req,res,next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ")
        const token = bearer[1]
        req.token=token
        next()
    }else {
        res.send({
            result: `Token is not Valid`
        })
    }
}


mongoose.connection.once('open', ()=>{
    console.log(`Connected to MongoDB`);
})
app.listen(3000)