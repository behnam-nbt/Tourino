'use client'
import Header from './Header'
import Footer from './Footer'
import { useState } from 'react';

function Layout({ children }) {

    return (
        <>
            <Header />
            <div>{children}</div>
            <Footer />
        </>
    )
}

export default Layout