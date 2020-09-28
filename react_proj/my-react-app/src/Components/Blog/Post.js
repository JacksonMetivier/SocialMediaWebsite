import React from "react";

class Post extends React.Component {

    constructor() {
        super()
        this.state = {
        }

    }

    render() {
    console.log(this.props.userPosts)

    return (
        <div>
            {this.props.userPosts.data[0].post }
        </div>
    )
}
}

export default Post