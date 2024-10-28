import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    userProfilePic: {
        type: String
    },
    username: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        maxLength: 500
    },
    img: {
        type: String
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref:"User",
        default:[],
    },
    replies: {
        type: [replySchema], // replies is now an array of replySchema
        default: [] // Default to an empty array
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Post = mongoose.model('Post', postSchema);
export default Post;
