import { Outlet } from "react-router-dom";
import Style from './Layout.module.css'
import { StyledLink } from "./StyledLink";
const Layout = () => {
    return (
        <>
            <header className={Style.headerWrapper}>
                <StyledLink to="/releases">Релизы</StyledLink>
                <StyledLink to="/services">Сервисы</StyledLink>
            </header>
            <div className={Style.contentWrapper}>
                <Outlet />
            </div>
        </>
    )
}

export { Layout };