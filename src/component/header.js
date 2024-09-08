import {Link} from "react-router-dom";
import before from "../design/1646213-ffffff.svg"
import "../design/header.css"
import image from "../design/DAT 로고 1.png";

function Header() {
    const url = window.location.pathname;
    return(
        <div className="header-container">
            <div>
                <img src={image}/>
                <Link to="/"><h1>DAT</h1></Link>
            </div>
            <Link to="/profile"><h1>Profile</h1></Link>
            <Link to="/opener"><h1>Opener</h1></Link>
            <Link to="/tonew"><h1>For Beigginer</h1></Link>
            <Link to="/community"><h1>Community</h1></Link>
            <Link to="/message"><h1>Message</h1></Link>
        </div>
    )

}

export default Header;