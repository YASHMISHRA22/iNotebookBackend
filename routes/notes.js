const express=require('express');
const router =express.Router();
const Notes = require("../models/Note");
const { body, validationResult } = require("express-validator");
var fetchuser=require("../middleware/fetchuser");

//Route 1: Get all the Notes using : GET "/api/notes/fetchallnotes". 
router.get('/fetchallnotes',fetchuser,async (req,res)=>{
  try {
    
    const notes= await Notes.find({user:req.user.id});
res.json(notes)
  } catch (error) {
    console.error(error.message);
      res.status(500).send("Internal Server Error");
  }
})
//Route 2: Add Notes using : POST "/api/notes/addnotes". 
router.post('/addnotes',fetchuser,[
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({min: 5,}),
  ],async (req,res)=>{
    try {
      
      const{title,description,tag}=req.body;
      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note=new Notes({
        title,description,tag,user:req.user.id
      })
      const savedNotes=await note.save()
  res.json(savedNotes)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
})
//Route 3: Update an Existing Note using : PUT "/api/notes/updatenote". Login Required
router.put('/updatenotes/:id',fetchuser,async (req,res)=>{
  try {
    const{title,description,tag}=req.body;
    //Create new Object
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};
    
    //Find the note to be updated and update it!
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Not Allowed");
    }
    note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
res.json(note)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

//Route 4: Delete an Existing Note using : DELETE "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id',fetchuser,async (req,res)=>{
  try {
    //Find the note to be deleted and delete it!
    let note=await Notes.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};
    //Allow user to delete the note if he is owner of that note
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Not Allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id)
    res.json({"success":"Note has been deleted",note:note});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

 module.exports=router;