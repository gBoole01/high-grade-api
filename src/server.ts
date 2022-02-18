import validateEnv from './utils/validateEnv';
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostController from "./post/post.controller";

validateEnv();

const app = new App(
    [
        new AuthenticationController(),
        new PostController(),
    ],
    5000,
);

app.listen();
