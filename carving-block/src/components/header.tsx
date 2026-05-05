import { Link, NavLink } from "react-router";
import logo from '../assets/logo.svg';
import { useWallet } from "../hooks/walletContext";

export default function Header() {
    const { isSeller } = useWallet();
    const navStyle = ({ isActive }: { isActive: boolean }) => ({
        backgroundColor: isActive ? "var(--green-light)" : "inherit",
        color: isActive ? "var(--green-dark)" : "var(--red-dark)",
        fontWeight: isActive ? 600 : "inherit",
        padding: "2px"
    });

    

    return (
        <div id="header">
            <div>
            </div>
            <Link to="/">
                <img src={logo} alt="the carving block" />
            </Link>
            <div>
                <NavLink to="/" style={navStyle}>
                    home
                </NavLink>
                {/* TODO: conditionally render list link if seller */}
                {isSeller && (
                    <NavLink to="/list-proj" style={navStyle}>
                        list
                    </NavLink>
                )}
                <NavLink to="/completed" style={navStyle}>
                    see completed
                </NavLink>
            </div>
        </div>
    )
}