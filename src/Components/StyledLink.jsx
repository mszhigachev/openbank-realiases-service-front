import { NavLink, useMatch } from "react-router-dom";
import Style from './Layout.module.css'
const StyledLink = ({ children, to, ...props }) => {
    const match = useMatch(to)
    return (
        <NavLink
            to={to}
            className={`${Style.navLink} ${match ? Style.active : ''}`}
            {...props}
        >
            {children}
        </NavLink>
    )
}

export { StyledLink };