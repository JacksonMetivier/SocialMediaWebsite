import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom"
import MakePost from './MakePost'
import Like from './Like'
import EachPostPicture from "./EachPostPicture";
import Post from './Post'

class Blog extends React.Component {

    constructor() {
        super()
        this.state = {
            userPosts: [],
            picture: 'PICTURE'
            // newPost: false
        }
        this.getPicture = this.getPicture.bind(this)
        this.getUserPosts = this.getUserPosts.bind(this)
        // this.getNewPost = this.getNewPost.bind(this)
        // this.handleNewPost = this.handleNewPost.bind(this)
    }

    getPicture(data) {
        data.data.map((post) => {
            fetch(`/profile_picture/${post.userId}`, {
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
                    post['picture'] = URL.createObjectURL(data)
            } ))

        })
        this.setState({userPosts:data}, () => {
            console.log(this.state.userPosts)
        })

 }

    getUserPosts() {

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
                    this.getPicture(data)
                }))

    }

    // getNewPost() {

    //     fetch('/newPost', {
    //         method: 'GET',
    //         headers: {
    //             'Origin': 'localhost:3000',
    //             'Access-Control-Request-Method': 'POST',
    //             'Acces-Control-Request-Headers': {
    //                 'Content-Type': 'JSON'
    //             }
    //         }
    //     })
    //         .then(res => res.json()
    //             .then(data => { 
    //                 console.log(data)
    //                 console.log(userPosts.push(data))
    //                 setUserPosts(userPosts)
    //                 setNewPost(false)
    //             }))
    // }

    componentDidMount() {
        this.getUserPosts()
    }

    render() {

    console.log(this.state.userPosts.data)

    return (
        <div className='profile'>
        <MakePost />
        <Post userPosts = {this.state.userPosts}/>
        </div>
    )
}
}

export default Blog