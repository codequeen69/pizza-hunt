const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReplySchema = new Schema (
    {
        //we are creating a unique replyId instead of the default _id that's created
        //but we want it to be the same type of ObjectId() value like _id so we import Type up top
        //and give replyId Schema.Type.ObjectId
        replyId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId()
        },
        replyBody:{
            type:String,
            required: true,
            trim: true
        },
        writtenBy:{
            type:String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: createdAtVal => dateFormat(createdAtVal)
        }
    },
    {
        toJSON: {
          getters: true
        }
      }

);

const CommentSchema = new Schema({
    writtenBy: {
        type: String,
        required: true
    },
    commentBody: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => dateFormat(createdAtVal)
    },
    //use ReplySchema to validate data for a reply
    replies: [ReplySchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters:true
        },
        id: false
    }
);

CommentSchema.virtual('replyCount').get(function() {
    return this.replies.length;
  });

const Comment = model('Comment', CommentSchema);

module.exports = Comment;