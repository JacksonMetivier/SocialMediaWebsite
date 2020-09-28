import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { useStateMachine } from "little-state-machine"
import updateAction from "./updateAction"

const Step2 = () => {
    const { state, action } = useStateMachine(updateAction)
    const { handleSubmit, register, errors, watch } = useForm({
        defaultValues: {}
    })
    const [serverErrorMessage, setServerErrorMessage] = useState({
        'error': false
      })
    const { push } = useHistory();
    const onSubmit = async (data) => {
        
        action(data)
        var values = JSON.parse(window.STATE_MACHINE_GET_STORE()).yourDetails
        console.log(values)
        push("/register4")
        await fetch('/register', {
            method: 'POST',
            headers: {
              'Origin': 'localhost:3000',
              'Access-Control-Request-Method': 'POST',
              'Acces-Control-Request-Headers': {
                'Content-Type': 'JSON'
              }
            },
            body: JSON.stringify(values)
          }).then(response => {
            if (response.ok) {
              console.log("Register Post Request successful!")
              push("/register4")
            } else {
              return response.json().then(err => Promise.reject(err))
            }
          })
            .catch(err => {
              console.log(err)
              setServerErrorMessage(err)
            })
      
    }

    return (
        <div className = "form-div">
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-box">
            <label>Phone <br />
                <input
                    name='phone'
                    ref={register}
                    defaultValue = {state.yourDetails.phone}
                /></label>

            <br />
            <label>Where are you from? <br />
                <input
                    name='whereFrom'
                    placeholder='Southern California'
                    ref={register}
                    defaultValue = {state.yourDetails.whereFrom}
                /></label>

            <br />
            <label>Date of birth <br />
                <input
                    name='monthOfBirth'
                    style = {{
                      width: '30px'
                    }}
                    placeholder='mm'
                    ref={register}
                    defaultValue = {state.yourDetails.monthOfBirth}
                />
                <input
                    name='dayOfBirth'
                    style = {{
                      width: '30px',
                      marginLeft: '2px'
                    }}
                    placeholder='dd'
                    ref={register}
                    defaultValue = {state.yourDetails.dayOfBirth}
                />
                <input
                    name='yearOfBirth'
                    style = {{
                      width: '50px',
                      marginLeft: '2px'
                    }}
                    placeholder='yyyy'
                    ref={register}
                    defaultValue = {state.yourDetails.yearOfBirth}
                /></label>


            <br />
            <label>Write something about yourself <br />
                <textarea
                    rows= '5'
                    cols = '50'
                    id='aboutMe'
                    name='aboutMe'
                    placeholder='In west Philadelphia born and raised on the playground was where I spent most of my days...'
                    ref={register({ required: false, maxLength: 150})}
                    defaultValue = {state.yourDetails.aboutMe}
                /></label>

            <br />
            {serverErrorMessage.error && <span> There was an error with the information you provided. Please go back and retry.</span>}

            <button className = "form-button" >Last Step!</button>
            </div>
        </form>
        </div>
    )
}



export default Step2;