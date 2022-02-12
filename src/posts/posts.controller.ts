import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import Post from './post.interface';
import postModel from './posts.model';
import PostNotFoundException from 'exceptions/PostNotFoundException';

class PostsController implements Controller {
    public path = '/posts';

    public router = express.Router();

    private postModel = postModel;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllPosts);
        this.router.get(`${this.path}/:id`, this.getPostById);
        this.router.post(this.path, this.createPost);
        this.router.patch(`${this.path}/:id`, this.updatePost);
        this.router.delete(`${this.path}/:id`, this.deletePost);
    }

    getAllPosts = (_request: express.Request, response: express.Response) => {
        this.postModel.find()
            .then(posts => {
                response.send(posts);
            });
    }

    getPostById = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params;
        this.postModel.findById(id)
            .then(post => {
                if (post) {
                    response.send(post);
                }
                next(new PostNotFoundException(id));
            });
    }

    createPost = (request: express.Request, response: express.Response) => {
        const postData: Post = request.body;
        const createdPost = new this.postModel(postData);
        createdPost.save()
            .then(savedPost => {
                response.send(savedPost);
            });
    }

    updatePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params;
        const postData: Post = request.body;
        this.postModel.findByIdAndUpdate(id, postData, { new: true })
            .then(post => {
                if (post) {
                    response.send(post);
                }
                next(new PostNotFoundException(id));
            });
    }

    deletePost = (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { id } = request.params;
        this.postModel.findByIdAndDelete(id)
            .then(successResponse => {
                if (successResponse) {
                    response.sendStatus(200);
                }
                next(new PostNotFoundException(id));
            });
    }
}

export default PostsController;
