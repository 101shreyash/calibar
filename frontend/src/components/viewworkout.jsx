
import { useEffect , useState } from "react";
import { useForm } from "react-hook-form";


function Viewworkout() {


    let [workouts , setworkouts] = useState([]);


    async function DbQuery() {


        const fetchdworkouts = await fetch("http://localhost:8001/workouts" , {

            method : "GET",
            credentials : "include",
            headers : {
                "Content-Type": "application/json"
            }
        })


      const userworkouts = await fetchdworkouts.json()
      setworkouts(userworkouts.message)
      
      
      
    }
    


    useEffect(() => {

    DbQuery()

    }, [])
    
    
        
    return <>
    

    <h1> WorkoutDate ||  WorkoutName || TotalSets || TotalReps ||</h1>
    {workouts.map((allworkouts) => {


     const date = allworkouts.workoutdate.substring(0,10)
     console.log(date);
     
     



      return  <>
      
      <h2> {date} &nbsp; &nbsp; {allworkouts.workoutname} &nbsp; &nbsp;  {allworkouts.totalsets} &nbsp; &nbsp; {allworkouts.totalreps}</h2>
      </>
      
      
       

    })}
    
    
    </>



}


export default Viewworkout;