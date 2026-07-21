
import { useForm } from "react-hook-form";
import { useState } from "react";

 function SearchWorkouts(params) {
    
    let {register , handleSubmit} = useForm();
    let [workouts , setworkouts]  = useState([])

    function AfterSearch(data) {

      const userworkout = data.userworkout

      async function DbQuery() {

        try {

         const result = await fetch(`http://localhost:8001/workouts/${userworkout}` , {
            method : "GET", 
            headers : {
                    'Content-Type': 'application/json',
            },
            credentials : "include"
         })
         const data = await result.json()
         const workouts  = data.message
 
         if (workouts === "No workouts found") {

         return alert("No workout found")
            
         }  
         
         setworkouts(workouts)
         
            
        } catch (error) {

            console.log(error);
          return  alert("Server Error")
            
            
        }
        
      }



        DbQuery();

        
    }

    


    return <>
    
    <h1>Search Your Workouts Below</h1>
    <form onSubmit={handleSubmit(AfterSearch)}>

        <input type="text" placeholder="Search Your Workout" required {...register("userworkout")}/> &nbsp;
        <button type="submit"> Search</button>

        {workouts.map((eachworkout) => {

            const workoutdate = eachworkout.workoutdate.substring(0,10)  

            return <div key={eachworkout.workoutid}>

                  {console.log(eachworkout)}  

                                


               <h2>You've Did {eachworkout.workoutname} at {workoutdate} which was {eachworkout.totalsets} Sets and {eachworkout.totalreps} Reps</h2>
            
            </div>
            
        })}        

    </form>
    
    
    </>
}


export default SearchWorkouts;