const router = require('express').Router();
const { addComment, removeComment, addReply, removeReply } = require('../../controllers/comment-controller');


// /api/comments/pizzaId
router
.route('/:pizzaId')
.post(addComment);

// /api/comments/:pizzaId/:commentId
router
.route('/:pizzaId/:commentId')
//this is a put route bc technically we're not creating a new reply resource we're just updating a comment resource
//This is also reflected in the endpoint bc we make not reference to a reply resource
.put(addReply)
.delete(removeComment);

// /api/comments/:pizzaId/:commentId/:replyId
router
.route('/:pizzaId/:commentId/:replyId')
.delete(removeReply)


module.exports = router;