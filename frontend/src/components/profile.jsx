import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Setting from "./setting";


function Profile() {

    let [name, setname] = useState();
    let [comparisonid, setcomparisonid] = useState();


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
                const Username = userinfo.message.name
                const ComparisionId = userinfo.message.comparison_id

                setname(Username)
                setcomparisonid(ComparisionId)


            }



        catch (error) {

            console.log(error);
            return alert("Server Error")


        }

    }

useEffect(() => {


        DbQuery();

} , [])


    return <>
        <Link className="links" to="/setting"> Setting</Link>
        <br /><br /><br />

        <h1>{name} ,  Yours Profile Stats !</h1>
        <br /><br /><br /><br />

        <h2> ComparisionId :  {comparisonid} </h2>
        <br /><br /><br /><br /><br />
        <Link className="links" to="/trackworkout" state={{ Username: name }}> Track Your workout</Link>
        &nbsp; &nbsp; &nbsp; &nbsp;
        <Link className="links" to="/viewworkout">View Your Workout</Link>
        <br /><br /><br />

    </>

}


export default Profile;