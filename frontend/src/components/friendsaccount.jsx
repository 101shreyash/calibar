import { useLocation } from "react-router-dom"

export default function Compete() {

    const location = useLocation();
    const friendsname = location.state

    console.log(friendsname.rivalusername);
    
    
    return <>
        
    <h1>{friendsname.rivalusername} Profile Stats !</h1>
    
    </>
    
}