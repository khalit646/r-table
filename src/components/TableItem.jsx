import React from "react";
import "./TableItem.scss"

function TableItem(props){
    return <div className="table__row">
        {props.data.map((val, idx)=>(
            <div key={idx} className="table__element" style={{width:`${val.wide}px`}}>{val.data}</div>
        ))}
    </div>
}

export default TableItem