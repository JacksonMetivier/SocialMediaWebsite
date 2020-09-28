import React from 'react';
import { useHistory } from "react-router-dom"
const Home = () => {
    
  const history = useHistory();
    return (
    <div>
      <h3> This is my home page where I'm going to write some stuff about myself and provide
        a link to a page where my resume is... or just put it on this page.
      </h3>
    </div>
    );
  }


export default Home;
