import React, { useState, useEffect } from "react";
import LIKE from '../Profile/LIKE.png'
import DISLIKE from '../Profile/DISLIKE.png'
import beforeLike from '../Profile/beforeLike.png'
import beforeDislike from '../Profile/beforeDislike.png'


const Like = (props) => {
    const [likes, setLikes] = useState({
        'likes': props.likes,
        'dislikes': props.dislikes
    })
    const [liked, setLiked] = useState(props.userDidLike)
    const [disliked, setDisliked] = useState(props.userDidDislike)

    const sendLike = async () => {

        await fetch(`/like/${props.id}/like`, {
            method: 'POST',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        })
            .then(res => res.json()
                .then(data => console.log(data)))
        if (liked) {
            setLiked(false)
        }
        else {
            setLiked(true)
            setDisliked(false)
        }
        getLike()
    }

    const sendDislike = async () => {
        await fetch(`/like/${props.id}/dislike`, {
            method: 'POST',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        })
            .then(res => res.json()
                .then(data => console.log(data)))
        if (disliked) {
            setDisliked(false)
        }
        else {
            setDisliked(true)
            setLiked(false)
        }
        getLike()

    }

    const getLike = () => {
        fetch(`/like/${props.id}/like`, {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'GET',
            }
        })
            .then(res => res.json()
                .then(data => {
                    setLikes(data)
                    setLiked(data.liked)
                    setDisliked(data.disliked)
                }))
    }

    useEffect(() => {
        getLike()
    }, []);


    if (liked === true) {
        var like = <a onClick={sendLike}><img alt='' src={LIKE} style={{ width: '17px' }} /> </a>
        var dislike = <a onClick={sendDislike}><img alt='' src={beforeDislike} style={{ width: '17px' }} /> </a>
    }
    else if (disliked === true) {
        var like = <a onClick={sendLike}><img alt='' src={beforeLike} style={{ width: '17px' }} /> </a>
        var dislike = <a onClick={sendDislike}><img alt='' src={DISLIKE} style={{ width: '17px' }} /> </a>
    }
    else {
        var like = <a onClick={sendLike}><img alt='' src={beforeLike} style={{ width: '17px' }} /> </a>
        var dislike = <a onClick={sendDislike}><img alt='' src={beforeDislike} style={{ width: '17px' }} /> </a>
    }
    return (
        <div className='like'>
            {like}<div style={{ marginLeft: '5px', marginRight: '20px' }}>{likes.likes}</div>
            {dislike}<div style={{ marginLeft: '5px' }}>{likes.dislikes}</div>
        </div>
    )
}
export default Like