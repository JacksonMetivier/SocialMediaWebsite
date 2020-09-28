import React, { useState } from "react";
import { useForm } from "react-hook-form"
import { useHistory } from "react-router-dom"


const Login = (props) => {

  const history = useHistory();

  const {handleSubmit, register,errors} = useForm()
  const [serverErrorMessage,setServerErrorMessage] = useState('')

 const onSubmit = async (values) => {
      const user_data = values

      await fetch('/login',{
          method: 'POST',
          headers: {
              'Origin': 'localhost:3000',
              'Access-Control-Request-Method': 'POST',
              'Acces-Control-Request-Headers': {
                  'Content-Type':'JSON'
              }
          },
          body: JSON.stringify(user_data)
          }).then(response => {
            if (response.ok) {
              console.log("great success!")
              history.push("/profile")

          } else {
            return response.json().then(err=>Promise.reject(err))
          }
          })
          .catch(err => {
            console.log(err.login)
            setServerErrorMessage(err.login)
          })
        
          props.login()
  }
  
    return (
    <div className = "form-div">
        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-box">
          <div>
          <label>Email </label>
          <br/>
          <input 
            name="email"
            ref = {register({
                required: "Required"
            })}
        />
          </div>
          <div>
          <label>Password </label>
          <br/>
          <input
        type = 'password'
        name = 'password'
        ref={register({
            required: "Required"
        })}
        />
         </div>
         <div>
          <button 
          className = "form-button" 
          >Login</button>
          <a href = "#" style={{"fontSize":'.7em'}}>Forgot Password?</a>
          <a 
          href = "/register1"
           style={{
             "fontSize":'.7em',
             'marginLeft':'5px'
             }}>Register</a>
          </div>            
              <div
              style = {{
                'color':'red'
              }}
              >{serverErrorMessage}</div>
          </div>

        </form>
    </div>
    );
  }


export default Login;
