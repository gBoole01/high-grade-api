import User from "./User.interface";

interface Post {
    author: User;
    content: string;
    title: string;
}

export default Post;
