const express = require("express");
const { handleGetAllUsers, handleGetUserById, handleUpdateUserById, handleDeleteUserById, handleCreateNewUser} = require("../controllers/user")
const router = express.Router();

router.route("/").get(handleGetAllUsers).post(handleCreateNewUser);

router
.route("/:id")
.get(handleGetUserById)
.patch(handleUpdateUserById)
.delete(handleDeleteUserById);


//browsers can only do get requests so patch ,post and delete requests will be done using postman but we will make the routes here

module.exports = router;