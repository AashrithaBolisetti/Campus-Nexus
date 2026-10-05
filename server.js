const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Item = require("./models/Item");
const Question = require("./models/Question");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/campusNexus")
.then(()=>console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ---------- AUTH ---------- */

app.post("/signup", async (req,res)=>{
    try{
        const user = new User(req.body);
        await user.save();
        res.status(200).send("User registered");
    }
    catch(error){
        console.log("Signup error:", error);
        res.status(500).send("Signup failed");
    }
});

app.post("/login", async (req,res)=>{
    const {email,password} = req.body;

    const user = await User.findOne({email,password});

    if(user){
        res.json(user);
    } else {
        res.status(401).send("Invalid credentials");
    }
});

/* ---------- ITEMS ---------- */

app.post("/items", async (req,res)=>{
    const item = new Item(req.body);
    await item.save();
    res.send("Item added");
});

app.get("/items", async (req,res)=>{
    const items = await Item.find();
    res.json(items);
});

app.delete("/items/:id", async (req,res)=>{
    await Item.findByIdAndDelete(req.params.id);
    res.send("Item removed");
});

/* ---------- QUESTIONS ---------- */

app.post("/questions", async (req,res)=>{
    const question = new Question(req.body);
    await question.save();
    res.send("Question saved");
});

app.get("/questions", async (req,res)=>{
    const questions = await Question.find();
    res.json(questions);
});

app.put("/questions/:id", async (req,res)=>{
    await Question.findByIdAndUpdate(req.params.id,{
        answered:true,
        answer:req.body.answer
    });
    res.send("Answered");
});

/* ---------- START SERVER ---------- */

app.listen(3000, ()=>{
    console.log("Server running on port 3000");
});