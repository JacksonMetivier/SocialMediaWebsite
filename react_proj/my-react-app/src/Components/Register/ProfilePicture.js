import React, { useState } from "react";
import { useHistory } from "react-router-dom"
import { useStateMachine } from "little-state-machine"
import MyDropzone from './Dropzone'
import 'react-image-crop/lib/ReactCrop.scss';
import Demo from './Demo'

const Step3 = props => {
  const { state, action } = useStateMachine(window.STATE_MACHINE_RESET())

  const [fileError, setFileError] = useState(false)
  const [fileName, setFileName] = useState('')
  const [didDrop, setDidDrop] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [cropImgUrl, setCropImgUrl] = useState('')
  const [cropFile, setCropFile] = useState([])
  const [cropped, setCropped] = useState(false)


  const handleCrop = (url, file) => {
    setCropImgUrl(url)
    setCropFile(file)
    setCropped(true)
    console.log(url, file)
  }

  const readFile = (file) => {
    var url = URL.createObjectURL(file)
    setImgSrc(url)
  }

  const onFileInput = (data) => {
    console.log(data)
    setFileError(data.fileError)
    if (data.fileError) {
      setDidDrop(false)
    }
    else {
      readFile(data.file[0])
      setDidDrop(true)
      setCropped(false)
      setFileName(data.file[0].name)
    }
  }

  const { push } = useHistory();
  var formData = new FormData()
  const onSubmit = async () => {
    formData.append('file', cropFile)
    await fetch('/files', {
      method: 'POST',
      headers: {
        'Origin': 'localhost:3000',
        'Access-Control-Request-Method': 'POST',
      },
      body: formData
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
    <div className="form-div">
      <div className="form-box">
        <div> Would you like to upload a profile picture? </div>

        <br />
        <div className='dropzone-box'>
          <MyDropzone onFileInput={onFileInput} />
          {didDrop ? <div>{cropped ? <img className='cropped' src={cropImgUrl} /> : <Demo imgSrc={imgSrc} handleCrop={handleCrop} />}</div> : <span></span>}
        </div>

        {didDrop ? <span>{cropped ? <button onClick={onSubmit} className="form-button"  >Register</button> : <span></span>}</span> : <button href='/login' className="form-button" onClick={onSkip}>Skip</button>}
      </div>
    </div>
  )
}



export default Step3;