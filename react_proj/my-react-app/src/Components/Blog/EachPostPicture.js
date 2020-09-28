import React, { useState } from "react";

const EachPostPicture = (props) => {
    
    const [postPicture, setPostPicture] = useState('')

    const getPicture = async (props) => {

        fetch(`/profile_picture/${props.post.userId}`, {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        })
            .then(res => res.blob().then(data => setPostPicture(URL.createObjectURL(data))))

    }
    getPicture(props)

    return (
        <img className='post-profile-picture' src={postPicture} alt = ''/>
    )
}
export default EachPostPicture