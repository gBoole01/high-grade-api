import * as mongoose from 'mongoose';
import User from '../interfaces/User.interface';

const addressSchema = new mongoose.Schema({
    city: String,
    street: String,
})

const userSchema = new mongoose.Schema({
    address: addressSchema,
    name: String,
    email: String,
    password: String,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel
