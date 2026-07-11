import { useNavigate } from "react-router-dom";




function Setting() {

    const navigate = useNavigate();

    function AlertDelete() {

        const bool = confirm("Doing So will permanently delete all your workouts and your account are you sure?")



    }

    function AlertLogout() {
 
        const bool = confirm("Are you sure you wanted to logout ?")

        if (bool === true) {

            async function LogoutUser() {

               try {


                const result = await fetch("http://localhost:8001/logout" , {
                    method : "DELETE",
                    credentials : "include",
                    headers : {
                        "Content-Type": "application/json"
                    }
                })

                if (result.ok) {

                    navigate("/")
                    
                }
                
               } 
               
               
               catch (error) {

                console.log(error.message);
               return alert("Server Error")
                
                
               }
                

                
            }

            LogoutUser();
            
        }


    }

    return <>


        <br />
        <br />
        <button onClick={AlertLogout}>Logout</button>
        <br /><br /><br /><br />
        <p className="alertdanger">Danger Zone</p>

        <button className="alertbtn" onClick={AlertDelete}>Delete Account</button>
        <br />

    </>

}

export default Setting;