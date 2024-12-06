import { CommentOutlined, HeartFilled, HeartOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { comment, follow, getComments, getPostById, getPostByUser, getUser, likePost, unfollow, unlike } from '../../backend/backend';
import './userProfiles.css';
import Modal from '../custom components/Modal/Modal';

export default function UserProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    //bools
    const [isFollowing, setIsFollowing] = useState(false);
    const [showButton, setShowButton] = useState(true);
    const [profile, setProfile] = useState(null);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);

    //string
    const [postRef, setPostRef] = useState('');
    const [commentContent, setCommentContent] = useState('');

    //objects
    const [highlitedPost, setHighlightedPost] = useState(null);

    //arrays
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const init = async () => {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const data = await getPostByUser(username, currentUser.username);
            const userData = await getUser(username, JSON.parse(localStorage.getItem('user')).username);

            setShowButton(currentUser.username !== username); 
            setIsFollowing(userData[0].is_followed); 
            setProfile(userData[0]);  
            setPosts(data);  
        };
        init();
    }, [username, refresh]);

    const refreshList = () => {
        setRefresh(!refresh);
    }

    const goBack = () => {
        navigate(-1);
    };

    const toggleFollow = async () => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        if (isFollowing) {
            await unfollow(currentUser.username, username);
            setIsFollowing(false);
        } else {
            await follow(currentUser.username, username);
            setIsFollowing(true);
        }
        refreshList();
    };

    const like = async (postID, likeStatus) => {
        const userID = JSON.parse(localStorage.getItem('user')).username;
        try {
            if(!likeStatus){
                await likePost(userID ?? '', postID);
            }else{
                await unlike(userID ?? '', postID)
            }
            refreshList();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const getComment = async(postID) => {
        setPostRef(postID);
        setComments([]);
        const data = await getComments(postID);
        const highlight = await getPostById(postID);
        setHighlightedPost(highlight);
        setComments(data);
        setIsCommentOpen(true)
    }

    const postComment = async() => {
        const posterID = JSON.parse(localStorage.getItem('user')).username;
        const res = await comment(postRef, commentContent, posterID);
        if(res) {
            getComment(postRef);
        }
    }

    return (
        <div className="userProfileContainer">
            <button className="goBackButton" onClick={goBack}>Go Back</button>
            <div className="holder">
                <span>{username}</span>
                {showButton && profile && (
                    <button
                        className={isFollowing ? 'unfollow' : 'follow'}
                        onClick={() => toggleFollow()}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                )}
                { posts && posts.length > 0 ? 
                posts.map((post, index) => (
                    <div key={post.id} className='post'>
                    <div className='posterInfo'>
                        <p>{post.poster_id}</p>
                    </div>
                    <p>{post.content}</p>
                    <div className='postInteractions'>
                    <button onClick={()=>like(post.id, post.is_liked)}>{!post.is_liked ? <HeartOutlined className='icon'/> : <HeartFilled className='icon'/>}{post.like_count}</button>
                        <button onClick={()=>getComment(post.id)}><CommentOutlined  className='icon'/>{post.comment_count}</button>
                    </div>
                    </div>
                )) : <>Seems like there are no posts to show</>
            }
            </div>
            <Modal isOpen={isCommentOpen} onClose={() => {setIsCommentOpen(false); refreshList();}} >
                <div className='commentContainer'>
                    <div className='postHighlight'>
                        <span>{highlitedPost ? highlitedPost.poster_id : null}</span>
                        { highlitedPost ? <>{highlitedPost.content}</> : null}
                    </div>
                        {comments ?  comments.length > 0 ? comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p className="comment-content">{comment.comment_content}</p>
                                <p className="comment-poster">Posted by: {comment.poster_id}</p>
                            </div>
                        )) : <p>No Comments</p> : null}
                    <div className='addComment'>
                    <textarea
                            rows="1"
                            placeholder="add a comment..."
                            className="modal-textarea"
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)} 
                    />
                    <button onClick={() => {
                        postComment()
                        setCommentContent('');
                        }}
                        className='addButton'
                        >add</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
