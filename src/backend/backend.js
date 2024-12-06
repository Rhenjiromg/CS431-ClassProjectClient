import axios from 'axios';
import { toast_error } from './toast';

/**
 * ALL queries exist here. For queries with parameters, the queries are given the parameters before being sent.
 */

const login = async(username, password) =>{
    const query = `SELECT * FROM accounts WHERE username = '${username}' AND password = '${password}'`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200 && response.data.length > 0){
            return response.data[0];
        }else{
            return null
        }
    }catch(error) {
        console.log(error);
        return null;
    }
}

const createAccount = async(username, password, firstName, lastName, email) => {
    const query = `
        INSERT INTO accounts (username, password, first_name, last_name, email)
        VALUES ('${username}', '${password}', '${firstName}', '${lastName}', '${email}');
    `;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return true;
        }
    }catch(error) {
        console.log(error)
        return null;
    }
}

const getAllPosts = async(userID) => {
    const query = `SELECT 
    posts.id,
    posts.content,
    posts.upload_date,
    posts.poster_id,
    COUNT(DISTINCT likes.user_id) AS like_count,
    COUNT(DISTINCT comments.comment_content) AS comment_count,
    EXISTS (
        SELECT 1
        FROM following
        WHERE following.follower_id = '${userID}'
        AND following.following_id = posts.poster_id
    ) AS is_following,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id = '${userID}'
        AND likes.post_id = posts.id
    ) AS is_liked
FROM 
    posts
LEFT JOIN likes 
    ON posts.id = likes.post_id
LEFT JOIN comments 
    ON posts.id = comments.post_id
GROUP BY 
    posts.id, posts.content, posts.upload_date, posts.poster_id
ORDER BY 
    posts.upload_date DESC;
`
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return [];
    }
}

const getPostById = async(postID) => {
    const query = `SELECT 
    posts.id,
    posts.content,
    posts.upload_date,
    posts.poster_id,
    COUNT(DISTINCT likes.user_id) AS like_count,
    COUNT(DISTINCT comments.comment_content) AS comment_count
FROM posts 
LEFT JOIN likes ON posts.id = likes.post_id 
LEFT JOIN comments ON posts.id = comments.post_id 
WHERE posts.id = '${postID}' 
GROUP BY posts.id, posts.content, posts.upload_date, posts.poster_id 
ORDER BY posts.upload_date DESC;`;

    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data[0];
        }
    }catch(error) {
        console.log(error)
        return [];
    }
}

const getFollowingPosts = async(userID) => {
    const query = `SELECT 
    posts.id,
    posts.content,
    posts.upload_date,
    posts.poster_id,
    COUNT(DISTINCT likes.user_id) AS like_count,
    COUNT(DISTINCT comments.comment_content) AS comment_count,
     EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id = '${userID}'
        AND likes.post_id = posts.id
    ) AS is_liked,
    EXISTS (
        SELECT 1
        FROM following
        WHERE following.follower_id = '${userID}'
        AND following.following_id = posts.poster_id
    ) AS is_following
FROM 
    posts
INNER JOIN following 
    ON posts.poster_id = following.following_id
LEFT JOIN likes 
    ON posts.id = likes.post_id
LEFT JOIN comments 
    ON posts.id = comments.post_id
WHERE 
    following.follower_id = '${userID}'
GROUP BY 
    posts.id, posts.content, posts.upload_date, posts.poster_id
ORDER BY 
    posts.upload_date DESC;
`;

    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return [];
    }

}

const follow = async(thisUser, followingUser) => {
    if(thisUser === followingUser){
        toast_error('Cannot Follow Yourself!');
        return;
    }
    const query = `INSERT INTO following (follower_id, following_id) VALUES ('${thisUser}', '${followingUser}')`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return true;
        }
    }catch(error) {
        return false;
    }
}

const likePost = async(thisUser, postID) => {
    const query = `INSERT INTO likes (user_id, post_id) VALUES ('${thisUser}', '${postID}')`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return true;
        }
    }catch(error) {
        console.log(error)
        return false;
    }
}

const getPostLikeCounts = async(postID) => {
    const query =  `SELECT COUNT(*) AS likeCount
                    FROM likes
                    WHERE postID = ${postID}`
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });
        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return null;
    }
}

const post = async(posterID, postContent) => {
    const postID = posterID + new Date().toISOString();
    const query = `INSERT INTO posts (id, content, poster_id) 
        VALUES ('${postID}', '${postContent}', '${posterID}')`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return true;
        }
    }catch(error) {
        console.log(error)
        return false;
    }
}

const search = async(searchValue) => {
    const query = `
    SELECT * FROM accounts 
    WHERE username LIKE '%${searchValue}%';
    `;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return [];
    }
}

const checkUsername = async(username) => {
    const query =  `SELECT COUNT (*) AS userCount FROM accounts WHERE username = '${username}';`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data[0].userCount === 0;
        }
    }catch(error) {
        console.log(error)
    }
}

const checkEmail = async(email) => {
    const query =  `SELECT COUNT(*) AS userCount FROM accounts WHERE email = '${email}';`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data[0].userCount === 0;
        }
    }catch(error) {
        console.log(error)
    }
}

const getComments = async(postID) => {
    const query = `SELECT CONCAT(post_id, '_', posted_at) AS unique_id, post_id,comment_content, posted_at, poster_id FROM comments WHERE post_id = '${postID}';`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
    }
}

const getPostByUser = async(userID, username) => {
    const query = `SELECT 
    posts.id,
    posts.content,
    posts.upload_date,
    posts.poster_id,
    COUNT(DISTINCT likes.user_id) AS like_count,
    COUNT(DISTINCT comments.comment_content) AS comment_count,
    EXISTS (
        SELECT 1
        FROM following
        WHERE following.follower_id = '${userID}'
        AND following.following_id = posts.poster_id
    ) AS is_following,
   EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.user_id = '${username}'
        AND likes.post_id = posts.id
    ) AS is_liked
FROM posts
LEFT JOIN likes ON posts.id = likes.post_id
LEFT JOIN comments ON posts.id = comments.post_id
WHERE posts.poster_id = '${userID}'
GROUP BY posts.id, posts.content, posts.upload_date, posts.poster_id
ORDER BY posts.upload_date DESC;`

    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return [];
    }
}

const getUser = async(username, userID) => {
    const query = `SELECT 
    accounts.*, 
    EXISTS (
        SELECT 1 
        FROM following 
        WHERE following.follower_id = '${userID}' 
        AND following.following_id = '${username}'
    ) AS is_followed
FROM accounts 
WHERE username = '${username}';`;
    try{ 
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if(response.status === 200){
            return response.data;
        }
    }catch(error) {
        console.log(error)
        return null;
    }
}

const updatePost = async(postID, userID, index) => {
    const query = `
    SELECT 
        posts.id,
        posts.content,
        posts.upload_date,
        posts.poster_id,
        COUNT(DISTINCT likes.user_id) AS like_count,
        COUNT(DISTINCT comments.comment_content) AS comment_count,
        CASE 
            WHEN EXISTS (
                SELECT 1
                FROM following
                WHERE following.follower_id = '${userID}'
                AND following.following_id = posts.poster_id
            ) THEN TRUE
            ELSE FALSE
        END AS is_following
    FROM 
        posts
    LEFT JOIN likes 
        ON posts.id = likes.post_id
    LEFT JOIN comments 
        ON posts.id = comments.post_id
    WHERE 
        posts.id = '${postID}' OR posts.upload_date <= (
            SELECT upload_date 
            FROM posts 
            WHERE id = '${postID}'
        )
    GROUP BY 
        posts.id, posts.content, posts.upload_date, posts.poster_id
    ORDER BY 
        posts.upload_date DESC
    LIMIT ${index + 1};
    `;
    try {
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

const comment = async(post_id, comment_content, poster_id) => {
    const query = `INSERT INTO comments (post_id, comment_content, poster_id) VALUES ('${post_id}' , '${comment_content}', '${poster_id}')`;
    try {
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }    
}

const unlike = async(username, postID) => {
    const query = `DELETE FROM likes WHERE user_id = '${username}' AND post_id = '${postID}';`
    try {
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }    
}
const unfollow = async(username, targetUsernamae) => {
    const query = `DELETE FROM following WHERE follower_id = '${username}' AND following_id = '${targetUsernamae}';`
    try {
        const response = await axios.post('http://localhost:3001/run-query', {
            query: query,
        });

        if (response.status === 200) {
            return true;
        }
    } catch (error) {
        console.error(error);
        return false;
    }   
}


export {
    //auth
    login, 
    createAccount,

    //get
    getAllPosts, 
    getFollowingPosts,
    getComments, 
    getPostByUser, 
    getUser, 
    getPostLikeCounts,
    getPostById,

    //check
    checkEmail, 
    checkUsername, 
    
    //update
    updatePost,

    //function
    follow,
    comment,
    likePost,  
    post,
    search, 
    unlike, 
    unfollow,
}
