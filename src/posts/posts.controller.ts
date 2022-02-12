import * as express from 'express';
import Post from './post.interface';
import postModel from './posts.model';

class PostsController {
    public path = '/posts';

    public router = express.Router();

    private posts: Post[] = [
        {
            author: 'Marcin',
            content: 'Dolor sit amet',
            title: 'Lorem Ipsum'
        }
    ];

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.post(this.path, this.createAPost);
    }

    getAllPosts = (_request: express.Request, response: express.Response) => {
        postModel.find()
            .then(posts => {
                response.send(posts);
            });
    }

    createAPost = (request: express.Request, response: express.Response) => {
        const postData: Post = request.body;
        const createdPost = new postModel(postData);
        createdPost.save()
            .then(savedPost => {
                response.send(savedPost);
            });
    }
}

export default PostsController;
