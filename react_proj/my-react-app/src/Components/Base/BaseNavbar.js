import React, { useState, useEffect } from "react";
import Home from '../Home/Home'

import { useHistory, Route, withRouter, Link } from 'react-router-dom';
import { Router } from 'react-router-dom'
import Login from '../Login/Login';
import Blog from '../Blog/Blog'
import Register from '../Register/Register'
import Profile from '../Profile/Profile'
import Step1 from '../Register/Step1'
// import Step2 from '../Register/register_item'
import Step2 from '../Register/Step2'
import ProfilePicture from '../Register/ProfilePicture'
import ViewProfile from '../Profile/ViewProfile'


const BaseNavbar = () => {
    const history = useHistory()
    const [loggedIn, setLoggedIn] = useState(false)

    function login() {
        fetch('/login', {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        }).then(res => res.json().then(data => setLoggedIn(data.loggedIn)))
    }

    function logout() {
        fetch('/logout', {
            method: 'GET',
            headers: {
                'Origin': 'localhost:3000',
                'Access-Control-Request-Method': 'POST',
                'Acces-Control-Request-Headers': {
                    'Content-Type': 'JSON'
                }
            }
        }).then(res => {
            if (res.ok) {
                res.json().then(data => setLoggedIn(data.loggedIn))
                history.push('/home')
            }
        })

    }

    useEffect(() => {
        login()
    }, []);

    return (
        <Router history={history}>
            <div>
                <div className="navbar">
                    <div><Link to="/">Jackson Metivier</Link></div>


                    {loggedIn ?
                        <div><Link to='/blog'>Blog</Link></div>
                        : <div></div>
                    }

                    {loggedIn ?
                        <div><div><Link to="/profile">Profile</Link></div>
                            <div><Link onClick={logout}>Logout</Link></div></div>
                        : <div><Link to='/login'>Login</Link></div>
                    }
                </div>
            </div>
            <Route exact path="/" component={Home} />
            <Route exact path="/blog" component={Blog} />
            <Route
                exact path="/login"
                render={(props) => (
                    <Login {...props} login={login} />
                )}
            />
            <Route exact path="/register1" component={Step1} />
            <Route exact path="/register2" component={Step2} />
            {/* <Route exact path="/register3" component={Step3} /> */}
            <Route exact path="/register4" component={ProfilePicture} />
            <Route exact path="/profile" component={Profile}/>
            <Route exact path="/profile/:userId" component={ViewProfile}/>
        </Router>
    );
}


export default withRouter(BaseNavbar);
