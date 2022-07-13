import React, { useEffect, useRef, useState } from "react";
import {Link} from "react-router-dom"
import Table from "../components/Table"
import TableItem from "../components/TableItem"
import ContextMenu from "../components/ContextMenu";
import "./AllItems.scss"

const filters = [
    (val1, val2)=>(val1.name.localeCompare(val2.name)),
    (val1, val2)=>(parseInt(val1.date) - parseInt(val2.date)),
    (val1, val2)=>(val1.group.localeCompare(val2.group)),
    (val1, val2)=>(val1.like?-1:(val2.like?1:0))
]

function EditName(props){
    const [value, setValue] = useState(props.value)
    const div = useRef()
    useEffect(()=>{
        div.current.focus()
    },[])
    function handleChange(e){
        setValue(e.target.value)
    }
    return (<input type="text" value={value} ref={div} style={{zIndex:"2"}}
        onChange={handleChange}
            onBlur={()=>{
                props.done()
                if(value.length && value !== props.value){
                    async function fetchData(){
                        try{
                            props.status("edit-begin")
                            await fetch(`http://localhost:3000/items/${props.id}`,{
                                method: "put",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    ...props.data,
                                    name: value
                                })
                            })
                            props.status("edit-success")
                        }catch(e){
                            console.log(e)
                            props.status("edit-error")
                        }
                        finally{
                            setTimeout(()=>{props.status(null)}, 4000)
                        }
                    }
                    fetchData()
                }
            }
        }
    />)
}

function AllItems(){
    const [items, setItems] = useState(null)
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState("pending")
    const [update, setUpdate] = useState(null)
    const [selectGroup, setSelectGroup] = useState(null)
    const [groupsOpen, setGroupsOpen] = useState(false)
    const [appendText, setAppendText] = useState("")
    const [edit, setEdit] = useState(null)

    useEffect(()=>{
        async function fetchData(){
            try{
                let res = await fetch("http://localhost:3000/items")
                let data = await res.json()
                setItems(data)
                res = await fetch("http://localhost:3000/groups")
                data = await res.json()
                setGroups(data.map(val=>val.name))
                setSelectGroup(data[0].name)
                setLoading("success")
            }catch(e){
                console.log(e)
                setLoading("error")
            }
        }
        if(!items || update == "success" || update == "edit-success"){
            fetchData()
        }
    }, [update])

    function handleChange(e){
        setAppendText(e.target.value)
    }
    function handleSubmit(e){
        e.preventDefault()
        if(appendText.length){
            async function fetchData(){
                try{
                    setUpdate("pending")
                    await fetch("http://localhost:3000/items", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            id: Date.now(),
                            date: Date.now(),
                            name: appendText,
                            group: selectGroup,
                            like: false
                        })
                    })
                    setUpdate("success")
                }catch(e){
                    console.log(e)
                    setUpdate("error")
                }finally{
                    setTimeout(()=>setUpdate(null), 4000)
                }
            }
            fetchData()
        }
    }
    

    if(loading === "pending"){
        return (<div className="groups__loading">Идет загрузка...</div>)
    } else if(loading === "error"){
        return (<div className="groups__error">Произошла ошибка загрузки</div>)
    }

    return (<div className="groups">
        <Table header={[
                "Имя",
                "Дата",
                "Группа",
                "Избранные"
            ]}
            render={(filter, wides)=>{
                return items.slice().sort(filters[filter]).map((val)=>{
                    return <ContextMenu
                        key={val.id}
                        contextMenu={<div className="contextmenu">
                            {<div onClick={()=>setEdit(val.id)}>Изменить</div>}
                            <div>Удалить</div>
                        </div>}
                    >
                        <TableItem data={[
                            {
                                data: (edit==val.id?(<EditName done={()=>setEdit(null)} status={setUpdate} value={val.name} id={val.id} data={val}/>):val.name),
                                wide: wides[0]
                            },
                            {
                                data: new Date(val.date).toUTCString(),
                                wide: wides[1]
                            },
                            {
                                data: (<Link to={`/group/${val.group}`}>{val.group}</Link>),
                                wide: wides[2]
                            },
                            {
                                data: val.like && "да",
                                wide: wides[3]
                            }
                        ]}/>
                    </ContextMenu>
                })
            }}
        />
        <form onSubmit={handleSubmit}>
            <input type="text" onChange={handleChange} value={appendText} placeholder="Введите название" />
            <div className="group__selects">{
                groupsOpen && (<div className="gselect__list">{
                        groups.map((val, idx)=>{
                            return (<div
                                key={idx}
                                className={`gselect ${val==selectGroup?"gselect--active":""}` }
                                onClick={(e)=>{e.preventDefault(), setSelectGroup(val), setGroupsOpen(false)}}>
                                    {val}
                            </div>)
                        })
                    }</div>)}
                <div
                    onClick={()=>setGroupsOpen(true)}
                    className="gselect gselect--active">
                        {selectGroup}
                </div>
            </div>
            <button type="submit" disabled={update=="pending"}>Добавить</button>
        </form>
        {(update=="pending")?
            <div className="groups__loading">Запись добавляется в базу</div>:
            (update=="error")?<div className="groups__error">Запись не была добавлена в базу</div>:
                (update=="success")?<div className="groups__loading">Запись была добавлена в базу</div>:null}
        {(update=="edit-begin")?
            <div className="groups__loading">Запись обновляется</div>:
            (update=="edit-error")?<div className="groups__error">Запись не была обновлена</div>:
                (update=="edit-success")?<div className="groups__loading">Запись была обновлена</div>:null}
        
    </div>)
}

export default AllItems