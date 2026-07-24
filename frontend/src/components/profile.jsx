import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Setting from "./setting";
import { useForm } from "react-hook-form";




function Profile() {

    let [displayname, setdisplayname] = useState('');
    let [username, setusername] = useState('');
    let [activedays, setactivedays] = useState(0);
    let [profilepicture, setprofilepicture] = useState('')


    let { register, handleSubmit, reset } = useForm();

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

    }, [])

    async function userProfilePicture() {

        try {

            const result = await fetch("http://localhost:8001/profilepicture" , {
                method : "GET", 
                credentials : "include"
            })

            const data = await result.json();
            const userprofilepic = data.message

           setprofilepicture(userprofilepic)            
            
            
        } 
        
        catch (error) {

            console.log(error);
         return  alert("Server Error")
            
            
        }

        
    }

    useEffect(() => {

        userProfilePicture();


    }, [])



    async function ActiveCount() {

        try {

            const result = await fetch("http://localhost:8001/activefor", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const days = await result.json()

            const activedays = days.message
            setactivedays(activedays)




        }

        catch (error) {

            alert("Server Error")
            console.log(error);


        }

    }

    useEffect(() => {

        ActiveCount();

    }, [])



    function AfterSearch(data) {

        console.log(data);
        navigate("/compete", { state: data })


    }




    return <>

        <Link className="links" to="/setting"> Setting</Link>
        <br /><br /><br />


        <form onSubmit={handleSubmit(AfterSearch)}>

            <h2>Compete with your friends</h2>
            <input type="search" placeholder="Enter your friends Username here " {...register("rivalusername")} />
            &nbsp;  <button type="submit">search</button>

        </form>




        <h1>{displayname} ,  Yours Profile Stats !</h1>
        <br /><br /><br /><br />
        <div className="image-container">
            {console.log(profilepicture)}
            <img className="profilepicture" src={`http://localhost:8001/uploads/${profilepicture}`} alt="profilepicture" />
        </div>

        <h2> username : {username} </h2>
        <h2> Its been {activedays} Since youre working out . Keep Going !</h2>        <br /><br /><br /><br /><br />
        <Link className="links" to="/trackworkout" state={{ name: displayname }} > Track Your workout</Link>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <Link className="links" to="/viewworkout">View Your Workout</Link>
        <br /><br /><br />





    </>

}


export default Profile;