import * as express from 'express';
import Controller from '../interfaces/Controller.interface';
import Post from '../interfaces/Post.interface';
import PostNotFoundException from '../exceptions/PostNotFoundException';
import authenticationMiddleware from '../middlewares/authentication.middleware';
import validationMiddleware from '../middlewares/validation.middleware';
import postModel from './post.model';
import CreatePostDto from './post.dto';
import RequestWithUser from 'interfaces/RequestWithUser.interface';

class PostController implements Controller {
    public path = '/posts';

    public router = express.Router();

    private postModel = postModel;

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router
            .get(this.path, this.getAllPosts)
            .get(`${this.path}/:id`, this.getPostById)
            .post(this.path, authenticationMiddleware, validationMiddleware(CreatePostDto), this.createPost)
            .patch(`${this.path}/:id`, authenticationMiddleware, validationMiddleware(CreatePostDto, true), this.updatePost)
            .delete(`${this.path}/:id`, authenticationMiddleware, this.deletePost);
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

    createPost = (request: RequestWithUser, response: express.Response) => {
        const postData: Post = request.body;
        console.log(postData);
        const createdPost = new this.postModel({
            ...postData,
            authorId: request.user._id,
        });
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

export default PostController;
