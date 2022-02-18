import { NextFunction, Response } from "express";
import * as jwt from 'jsonwebtoken';
import RequestWithUser from "../interfaces/RequestWithUser.interface";
import DataStoredInAuthenticationToken from "../interfaces/DataStoredInAuthenticationToken.interface";
import userModel from "../users/user.model";
import WrongAuthenticationTokenException from "../exceptions/WrongAuthenticationTokenException";

async function authenticationMiddleware(request: RequestWithUser, _response: Response, next: NextFunction) {
    const { cookies } = request;
    if (cookies && cookies.Authorization) {
        const secret = process.env.JWT_SECRET_KEY;
        try {
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInAuthenticationToken;
            const { _id } = verificationResponse;
            const user = await userModel.findById(_id);
            if (user) {
                request.user = user;
                next();
            } else {
                next(new WrongAuthenticationTokenException());
            }
        } catch(error) {
            next(new WrongAuthenticationTokenException());
        }
    } else {
        next(new WrongAuthenticationTokenException());
    }
}

export default authenticationMiddleware;
