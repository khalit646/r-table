import React from "react"
import { Route, Routes } from "react-router-dom"
import MainLayout from "./layouts/MainLayout"
import Group from "./pages/Group"
import List from "./pages/List"
import Item from "./pages/Item"
import NotFound from "./pages/NotFound"
import Home from "./pages/Home"


function App(){
    return (<Routes>
        <Route path="/" element={<MainLayout/>} >
            <Route index element={<Home/>}/>
            <Route path="list/*" element={<List/>}/>
            <Route path="group/:id" element={<Group/>}/>
            <Route path="item/:id" element={<Item/>}/>
        </Route>
        <Route path="*" element={<NotFound/>}/>
    </Routes>)
}

export default App