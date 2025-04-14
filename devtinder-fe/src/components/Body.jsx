import { Outlet } from "react-router-dom";

const Body = () => {
    return (
        <Outlet /> // any children routes of Body will render here
    );
}

export default Body;