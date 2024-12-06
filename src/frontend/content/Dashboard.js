import { useEffect, useState } from 'react';
import './Dashboard.css';
import { CommentOutlined, EditFilled, HeartFilled, HeartOutlined, HomeFilled, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { comment, follow, getAllPosts, getComments, getFollowingPosts, getPostById, likePost, search, unlike, updatePost} from '../../backend/backend';
import { useNavigate } from 'react-router-dom';
import Modal from '../custom components/Modal/Modal';
import Button from '../custom components/Button/CButton';
import {  useUser } from '../contexts/Context';
import { post } from '../../backend/backend';
import { toast_error, toast_success } from '../../backend/toast';

export default function Dashboard(){
    const navigate = useNavigate();
    //bools
    const [isUploading, setIsUploading] = useState(false);
    const [isCommentOpen, setIsCommentOpen] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [isOnFollowing, setIsOnFollowing] = useState(false);

    //string
    const [postContent, setPostContent] = useState('');
    const [postRef, setPostRef] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [commentContent, setCommentContent] = useState('');

    //objects
    const {clearUser} = useUser();
    const [currentUser, setCurrentUser] = useState();
    const [highlitedPost, setHighlightedPost] = useState(null);

    //arrays
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);


    useEffect(() => {
        const fetchPosts = async () => {
            const parsedUser = JSON.parse(localStorage.getItem('user'));

            if(!isOnFollowing){
                const data = await getAllPosts(parsedUser ? parsedUser.username : '');
                setPosts(data);
                setCurrentUser(parsedUser);
            }else{
                const data = await getFollowingPosts(parsedUser ? parsedUser.username : '');
                setPosts(data);
                setCurrentUser(parsedUser);
            }
        };
    fetchPosts();
  }, [refresh, isOnFollowing]);

    const toFollow = async( followID) => {
        const parseduser = JSON.parse(localStorage.getItem('user'));
        const username = parseduser ? parseduser.username : '';
        
        const response = await follow(username, followID);
        if(response){
            refreshList();
        }
    }

    const refreshList = () => {
        setRefresh(!refresh);
    }

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
        const posterID = JSON.parse(localStorage.getItem('user'));
        const username = posterID ? posterID.username : '';
        const res = await comment(postRef, commentContent, username);
        if(res) {
            getComment(postRef);
        }
    }

    const like = async (postID, likeStatus) => {
        const userID = JSON.parse(localStorage.getItem('user'))
        const username = userID ? userID.username : '';
        try {
            if(!likeStatus){
                await likePost(username ?? '', postID);
            }else{
                await unlike(username?? '', postID)
            }
            refreshList();
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };
    

    const searchAndNavigate = async() => {
        if(searchValue !== '' && searchValue !== null){
            navigate(`/searchresults/${searchValue}`);
        }else{
            toast_error('Cannot search an empty text!')
        }
    }
    const navigateToProfile = (username) => {
        navigate(`/userprofile/${username}`);
    }

    const upload = async() => {
        if(postContent === ''){
            toast_error('Cannot upload empty text!');
            return;
        }
        const username =  JSON.parse(localStorage.getItem('user')) ? JSON.parse(localStorage.getItem('user')).username : '';
        const success = await post(username ,postContent);
        if(success){
            setPostContent('');
            setIsUploading(false);
            toast_success('Sucessfully Posted!');
            setPosts([]);
            const data = await getAllPosts();
            setPosts(data);
            refreshList();
        }else{
            toast_error('Something went wrong while uploading');
        }
    }

    const test = async() => {
        setIsUploading(true)
    }

    const logout = async() => {
        clearUser();
        window.location.reload();   
    }

    const getFollowing = async() => {
        setIsOnFollowing(true);
        const parsedUsername = JSON.parse(localStorage.getItem('user')).username;
        const res = await getFollowingPosts(parsedUsername);
        if(res){
            setPosts([]);
            setPosts(res);
        }else{
            toast_error('error fetching following posts');
        }
    }

    const getAll = async() => {
        setIsOnFollowing(false);
        const data = await getAllPosts();
        setPosts(data);
    }

    return (
        <div className="dashBoardContainer">
            <div className='sideContent'>
                <button onClick={() => getAll()} className={`sideButtons ${!isOnFollowing ? 'activeButton' : 'nonActiveButton'}`}><HomeFilled className='icon sideIcon'/>Home</button>
                <button onClick={() => getFollowing()} className={`sideButtons ${isOnFollowing ? 'activeButton' : 'nonActiveButton'}`}><UserOutlined className='icon sideIcon'/>Following</button>
                <button onClick={()=> test()} className='sideButtons'><EditFilled className='icon sideIcon'/>upload</button>
                <button onClick={()=> logout()} className='sideButtons warn'>logout</button>
            </div>
            <div className='mainContent'>
                { posts && posts.length > 0 ? 
                posts.map((post, index) => (
                    <div key={post.id} className='post'>
                    <div className='posterInfo'>
                        <button className='poster' onClick={()=>navigateToProfile(post.poster_id)}>{post.poster_id}</button>
                        {!post.is_following && post.poster_id !== JSON.parse(localStorage.getItem('user')).username ? <button className='follow' onClick={()=>toFollow(post.poster_id)}>Follow</button> : null}
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
            <div className='sideContent'>
                <span>Hi { currentUser ? currentUser.first_name : ''}</span>
                <div className='search'>
                    <input className='searchBar' placeholder='Search' onChange={(e) => setSearchValue(e.target.value)}/>
                    <button className='searchButton' onClick={()=>searchAndNavigate()}><SearchOutlined className='icon searchIcon'/></button>
                </div>
            </div>
            <Modal isOpen={isUploading} onClose={()=>setIsUploading(false)}>
                <div className='uploadingModal'>
                    <p className='Title'>Upload something....</p>
                    <textarea
                    rows="7"
                    placeholder="Write your post content here..."
                    className="modal-textarea"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)} 
                    />
                    <Button Title={"📤 Post"} className={"modal-post-button"} onClick={()=>upload()}/>
                </div>
            </Modal>
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
                        >add
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}