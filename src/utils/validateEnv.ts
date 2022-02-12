import { cleanEnv, str } from "envalid";
import 'dotenv/config';

export default function validateEnv() {
    cleanEnv(process.env, {
        MONGODB_USER: str(),
        MONGODB_PASSWORD: str(),
        MONGODB_URL: str(),
    })
}
