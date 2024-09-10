const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
const PORT = 8000;

//middleware-plugin
app.use(express.urlencoded({ extended:false}));

//ROUTES
app.get("/users",(req,res)=>{
    const html = `
    <ul>  ${ users.map((user)=>`<li>${user.first_name}</li>`).join("") }   </ul>
    `
    return res.send(html);
})

//REST API POINTS
app.get("/api/users",(req,res)=>{
    return res.json(users);
})

app
.route("/api/users/:id")
.get((req,res)=>{
    const ID = Number(req.params.id);
    const user = users.find((user)=>{return user.id === ID});//if i use curly braces here in the arrow function i explicitly need the return keyword
    //however, if i dont use the curly braces as follows i dont need to explicitly write return
    //const user = users.find((user)=> user.id === ID);
    
    if(user)
    { 
        return res.json(user);
    }
    else{
        return res.status(404).json({message: "user not found"});
    }
    
})
.patch((req,res)=>{
     const ID = Number(req.params.id);
     const userIndex = users.findIndex((user) => user.id === ID);
 
     // If the user is not found, return a 404 error response
     if (userIndex === -1) {
         return res.status(404).json({ status: "error", message: "User not found" });
     }
 
     // Get the current user object
     const user = users[userIndex];
 
     // Get the data from the request body
     const body = req.body;
 
     // Update the user's fields with the data from the request body
     users[userIndex] = { ...user, ...body };
 
     // Write the updated users array to the file
     fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
         if (err) {
             console.error("Error writing to file:", err);
             return res.status(500).json({ status: "error", message: "Failed to save data." });
         }
         return res.json({ status: "success", message: "User updated successfully" });
     });
})

.delete((req,res)=>{
    const ID = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === ID);

    // If the user is not found, return a 404 error response
    if (userIndex === -1) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    
    // Remove the user from the array
    users.splice(userIndex,1);
    
    // Write the updated users array back to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            // If an error occurs while saving, return an error response
            console.error("Error writing to file:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete data." });
        }
        // If the delete is successful, return a success response
        return res.json({ status: "success", message: "User deleted successfully" });
    });

})

// Initialize a variable to keep track of the highest ID
let highestId = users.reduce((maxId, user) => Math.max(maxId, user.id), 0);

//browsers can only do get requests so patch ,post and delete requests will be done using postman but we will make the routes here
app.post("/api/users",(req,res)=>{
    const body = req.body;

     // Increment the highest ID to get a new unique ID
     const newId = highestId + 1;
     highestId = newId;
    users.push({id: newId, ...body });
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        if (err)
        {
            console.error("Error writing to file:", err);
            return res.status(500).json({ status: "error", message: "Failed to save data." });
        }
        return res.json({status : "success", id: newId});
    })
})

app.listen(PORT,()=>{console.log(`server listening on port: ${PORT}`)});