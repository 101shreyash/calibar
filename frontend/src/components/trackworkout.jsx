import { Link, useLocation} from "react-router-dom";
import { useForm } from "react-hook-form"



const Day = new Date().toLocaleDateString("en-US", { weekday: "long" });


function TrackWorkout() {


    let { register, handleSubmit , reset} = useForm()
    
    
    const location = useLocation();
    

    const name = location.state.name
    



    function AfterSubmit(data) {

        const workoutname = data.workoutname
        const totalreps = data.totalreps
        const totalsets = data.totalsets




        if (workoutname.length > 30 || workoutname.length <3) {

           return alert("Workout name should not be more than 30 characters and less than 3")
           reset();

        }

        if (/\d/.test(workoutname)) {

            return alert("Workout name shouldnot consists of any numbers");
            reset();

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

                    const postworkoutmotivation = ["There you champ you did it Again" , "Even in the Hardest Days You showed very few people did that today" , "You remind me the guy who worked everysingle day and at last conquers the earth" , "Even demi gods praising you well done soilder" , "The hardest battle is not the workout you've did but the mind you've controlled well done champ."]

                    const rndvalue = Math.floor(Math.random()*postworkoutmotivation.length)
                    const finalMessage = postworkoutmotivation[rndvalue]

                     alert(finalMessage)
                     return  reset();
                    

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

        <h2>View <Link className="links" to={"/profile"}> Profile</Link></h2>

        
        {name ? <h1>Welcome {name} Its {Day} And You showed up Again </h1> : ""}

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