import React from 'react'
import { NavLink } from 'react-router-dom'

function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">Navbar</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink className="nav-link active" aria-current="page">Product 1</NavLink>
                        <NavLink className="nav-link" aria-current="page">Product 2</NavLink>
                        <NavLink className="nav-link" aria-current="page">Product 3</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default NavBar