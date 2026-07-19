
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


function Viewworkout() {


    let [workouts, setworkouts] = useState([]);


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

                    if (result.ok) {

                     alert("Workout Deleted Sucessfully")


                    }


                }

                catch (error) {

                    alert("Server Error")
                   return console.log(error);

                }

            }

            NetworkCall();

        }
    }



    return <>

        <h1> ALL your workouts.</h1>

        {workouts.map((allworkouts) => {

            const date = allworkouts.workoutdate.substring(0, 10)

            return <div key={allworkouts.workoutid}>
                <h2 className="userworkouts">At &nbsp;{date} &nbsp; You've Did &nbsp; &nbsp; {allworkouts.workoutname} &nbsp; &nbsp;  {allworkouts.totalsets} Sets &nbsp; &nbsp; {allworkouts.totalreps} Reps &nbsp; <button className="deleteworkoutbtn" onClick={() => DeleteWorkout(allworkouts.workoutid)} > Delete workout </button>  </h2>
            </div>




        })}


    </>



}


export default Viewworkout;