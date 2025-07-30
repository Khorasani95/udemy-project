import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import NavLinks from './NavLinks.js';
import BackDrop from '../UIElements/BackDrop.js';
import SideDrawer from './SideDrawer.js';
import MainHeader from './MainHeader.js';
import './MainNavigation.css';

const MainNavigation = props => {
    const [drawerIsOpen, setDrawerIsOpen] = useState(false);

    const openDrawerHandler = () => {
        setDrawerIsOpen(true)
    };

    const closeDrawerHandler = () => {
        setDrawerIsOpen(false)
    };

    return (
        <React.Fragment>
            {drawerIsOpen && <BackDrop onClick={closeDrawerHandler} />}
            <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
                <nav className='main-navigation__drawer-nav'>
                    <NavLinks />
                </nav>
            </SideDrawer>
            <MainHeader>
                <button className='main-navigation__menu-btn' onClick={openDrawerHandler}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <h1 className='main-navigation__title'>
                    <Link to='/'>YourPlaces</Link>
                </h1>
                <nav>
                    <NavLinks />
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;