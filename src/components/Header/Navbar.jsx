import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const location = useLocation();
  useEffect(() => {}, [location]);
  return (
    <>
      <nav>
        <div className="navLeft">
          <h3 className="nav-heading ">Url Shortener</h3>
          {!localStorage.token && (
            <ul className="mlr navLeft-column ">
              <li className={location.pathname === "/" ? "underline" : ""}>
                <Link to={"/"}>Dashboard </Link>
              </li>
            </ul>
          )}
        </div>

      </nav>
    </>
  );
}