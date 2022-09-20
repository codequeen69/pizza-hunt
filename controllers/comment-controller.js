const res = require('express/lib/response');
const { Comment, Pizza } = require('../models');


const commentController = {
    //add a comment to a pizza
    addComment({ params, body }, res){
        console.log(body);
        Comment.create(body)

        .then(({_id}) => {
           return Pizza.findOneAndUpdate(
               {_id: params.pizzaId},
               //we use the MongoDB $push operator to add the comment's _id to the specific pizza we want to update
               //$push works just like it does in JavaScript by adding data to an array
               { $push: { comments: _id}},
               { new: true }
           );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        }) 
        .catch(err => res.json(err));

    },
    addReply({ params, body}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$push: {replies: body} },
            {new: true}
        )
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id!'});
                return
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
    //remove a reply
    removeReply({params}, res){
        Comment.findOneAndUpdate(
            {_id: params.commentId},
            {$pull: {replies: {replyId: params.replyId}}},
            {new: true}
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },

    //remove a comment
    removeComment({params}, res){
        Comment.findOneAndDelete({_id: params.commentId})
        .then(deletedComment =>{
            if(!deletedComment){
                return res.status(404).json({ message:'No comment with this id!'});
            }
            return Pizza.findOneAndUpdate(
                { _id: params.pizzaId },
                //MongoDB $pull removes item from array
                { $pull: { comments: params.commentId}},
                {new: true }
            );
        })
        .then(dbPizzaData => {
            if(!dbPizzaData){
                res.status(404).json({ message: 'No pizza found with this id!'});
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
};

module.exports = commentController;