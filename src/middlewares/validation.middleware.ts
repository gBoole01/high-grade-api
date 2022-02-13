import * as express from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import HttpException from '../exceptions/HttpException';

export default function validationMiddleware<T>(type: any, skipMissingProperties = false): express.RequestHandler {
    return (req, _res, next) => {
        validate(plainToInstance(type, req.body), { skipMissingProperties })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) =>
                        Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                }
                next()
            })
    }
}
