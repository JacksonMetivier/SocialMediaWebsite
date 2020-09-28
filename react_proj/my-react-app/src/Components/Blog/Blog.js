import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import MakePost from './MakePost'
import Like from './Like'
import { trackPromise } from 'react-promise-tracker'
import LoadingIndicator from "./LoadingIndicator";
import InfiniteLoadingList from 'react-simple-infinite-loading'
import ScrollTest from './ScrollTest'

const Blog = () => {
    const [userPosts, setUserPosts] = useState({ 'data': [] })
    const [getPosts, setGetPosts] = useState(false)
    const [noPostMessage,setNoPostMessage] = useState(<span></span>)

    const { push } = useHistory();

    const getPicture = (user_data) => {
        trackPromise(Promise.all(user_data.data.map(async (post) => {
                const res = await fetch(`/profile_picture/${post.userId}`, {
                    method: 'GET',
                    headers: {
                        'Origin': 'localhost:3000',
                        'Access-Control-Request-Method': 'POST',
                        'Acces-Control-Request-Headers': {
                            'Content-Type': 'JSON'
                        }
                    }
                })
                const data = await res.blob()
                return {...post, picture: URL.createObjectURL(data)}
            })).then((user_data_data) => {
                setUserPosts({...user_data, data: user_data_data},() => {
                    if (userPosts.data.length !== 0) {
                        setNoPostMessage(<span>
                         <div className = 'no-post'>You have no posts yet... share your opinion!</div>
                         <div className = 'no-post1'>Your opinion is valuable. Make sure you share it with the world!</div>
                         </span>)
                     }
                })
            })
        )}
  

    const getUserPosts = () => {

        fetch('/blog', {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        })
            .then(res => res.json()
                .then(data => {
                    getPicture(data)
                }))

    }

    useEffect(() => {
        getUserPosts()
    }, []);

    if (getPosts) {
        getUserPosts()
        setGetPosts(false)
    }

    var items = [1,2,3,4,5,6,7,8,9,10]

    const fetchItems = (start,end) => {
        console.log('what')
        return items[start,end]
    }   
    return (
        <div className='profile'>
        <MakePost 
        setGetPosts = {setGetPosts}
        />
        <div>
                    <span>{noPostMessage}</span>
                     <ul style = {{display:'block', padding: '0',margin:'0', reversed: 'reversed'}}>{userPosts.data.map((post) => {
                        return <li className="post-container">
                        <a onClick = {() => {push(`profile/${post.userId}`)}} ><img className='post-profile-picture' src={post.picture} alt = ''/></a>
                        <div className = 'post'>
                        <a className = 'post-name' onClick = {() => {push(`profile/${post.userId}`)}}>{post.firstName} {post.lastName}</a>
                        <div className = 'post-text'> {post.post}</div>
                        <Like 
                        id = {post.postId} 
                        likes = {post.likes} 
                        dislikes = {post.dislikes}
                        userDidLike = {post.userDidLike}
                        userDidDislike = {post.userDidDislike}
                        />
                        </div>
                    </li>})}
                    </ul>
            </div>
        </div>
    )
}
export default Blog