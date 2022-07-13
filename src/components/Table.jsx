import React, {useState, useRef} from "react"
import "./Table.scss"
function Table(props){
    const [wides, setWides] = useState(props.header.slice().fill(100))
    const [filter, setFilter] = useState(0)
    const [drag, setDrag] = useState(null)
    const table = useRef()

    const handleDown=(e)=>{
        if(!e.button){
            let left = 0
            for(let i = 0; i < e.target.id; i++){
                left += wides[i]
            }
            setDrag({
                el: e.target,
                left
            })
        }
    }
    const handleUp=(e)=>{
        if(!e.button && drag){
            let w = wides.slice()
            let x = e.clientX - table.current.offsetLeft
            w[drag.el.id] = x - drag.left
            setWides(w)
            setDrag(null)
        }
    }
    const handleOut=(e)=>{
        if(e.target == table.current)
            handleUp(e)
    }
    const handleMove=(e)=>{
        if(drag){
            let x = e.clientX - table.current.offsetLeft
            if(x > drag.left){
                drag.el.style.left = x+'px'
            }
        }
    }
    
    function handleClick(e){
        setFilter(e.target.id)
    }

    let draglen = 0
    return <div className="table" ref={table} onMouseMove={handleMove} onMouseUp={handleUp} onMouseOut={handleOut}>
        {wides.map((val, idx)=>(<div key={idx} id={idx} onMouseDown={handleDown} style={{left:`${(draglen+=val)}px`}} className="table__drag "></div>))}
        <div className="table__header">{props.header.map((val, idx)=>(<div key={idx} id={idx} className={`header__element ${idx==filter?"table__drag--active":""}`} onClick={handleClick} style={{width:`${wides[idx]}px`}}>{val}</div>))}</div>
        <div className="table__content">{props.render(filter, wides)}</div>
    </div>
}

export default Table