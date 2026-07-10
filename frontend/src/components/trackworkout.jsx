import { useLocation} from "react-router-dom";
import { useForm } from "react-hook-form"



const Day = new Date().toLocaleDateString("en-US", { weekday: "long" });


function TrackWorkout() {


    let { register, handleSubmit } = useForm()
    
    
    const location = useLocation();
    
    const username = location.state;
    const name = username.Username;
    


    function AfterSubmit(data) {

        const workoutname = data.workoutname
        const totalreps = data.totalreps
        const totalsets = data.totalsets




        if (workoutname.length > 30 || workoutname.length <3) {

           return alert("Workout name should not be more than 30 characters and less than 3")

        }

        if (/\d/.test(workoutname)) {

            return alert("Workout name shouldnot consists of any numbers");

        }


        async function DbQuery() {


            try {

                const result = await fetch("http://localhost:8001/workouts", {
                    method: "POST",
                    body: JSON.stringify({ workoutname: workoutname, totalreps: totalreps, totalsets: totalsets }),
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }

                }) // fetch brackets ends here


                if (result.ok) {

                    return alert("Thats The beast Workout Right there Keep Going")
                    

                }

            }


            catch (error) {

                console.log(error);
                alert("Server Error")


            }


        }

        DbQuery();


    }


    return <>

        {name ? <h1>Welcome {name} Its {Day} </h1> : ""}

        <form onSubmit={handleSubmit(AfterSubmit)}>
            <p className="headpara">What workout you did today</p>
            <input type="text" placeholder="Eg ..Weighted Pullups" required  {...register("workoutname")} />
            <p className="headpara">For How many sets</p>
            <input type="number" placeholder="Eg... 2" required  {...register("totalsets")} />
            <p className="headpara">What about reps</p>
            <input type="number" placeholder="Eg... 12" required  {...register("totalreps")} />
            <br /><br /><br />
            <button>Log your workout</button>
        </form>

    </>


}

export default TrackWorkout;