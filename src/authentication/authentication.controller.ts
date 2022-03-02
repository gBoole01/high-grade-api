import * as bcrypt from 'bcrypt';
import * as express from 'express';
import Controller from '../interfaces/Controller.interface';
import AuthenticationService from './authentication.service';
import userModel from '../users/user.model';
import validationMiddleware from '../middlewares/validation.middleware';
import CreateUserDto from '../users/user.dto';
import LogInDto from './logIn.dto';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

export default class AuthenticationController implements Controller {
    public path = '/auth';

    public router = express.Router();

    private authenticationService = new AuthenticationService();

    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.get(`${this.path}/logout`, this.loggingOut);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;
        try {
            const {
                cookie,
                user,
            } = await this.authenticationService.register(userData);
            response.setHeader('Set-Cookie', [cookie]);
            response.send(user);
        } catch (error) {
            next(error);
        }
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        const user = await this.user.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(
                logInData.password,
                user.get('password', null, { getters: false }),
            );
            if (isPasswordMatching) {
                const tokenData = this.authenticationService.createToken(user);
                response.setHeader('Set-Cookie', [this.authenticationService.createCookie(tokenData)]);
                response.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    private loggingOut = (_request: express.Request, response: express.Response) => {
        response.setHeader('Set-Cookie', ['Authorizatio;Max-age=0']);
        response.sendStatus(200);
    }
}
