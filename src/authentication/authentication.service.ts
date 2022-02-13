import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import userModel from '../users/user.model';
import AuthenticationTokenData from '../interfaces/AuthenticationTokenData.interface';
import DataStoredInAuthenticationToken from '../interfaces/DataStoredInAuthenticationToken.interface';
import User from '../users/user.interface';
import CreateUserDto from '../users/user.dto';
import EmailAlreadyInUseException from '../exceptions/EmailAlreadyInUseException';

class AuthenticationService {
    public user = userModel;

    public async register(userData: CreateUserDto) {
        if (
            await this.user.findOne({ email: userData.email })
        ) {
            throw new EmailAlreadyInUseException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.user.create({
            ...userData,
            password: hashedPassword,
        });
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        return {
            cookie,
            user,
        };
    }

    public createCookie(tokenData: AuthenticationTokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: User): AuthenticationTokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET_KEY;
        const dataStoredInToken: DataStoredInAuthenticationToken = {
            _id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}

export default AuthenticationService;
