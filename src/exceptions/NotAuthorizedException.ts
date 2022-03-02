import HttpException from "./HttpException";

export default class NotAuthorizedException extends HttpException {
    constructor() {
        super(403, 'You are not authorized');
    }
}
