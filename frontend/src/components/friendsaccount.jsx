import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"


export default function Compete() {

    let [rivalinfo, setrivalinfo] = useState([])
    let [profilepicture, setprofilepicture] = useState();

    const location = useLocation();
    const friendsname = location.state

    const rivalusername = friendsname.rivalusername

    async function NetworkCall() {

        try {

            const result = await fetch("http://localhost:8001/compete", {
                method: "POST",
                body: JSON.stringify({ rivalusername: rivalusername }),
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",

                }
            })

            const data = await result.json()

            if (data.message === "Username doesnot exists please try valid username") {

                return alert("Username doesnot exists please try valid username")

            }

            setrivalinfo(data)


        }

        catch (error) {

            alert("Server Error")
            console.log(error);


        }


    }


    useEffect(() => {


        NetworkCall();

    }, [])


    const pp = rivalinfo[0]?.profilepicture    

    return <>

        <h1>{friendsname.rivalusername} Profile Stats !</h1>
        <img src={`http://localhost:8001/uploads/${pp}`} alt="profilepicture"  className="profilepicture"/>


        {rivalinfo.map((info) => {

            const workoutdate = info.workoutdate
            const finaldate = new Date(workoutdate).toLocaleString("en-US", {
                dateStyle: "medium",
            })


            return <div key={info.workoutid}>

                <p> At {finaldate} {rivalusername} did {info.workoutname} For {info.totalsets} Sets and {info.totalreps} Reps</p>


            </div>

        })}



    </>

}