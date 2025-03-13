const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth.middleware");
const { getUsersForSidebar, getMessages, sendMessage } = require("../controllers/message.controller");

// console.log({ getUsersForSidebar, getMessages, sendMessage });



router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);

router.post("/send/:id", protectRoute, sendMessage);

module.exports =  router;