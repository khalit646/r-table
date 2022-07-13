import React from "react";
import {Outlet} from "react-router-dom";
import "./MainLayout.scss"

function MainLayout(){
    return <>
        <div className="header">
            <div className="wrapper">
                <div className="header__title">Планировщик</div>
                <ul className="header__menu">
                    <li className="header__item">Главная</li>
                    <li className="header__item">О сайте</li>
                </ul>
            </div>
        </div>
        <div className="wrapper">
            <Outlet/>
        </div>
        <div className="footer">
            <div className="wrapper"></div>
        </div>
    </>
}

export default MainLayout