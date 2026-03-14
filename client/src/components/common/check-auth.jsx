import { Navigate, useLocation } from "react-router-dom";


function CheckAuth({isAuthenticated,user, children}) {
    const location=useLocation()
    
    if(!isAuthenticated &&  !(location.pathname.includes("/login")|| location.pathname.includes("/register"))){
        return <Navigate to="/auth/login"/>
    }
    if(isAuthenticated && (location.pathname.includes('/login')|| location.pathname.includes('/register'))){
        if (user?.role === "shelterAdmin") {
            return <Navigate to='/shelterAdmin'/>
        }
        else{
            return <Navigate to='/'/>
        }
    }

    if(location.pathname.includes('/admin')){
        return <Navigate to="/unauth-page"/>
    }
    if(isAuthenticated && user?.role !=="shelterAdmin" && location.pathname.includes('/shelterAdmin')){
        return <Navigate to="/unauth-page"/>
    }
    if(isAuthenticated && user?.role==="shelterAdmin"&& location.pathname.includes('reportStray')){
        return <Navigate to="/unauth-page"/>;
    }
    
    if(isAuthenticated && user?.role==="shelterAdmin"&& location.pathname.includes('form')){
        return <Navigate to="/unauth-page"/>;
    }
    // if(!isAuthenticated){
    //     return <Navigate to="/"/>;
    // }
    

    return <>{children}</>
}

export default CheckAuth;
