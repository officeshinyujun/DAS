import {Link} from "react-router-dom";
import before from "../design/1646213-ffffff.svg"
import "../design/header.css"

function Header() {
    const url = window.location.pathname;
    if (url === "/profile"){
        return(
            <div className="header-container">
                <Link to="/">
                    <img src={before} style={{width: "50px", height: "50px", color: "white"}}/>
                </Link>

                <div
                    style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
                    <div></div>
                    <Link to="/profile" style={{textDecoration: "none", color: "white"}}><p
                        style={{fontSize: "40px", fontWeight: "bold"}}>PROFILE</p></Link>
                    <div style={{border: "1px solid white"}}></div>
                </div>

                <Link to="/opener" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>OPENER</p></Link>

                <Link to="/tonew" style={{textDecoration: "none", color: "white"}}><p style={{fontSize: "40px"}}>For
                    Beigginer</p></Link>

                <Link to="/community" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>COMMUNITY</p></Link>
            </div>
        )
    } else if (url === "/opener") {
        return (
            <div className="header-container">
                <Link to="/">
                    <img src={before} style={{width: "50px", height: "50px", color: "white"}}/>
                </Link>

                <Link to="/profile" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>PROFILE</p></Link>

                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between" ,height:"100%"}}>
                    <div></div>
                    <Link to="/opener" style={{textDecoration:"none", color:"white"}}><p style={{fontSize: "40px", fontWeight:"bold"}}>OPENER</p></Link>
                    <div style={{border:"1px solid white"}}></div>
                </div>

                <Link to="/tonew" style={{textDecoration:"none", color:"white"}}><p style={{fontSize: "40px"}}>For beigginer</p></Link>

                <Link to="/community" style={{textDecoration:"none", color:"white"}}><p style={{fontSize: "40px"}}>COMMUNITY</p></Link>
            </div>
        )
    } else if (url === "/tonew") {
        return (
            <div className="header-container">
                <Link to="/">
                    <img src={before} style={{width: "50px", height: "50px", color: "white"}}/>
                </Link>

                <Link to="/profile" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>PROFILE</p></Link>

                <Link to="/opener" style={{textDecoration: "none", color: "white"}}><p style={{fontSize: "40px"}}>OPENER</p></Link>

                <div
                    style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
                    <div></div>
                    <Link to="/tonew" style={{textDecoration: "none", color: "white"}}><p
                        style={{fontSize: "40px", fontWeight: "bold"}}>For beigginer</p></Link>
                    <div style={{border: "1px solid white"}}></div>
                </div>

                <Link to="/community" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>COMMUNITY</p></Link>
            </div>
        )
    } else if (url === "/community"){
        return (
            <div className="header-container">
                <Link to="/">
                    <img src={before} style={{width: "50px", height: "50px", color: "white"}}/>
                </Link>

                <Link to="/profile" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>PROFILE</p></Link>

                <Link to="/opener" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>OPENER</p></Link>

                <Link to="/tonew" style={{textDecoration: "none", color: "white"}}><p
                    style={{fontSize: "40px"}}>For beigginer</p></Link>

                <div
                    style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
                    <div></div>
                    <Link to="/community" style={{textDecoration: "none", color: "white"}}><p
                        style={{fontSize: "40px", fontWeight: "bold"}}>COMMUNITY</p></Link>
                    <div style={{border: "1px solid white"}}></div>
                </div>
            </div>
        )
    } else {


    }


}

export default Header;