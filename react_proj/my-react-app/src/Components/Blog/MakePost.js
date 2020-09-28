import React, { useState, useEffect, clearState } from "react";
import { useForm, reset } from "react-hook-form"
import { useHistory } from "react-router-dom"

const MakePost = (props) => {
    const history = useHistory();

    const { handleSubmit, register, errors, reset } = useForm()
    const [serverErrorMessage, setServerErrorMessage] = useState('')

    const onSubmit = async (values) => {
        const post_data = values

        await fetch('/blog', {
            method: 'POST',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            },
            body: JSON.stringify(post_data)
        }).then(response => {
            if (response.ok) {
                props.setGetPosts(true)
                console.log("great success!")
            } else {
                return response.json().then(err => Promise.reject(err))
            }
        })
            .catch(err => {
                console.log(err.message)
                setServerErrorMessage(err.message)
            })
        window.location.reload(true)
        reset({
            post: ''
        })
    }

    return (
        <div>
            <form className='make-post' onSubmit={handleSubmit(onSubmit)}>
                <textarea
                    placeholder='Tell the world your opinion...'
                    rows='4'
                    className="post-box"
                    name="post"
                    ref={register}
                />
                {errors.post && errors.post.message}
                <button>Post</button>
            </form>


        </div>
    );
};

export default MakePost