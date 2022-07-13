import React, { useRef, useState } from "react"
import "./ContextMenu.scss"

function ContextMenu(props){
    const [viewContext, setViewContext] = useState(false)
    const div = useRef()
    return (<div
    tabIndex={1}
        onContextMenu={(e)=>{
            e.preventDefault()
            div.current.focus()
            setViewContext(true)
            }}
        onBlur={(e)=>{
            setViewContext(false)
            console.log("has blur")
        }}
        ref={div}
    >
        {viewContext && <div style={{position:"relative"}}>{props.contextMenu}</div>}
        {props.children}
    </div>)
}

export default ContextMenu