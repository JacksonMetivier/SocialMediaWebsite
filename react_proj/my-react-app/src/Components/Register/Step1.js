import React, { useState } from "react";
import { useForm, ErrorMessage } from "react-hook-form"
import { useHistory } from "react-router-dom"
import { useStateMachine } from "little-state-machine"
import updateAction from "./updateAction"

const Step1 = () => {
  const { state, action } = useStateMachine(updateAction)
  const { handleSubmit, register, errors, watch } = useForm({
      defaultValues: state.yourDetails
  })
  const [serverErrorMessage, setServerErrorMessage] = useState({
    'error': false
  })
  const { push } = useHistory();
  const onSubmit =  async (data) => {

      await fetch('/register-validation', {
        method: 'POST',
        headers: {
          'Origin': 'localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Acces-Control-Request-Headers': {
            'Content-Type': 'JSON'
          }
        },
        body: JSON.stringify(data)
      }).then(response => {
        if (response.ok) {
          console.log("Register Post Request successful!")
          action(data)
          push("/register2")
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
    <form onSubmit ={handleSubmit(onSubmit)}>
      <div className="form-box">
      <label>Email</label>
      <br />
      <input
        name="email"
        ref={register({
          required: "Required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
            message: "Invalid email address! "
          }
        })}
      />
      <ErrorMessage errors={errors} name='email'/>
      <br />

      <label>First Name</label>
      <br />
      <input
        name='firstName'
        ref={register({
          required: "Required"
        })}
        defaultValue = {state.yourDetails.firstName}
      />
      <ErrorMessage errors={errors} name='firstName'/>
      <br />

      <label>Last Name</label>
      <br />
      <input
        name='lastName'
        ref={register({
          required: "Required"
        })}
        defaultValue = {state.yourDetails.lastName}
      />
      <ErrorMessage errors={errors} name='lastName'/>
      <br />

      <label>Password</label>
      <br />
      <input
        type='password'
        name='password1'
        ref={register({
          required: "Required"
        })}
        defaultValue = {state.yourDetails.password1}
      />
        <ErrorMessage errors={errors} name='password1'/>
      <br />

      <label>Repeat Password</label>
      <br />
      <input
        type='password'
        name='password2'
        ref={register({
          validate: value => value === watch('password1')
        })}
        defaultValue = {state.yourDetails.password2}

      />
      {errors.password2 && <span>Passwords do not match!</span>}
      <br />

      <button className = "form-button" >Next!</button>
      <br/>
      {serverErrorMessage.error && <span>{serverErrorMessage.email}</span>}
    </div>
    </form>
    </div>
  )
}



export default Step1;
