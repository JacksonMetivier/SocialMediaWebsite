import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import MakePost from '../Blog/MakePost'
import Like from '../Blog/Like'
import { trackPromise } from 'react-promise-tracker'
import LoadingIndicator from "../Blog/LoadingIndicator";
import defaultProfile from './default-profile-square.png'

const Profile = () => {
    const history = useHistory();
    const [userData, setUserData] = useState({ 'data': '' })
    const [userPosts, setUserPosts] = useState({ 'data': [] })
    const [userPicture, setUserPicture] = useState({ 'picture': '' })
    const [getPosts, setGetPosts] = useState(false)
    const [noPostMessage, setNoPostMessage] = useState(<span></span>)

    var defualtInfoStyle = {bottom: '15px', left: '0'}
    const[infoStyle,setInfoStyle] = useState(defualtInfoStyle)
    const[isInfo,setIsInfo] = useState(false)

    var defualtContactStyle = {bottom: '15px', left: '60px', width:'60px'}
    const[contactStyle,setContactStyle] = useState(defualtContactStyle)
    const[isContact,setIsContact] = useState(false)

    const infoButtonClick = () => {
        if (isInfo) {
            setInfoStyle({bottom: '15px', left: '0',animation:'button-off 0.4s'})
            setIsInfo(false)
            setIsContact(false)
        }
        else {
            setInfoStyle({bottom: '15px', left: '0',animation:'button-on 0.4s'})
            setContactStyle({bottom: '15px', left: '60px', width:'60px',animation:'button-off .4s'})
            setIsInfo(true)
            setIsContact(false)
        }
    }

    const contactButtonClick = () => {
        if (isContact) {
            setContactStyle({bottom: '15px', left: '60px', width:'60px',animation:'button-off .4s'})
            setIsContact(false)
            setIsInfo(false)
        }
        else {
            setContactStyle({bottom: '15px', left: '60px', width:'60px',animation:'button-on .4s'})
            setInfoStyle({bottom: '15px', left: '0',animation:'button-off 0.4s'})
            setIsContact(true)
            setIsInfo(false)
        }
    }

    const getPicture = async () => {

        await fetch('/profile_picture/none', {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        })
            .then(res => res.blob().then(data => {
                if (data.type === 'text/plain') {
                    setUserPicture({ 'picture': defaultProfile })
                }
                else {
                    setUserPicture({ 'picture': URL.createObjectURL(data) })
                }
            }
            ))
    }

    const getUserData = async () => {

        await fetch('/profile/none', {
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
                .then(data => setUserData(data)))
    }

    const getUserPosts = async () => {

        await trackPromise(fetch('/profile_posts/none', {
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
                    if (data.data.length == 0) {
                        setNoPostMessage(
                            <div style={{ paddingBottom: 80 }}>
                                <div className='no-post'>You have no posts yet... share your opinion!</div>
                                <div className='no-post1'>Your opinion is valuable. Make sure you share it with the world!</div>
                            </div>
                        )
                    }
                    else {
                        setNoPostMessage(<span></span>)
                    }
                    setUserPosts(data)
                })
            )
        )
    }

    // INFO BUTTON FUNCTIONS


    // CONTACT BUTTON FUNCTIONS



    useEffect(() => {
        getUserData()
        getPicture()
        getUserPosts()
    }, []);

    if (getPosts) {
        getUserPosts()
        getPicture()
        setGetPosts(false)
    }

    return (
        <div className='profile'>
            <div className='banner'>
                <img className='profile-picture' src={userPicture.picture} />
                <div className='name-box' style={{ position: 'relative' }}>
                <span id = 'info-box'>
                    <div className='name'>{userData.first_name} {userData.last_name}</div>
                    {/* INFO BUTTON */}
                    <button
                        id = 'info'
                        className = 'info-buttons'
                        style = {infoStyle}
                        onClick = {infoButtonClick}
                    >Info</button>
                    {/* CONTACT BUTTON */}
                    <button
                        id = 'contact'
                        className = 'info-buttons'
                        style ={contactStyle}
                        onClick = {contactButtonClick}
                    >Contact</button>
                    </span>
                </div>
            </div>
            {isInfo && 
            <div
            id = 'info-box' 
            className='user-info'
            >
                <p>{userData.about_me}</p>
                <p>Born {userData.DOB}</p>
                <p>Location: {userData.where_from}</p>
            </div>}
            {isContact && 
            <div 
            id = 'info-box' 
            className='user-info'
            >
                <p>You can email me at <b>{userData.email}</b></p>
                <p>You can call me at <b>{userData.phone}</b></p>
                <p></p>
            </div>}

            <MakePost
                setGetPosts={setGetPosts}
            />

            <div>
                <span>{noPostMessage}</span>
                <LoadingIndicator />
                <ul style={{ display: 'block', padding: '0', margin: '0', reversed: 'reversed' }}>{userPosts.data.map((post) => {
                    return <li className="post-container">
                        <img className='post-profile-picture' src={userPicture.picture} />
                        <div className='post'>
                            <div className='post-name'>{post.firstName} {post.lastName} </div>
                            <div className='post-text'> {post.post}</div>
                            <Like id={post.postId} />
                        </div>
                    </li>
                })}</ul>
            </div>

        </div>
    )
}
export default Profile