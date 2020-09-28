import React, {useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'

function MyDropzone() {

  const [style,setStyle] = useState({})

    const onDrop = useCallback(props => {

     if (props.length === 0) {
        props.onFileInput({
            'fileError':true,
             'file': undefined
        })
        setStyle({
            'animation': 'colorChangeBad 2s' 
        })
    }

    else {
        console.log('no problemo')
        props.onFileInput({
            'fileError':false,
             'file':props
        })
        setStyle({
            'animation': 'colorChangeGood 2s' 
        })

    }
  }, [])

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: '.jpeg,.png,.jpg,.JPG'
  })

  return (
    <div id = 'dropzone' style = {style} {...getRootProps()}>
      <input {...getInputProps()} />

          <p> Drag files or click here.</p>
    </div>
  )
}

export default MyDropzone;