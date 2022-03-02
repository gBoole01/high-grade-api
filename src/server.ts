import validateEnv from './utils/validateEnv';
import App from "./app";
import AuthenticationController from "./services/authentication/authentication.controller";
import PostController from "./domains/post/post.controller";
import ReportController from './services/report/report.controller';
import UserController from './domains/user/user.controller';

validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new PostController(),
        new ReportController(),
        new UserController(),
    ],
    5000,
);

app.listen();
