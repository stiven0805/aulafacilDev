import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../assets/styles/PublicHeader.css";

export default function PublicHeader() {
  return (
    <header className="public-header">
      <div className="ph-inner">
        <div className="ph-logo-box">
          <img src={logo} alt="Logo Aula Fácil" className="ph-logo" />
        </div>

        <Link to="/" className="ph-title">
          AulaFácil
        </Link>

        <div className="ph-links">
          <Link to="/login" className="ph-btn">
            Login
          </Link>
          <Link to="/registro" className="ph-btn secondary">
            Registro
          </Link>
        </div>
      </div>
    </header>
  );
}
