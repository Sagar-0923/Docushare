const express = require('express')
const dotEnv = require('dotenv')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const userRoutes=require('./routes/usereroutes')
const documentRoutes=require('./controllers/documentcontroller')
const editorRoutes=require('./controllers/editorcontroller')
const PORT = process.env.PORT || 3001;
const cors = require('cors');
const app=express()
dotEnv.config()
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(()=>{
    console.log("MongoDB connected Succesfully");
})
.catch((error)=>{
    console.log(`${error}`)
})
app.use(cors());
app.use(bodyParser.json());
app.use('/users', userRoutes);
app.use('/', documentRoutes);
app.use('/editor', editorRoutes)
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`);});