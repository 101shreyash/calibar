
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SearchWorkouts from "./searchworkouts";
import { Link } from "react-router-dom";


function Viewworkout() {


    let [workouts, setworkouts] = useState([]);
    let [workoutcount, setworkoutcount] = useState();



    async function DbQuery() {


        const fetchdworkouts = await fetch("http://localhost:8001/workouts", {

            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })


        const userworkouts = await fetchdworkouts.json()
        setworkouts(userworkouts.message)


    }


    useEffect(() => {

        DbQuery()

    }, [])


    function DeleteWorkout(deleteid) {

        const deleteconfirm = confirm("Are you sure you want to delete this workout?")

        if (deleteconfirm === true) {

            console.log(deleteid);


            async function NetworkCall() {

                try {

                    const result = await fetch(`http://localhost:8001/deleteworkouts/${deleteid}`, {

                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            'Content-Type': 'application/json',

                        }

                    })


                }

                catch (error) {

                    alert("Server Error")
                    return console.log(error);

                }

            }

            NetworkCall();

        }
    }


    async function WorkoutCounts() {

        try {

            const result = await fetch("http://localhost:8001/workoutcounts", {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',

                },
                credentials: "include"

            })

            const data = await result.json()
            const totalcount = data.message

            setworkoutcount(totalcount)
            



        }

        catch (error) {

            alert("Server Error")
            console.log(error);


        }


    }

    useEffect(() => {


        WorkoutCounts();

    }, [])




    return <>

        <Link className="links" to="/searchworkouts"> Search Your Workouts</Link>
        <p># The Goal in life is to get 10 thousand workouts done , right now you've did {workoutcount} workout keep going .</p>
        <h1>All Your workouts!</h1>
        {workouts.map((allworkouts) => {

            const date = allworkouts.workoutdate.substring(0, 10)

            return <div key={allworkouts.workoutid}>
                <h2 className="userworkouts">At &nbsp;{date} &nbsp; You've Did &nbsp; &nbsp; {allworkouts.workoutname} &nbsp; &nbsp;  {allworkouts.totalsets} Sets &nbsp; &nbsp; {allworkouts.totalreps} Reps &nbsp; <button className="deleteworkoutbtn" onClick={() => DeleteWorkout(allworkouts.workoutid)} > Delete workout </button>  </h2>
            </div>




        })}


    </>



}


export default Viewworkout;