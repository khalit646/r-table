import React, {useState, useEffect} from "react";
import Table from "../components/Table"
import TableItem from "../components/TableItem"

const filters = [
    (val1, val2)=>(val1.name.localeCompare(val2.name)),
    (val1, val2)=>(parseInt(val1.date) - parseInt(val2.date)),
    (val1, val2)=>(parseInt(val1.count) - parseInt(val2.count))
]

function Groups(){
    const [groups, setGroups] = useState(null)
    const [loading, setLoading] = useState("pending")
    const [uploading, setUploading] = useState(null)
    const [appendText, setAppendText] = useState("")

    useEffect(()=>{
        async function fetchData(){
            try{
                let res = await fetch("http://localhost:3000/groups")
                let data = await res.json()
                let newData = []
                for(let i of data){
                    let res = await fetch(`http://localhost:3000/items?group=${i.name}`)
                    let data = await res.json()
                    newData.push({
                        ...i,
                        count: data.length
                    })
                }
                setGroups(newData)
                console.log(newData)
                setLoading("success")
            }catch(e){
                console.log(e)
                setLoading("error")
            }
        }
        if(!groups || uploading == "success"){
            fetchData()
        }
    }, [uploading])

    function handleChange(e){
        setAppendText(e.target.value)
    }

    function handleSubmit(e){
        e.preventDefault()
        if(appendText.length){
            async function fetchData(){
                try{
                    setUploading("uploading")
                    await fetch("http://localhost:3000/groups", {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: appendText,
                            date: Date.now(),
                            id: Date.now()
                        })
                    })
                    setUploading("success")
                }catch(e){
                    console.log(e)
                    setUploading("error")
                }finally{
                    setTimeout(()=>setUploading(null), 4000)
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

    return (<div>
        <Table
            header={[
                "Имя",
                "Дата",
                "Количество"
            ]}
            render={(filter, wides)=>{
                return groups.slice().sort(filters[filter]).map((val)=>{
                    return <TableItem key={val.id} data={[
                        {
                            data: val.name,
                            wide: wides[0]
                        },
                        {
                            data: new Date(val.date).toUTCString(),
                            wide: wides[1]
                        },
                        {
                            data: val.count,
                            wide: wides[2]
                        }
                    ]}/>
                })
            }}
        />
        <form onSubmit={handleSubmit}>
            <input onChange={handleChange} type="text" value={appendText} placeholder="Введите значение" />
            <button>Добавить</button>
        </form>
        {(uploading=="pending")?
            <div className="groups__loading">Запись добавляется в базу</div>:
            (uploading=="error")?<div className="groups__error">Запись не была добавлена в базу</div>:
                (uploading=="success")?<div className="groups__loading">Запись была добавлена в базу</div>:null}
    </div>)
}

export default Groups