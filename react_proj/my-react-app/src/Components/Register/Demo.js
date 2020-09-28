import React, { Component } from 'react'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/lib/ReactCrop.scss';
import { Form } from 'semantic-ui-react'

class Demo extends Component {
    constructor() {
        super()
        this.state = {
            crop: {
                aspect: 100 / 100,
                x: 50,
                y: 50,
                width: 30,
                height: 30
            },
            croppedImageUrl: null
        }
        this.onChange = this.onChange.bind(this)
        this.onImageLoaded = this.onImageLoaded.bind(this)
        this.onCropComplete = this.onCropComplete.bind(this)
        this.getCroppedImg = this.getCroppedImg.bind(this)
        this.dataURLtoFile = this.dataURLtoFile.bind(this)
    }

    handleSubmit = () => {
        console.log(this.state)
        this.props.handleCrop(this.state.croppedImageUrl,this.state.croppedImage)
    }

    onImageLoaded = image => {
        this.imageRef = image
    }

    onChange = (crop) => {
        this.setState({ crop })
    }

    onCropComplete = crop => {
        if (this.imageRef && crop.width && crop.height) {
            this.getCroppedImg(crop)
        }
    }

    getCroppedImg(crop) {
        let image = this.imageRef;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = Math.ceil(crop.width*scaleX);
        canvas.height = Math.ceil(crop.height*scaleY);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width*scaleX,
          crop.height*scaleY,
        );

        const base64Image = canvas.toDataURL('image/jpeg');
        this.setState({ croppedImageUrl : base64Image })
        this.setState({cropped:true})

        const reader = new FileReader()
        canvas.toBlob(blob => {
            reader.readAsDataURL(blob)
            reader.onloadend = () => {
                this.dataURLtoFile(reader.result, 'cropped.jpg')
            }
        })
      }

    dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);

        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        let croppedImage = new File([u8arr], filename, { type: mime });
        this.setState({ croppedImage: croppedImage })
    }

    render() {
        return (
        <Form 
            style={{ width: "350px" }}
            onSubmit={this.handleSubmit}
        >
            <ReactCrop
                src= {this.props.imgSrc}
                crop={this.state.crop}
                onChange={this.onChange}
                onImageLoaded={this.onImageLoaded}
                onComplete={this.onCropComplete}
            />
            <button className="form-button" >Crop</button>
        </Form>
        )
    }
};

export default Demo
