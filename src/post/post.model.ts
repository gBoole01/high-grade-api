import * as mongoose from 'mongoose';
import Post from '../interfaces/Post.interface';

const postSchema = new mongoose.Schema({
    author: String,
    authorId: String,
    content: String,
    title: String,
});

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;
