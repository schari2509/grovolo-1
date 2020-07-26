const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app=express()
const path = require('path')
app.use(express.json())

const db=config.get('mongoURI')

mongoose.connect(db,{ useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex:true } )
    .then(()=>console.log('MongoDB connected'))
    .catch((err)=>console.log('Connection failed'))

app.use('/api/items',require('./routes/api/items'))
app.use('/api/users',require('./routes/api/users'))
app.use('/api/auth',require('./routes/api/auth'))


//serve static assets in production
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/built'))

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','built','index.html'))
    })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));