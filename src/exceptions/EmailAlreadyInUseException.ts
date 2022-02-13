import HttpException from "./HttpException";

export default class EmailAlreadyInUseException extends HttpException {
    constructor(email: string) {
        super (400, `Email ${email} already used`);
    }
}
