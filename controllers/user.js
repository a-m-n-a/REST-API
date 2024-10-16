const User = require("../models/user");
const mongoose = require("mongoose");
async function handleGetAllUsers(req,res){
    const allDbUsers =await User.find({});
    return res.json(allDbUsers);
}

async function handleGetUserById(req,res){
    const id = req.params.id;
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findById(id);
        if (user) {
          return res.json(user);
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
    
    //const user = users.find((user)=>{return user.id === ID});//if i use curly braces here in the arrow function i explicitly need the return keyword
    //however, if i dont use the curly braces as follows i dont need to explicitly write return
    //const user = users.find((user)=> user.id === ID);
   
}

async function handleUpdateUserById(req,res){
    const id = req.params.id;
    const updateData = req.body; // Data sent in the request body to update the user

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        // Find the user by ID and update with the new data
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { 
          new: true, // Return the updated document
          runValidators: true // Ensure the update follows schema validation rules
        });
   
        if (updatedUser) {
          return res.json(updatedUser); // Respond with the updated user data
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
}

async function handleDeleteUserById(req,res){

    const id = req.params.id;
    
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      try {
        // Find the user by ID and delete
        const deletedUser = await User.findByIdAndDelete(id);
    
        if (deletedUser) {
          return res.json({ message: "User deleted successfully", user: deletedUser });
        } else {
          return res.status(404).json({ message: "User not found" });
        }
      } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
      }
}

async function handleCreateNewUser(req,res){
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title)
    {
        return res.status(400).json({msg: "All fields are required"});
    }
    
    const result = await User.create({
        firstName : body.first_name,
        lastName : body.last_name,
        email : body.email,
        gender : body.gender,
        jobTitle : body.job_title 
    });

    return res.status(201).json({msg : "success", id : result._id});
}

module.exports = {
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser,
} 