import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Setting from "./setting";
import { useForm } from "react-hook-form";



function Profile() {

    let [displayname, setdisplayname] = useState();
    let [username, setusername] = useState();
    
      let {register , handleSubmit} = useForm();

      const navigate = useNavigate();

    async function DbQuery() {

        try {

                const result = await fetch("http://localhost:8001/viewprofile", {

                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })                

                const userinfo = await result.json()

                console.log(userinfo);
                
                const Name = userinfo.message.name
                const username = userinfo.message.username

                setdisplayname(Name)
                setusername(username)


            }



        catch (error) {

            console.log(error);
            return alert("Server Error")


        }

    }

useEffect(() => {


        DbQuery();

} , [])



function AfterSearch(data) {

    console.log(data); 
navigate("/compete" , {state : data})

    
}


    return <>
        <Link className="links" to="/setting"> Setting</Link>
        <br /><br /><br />

            <form onSubmit={handleSubmit(AfterSearch)}>

        <input type="search" placeholder="Enter your friends username to compete" {...register("rivalusername")}/>
                <button type="submit">search</button>

        </form>



        <h1>{displayname} ,  Yours Profile Stats !</h1>
        <br /><br /><br /><br />

        <h2> username : {username} </h2>        <br /><br /><br /><br /><br />
        <Link className="links" to="/trackworkout" state={{name : displayname}} > Track Your workout</Link>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <Link className="links" to="/viewworkout">View Your Workout</Link>
        <br /><br /><br />



        

    </>

}


export default Profile;