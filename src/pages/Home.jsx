import React from "react";
import {Link} from "react-router-dom"
function Home(){
    return (<div>
        Чтобы перейти к группам перейдите <Link to="/list">группы</Link>
    </div>)
}

export default Home