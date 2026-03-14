const express=require('express');
require('dotenv').config();
const cookieparser=require('cookie-parser')
const cors=require('cors')
const { initDatabase } = require("./db/mysql");
const authrouter= require('./routes/auth/auth-routes')
const petRouter = require('./routes/allpets')
const shelterAdminRouter = require('./routes/shelterAdmin')
const userRouter = require('./routes/user.routes')

const app=express();
const PORT=process.env.PORT||5000;

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods:['GET','POST','DELETE','PUT'],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true
    })
)

app.use(cookieparser());
app.use(express.json());
app.use("/api/auth",authrouter);
app.use("/api/shelterAdmin" , shelterAdminRouter);
app.use("/api/pets" , petRouter);
app.use("/api/user" , userRouter);
initDatabase()
  .then(() => {
    console.log("MySQL connected");
    app.listen(PORT,()=>{
        console.log(`Server is now running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
