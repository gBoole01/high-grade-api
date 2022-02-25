import { NextFunction, Request, Response, Router } from "express";
import Controller from "../interfaces/Controller.interface";
import RequestWithUser from "../interfaces/RequestWithUser.interface";
import authenticationMiddleware from "../middlewares/authentication.middleware";
import postModel from "../post/post.model";
import userModel from "./user.model";
import UserNotFoundException from "../exceptions/UserNotFoundException";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";

export default class UserController implements Controller {
    public path = '/users';

    public router = Router();

    private postModel = postModel;

    private userModel = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, authenticationMiddleware, this.getUserById);
        this.router.get(`${this.path}/:id/posts`, authenticationMiddleware, this.getAllPostsOfUser);
    }

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const userQuery = this.userModel.findById(id);
        if (request.query.withPosts === 'true') {
            userQuery.populate('posts');
        }
        const user = await userQuery;
        if (user) {
            response.send(user);
        }
        next(new UserNotFoundException(id));
    }

    private getAllPostsOfUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        const userId = request.params.id;
        if (userId === request.user._id.toString()) {
            const posts = await this.postModel.find({ author: userId });
            response.send(posts);
        }
        next(new NotAuthorizedException());
    }
}
