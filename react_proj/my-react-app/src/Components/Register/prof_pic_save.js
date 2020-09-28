import React, { useState } from "react";
import { useForm, ErrorMessage } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { useStateMachine, createStore } from "little-state-machine"
import updateAction from "./updateAction"

const Step3 = props => {
    const { state, action } = useStateMachine(window.STATE_MACHINE_RESET())
    const { handleSubmit, register, errors, watch } = useForm({
        defaultValues: {}
    })
    const { push } = useHistory();
    var fileData = new FormData()
    const onSubmit = async (data) => {
        fileData.append('file',data.profilePicture[0])
        console.log(data.profilePicture[0])
        await fetch('/files', {
          method: 'POST',
          headers: {
            'Origin': 'localhost:3000',
            'Access-Control-Request-Method': 'POST',
          },
          body: fileData
        }).then(response => {
          if (response.ok) {
            console.log("File Post Request Successful")
            action()
            push("/login")
          } else {
            return response.json().then(err => Promise.reject(err))
          }
        })
          .catch(err => {
            console.log(err)
          })
    }

    const onSkip = () => {
        action()
        push("/login")
    }

    return (
        <div className = "form-div">
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-box">
            <div> Everything looks great!</div>
            <div> Would you like to upload a profile picture? </div>

           <br />
                <input
                    name='profilePicture'
                    type = 'file'
                    ref={register}
                />
            <br />

            <button className = "form-button"  >Register</button>
            <div><a href = '/login' onClick = {onSkip}>Skip for now</a></div>
            </div>
        </form>
        </div>
    )
}



export default Step3;