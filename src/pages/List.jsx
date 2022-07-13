import React, { useEffect, useState } from "react";
import {Routes, Route, Link, Outlet} from "react-router-dom"
import AllItems from "./AllItems";
import Groups from "./Groups"
import "./List.scss"

function ListLayout(props){
    function getLink(text, link, isActive){
        if(!isActive){
            return <div className="activelink">{text}</div>
        }
        return <Link to={link}>{text}</Link>
    }
    return (<div>
        <div className="links">
            {getLink("Группы", "", !props.inGroups)}
            {getLink("Все задачи", "all", props.inGroups)}
        </div>
        <Outlet/>
    </div>)
}

function SetTrue(props){
    useEffect(()=>{
        props.setValue(true)
        return()=>props.setValue(false)
    },[])
    return props.children
}

function List(){
    const [isGroups, setIsGroups] = useState(false)
    return (<Routes>
        <Route path="/" element={<ListLayout inGroups={isGroups}/>}>
            <Route index element={<SetTrue setValue={setIsGroups}><Groups/></SetTrue>}/>
            <Route path="all" element={<AllItems/>}/>
        </Route>
    </Routes>)
}

export default List