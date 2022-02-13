import * as bcrypt from 'bcrypt';
import * as express from 'express';
import Controller from '../interfaces/controller.interface';
import validationMiddleware from '../middlewares/validation.middleware';
import userModel from '../users/user.model';
import CreateUserDto from '../users/user.dto';
import LogInDto from './logIn.dto';
import EmailAlreadyInUseException from '../exceptions/EmailAlreadyInUseException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';

class AuthenticationController implements Controller {
    public path = '/auth';

    public router = express.Router();

    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userData: CreateUserDto = request.body;
        if (await this.user.findOne({ email: userData.email })) {
            next(new EmailAlreadyInUseException(userData.email));
        } else {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await this.user.create({
                ...userData,
                password: hashedPassword,
            });
            user.password = undefined;
            response.send(user);
        }
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInData: LogInDto = request.body;
        const user = await this.user.findOne({ email: logInData.email });
        if (user) {
            const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
            if (isPasswordMatching) {
                user.password = undefined;
                response.send(user);
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }
}

export default AuthenticationController;
