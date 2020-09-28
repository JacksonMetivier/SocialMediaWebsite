import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"

const Register = () => {
  const history = useHistory();

  const { handleSubmit, register, errors, watch } = useForm()
  const [serverErrorMessage, setServerErrorMessage] = useState({
    'error': false
  })


  var fileData = new FormData()
  const onSubmit = async (values) => {

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
        history.push('/login')
      } else {
        return response.json().then(err => Promise.reject(err))
      }
    })
      .catch(err => {
        console.log(err)
        setServerErrorMessage(err)
      })

      fileData.append('file',values.profilePicture[0])

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
        } else {
          return response.json().then(err => Promise.reject(err))
        }
      })
        .catch(err => {
          console.log(err)
        })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="register-section-labels"> Boring information. </div>
      <br/>
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
      {errors.email && <div>{errors.email.message}</div>}
      {serverErrorMessage.error && <div>{serverErrorMessage.email}</div>}
      <br />

      <label>Username</label>
      <br />
      <input
        name="username"
        ref={register({
          required: "Required"
        })}
      />
      {serverErrorMessage.error && <div>{serverErrorMessage.username}</div>}
      <br />

      <label>Password</label>
      <br />
      <input
        type='password'
        name='password1'
        ref={register({
          required: "Required"
        })}
      />
      <br />

      <label>Repeat Password</label>
      <br />
      <input
        type='password'
        name='password2'
        ref={register({
          validate: value => value === watch('password1')
        })}
      />
      {errors.password2 && <div>Passwords do not match!</div>}
      <br />

      <hr />

      <div className="register-section-labels"> Lifting information. </div>

      <br />
      <label>What are your fitness goals?</label>
      <br />
      <select
        name="goals"
        ref={register}
      >
        <option value="">Select your goal.</option>
        <option value="Get Big!">Get Big!</option>
        <option value="Get Shredded!">Get Shredded!</option>
        <option value="Get Strong!">Get Strong!</option>
      </select>
      <br />

      <br />
      <label> How much do you lift? </label>
      <br />
      <label>Max Bench: </label>
      <input
        name='bench'
        ref={register}
      />
      <br />

      <label>Max Squat:
      <input
          name='squat'
          ref={register}
        /></label>
      <br />

      <label>Max Deadlift:
      <input
          name='deadlift'
          ref={register}
        /></label>
      <br />

      <br />
      <label>What gym do you go to? <br />
        <input
          name='gym'
          ref={register}
        /></label>
      <br />

      <hr />
      <div className="register-section-labels"> Personal Information. </div>

      <br />
      <label>Upload a profile picture! <br />
        <input
          type='file'
          name='profilePicture'
          ref={register}
        /></label>
      <br />

      <br />
      <label>What do you like to do? <br />
        <input
          name='hobbies'
          ref={register}
        /></label>
      <br /> 

      <br />
      <label>What's your favorite cheat meal? <br />
        <input
          name='cheatMeal'
          ref={register}
        /></label>
      <br />

      <br />
      <label>What else would you like to share about yourself? <br />
        <input
          name='aboutMe'
          ref={register}
        /></label>
      <br />


      <br/>

      <button>Submit</button>


    </form>
  )
}



export default Register;
