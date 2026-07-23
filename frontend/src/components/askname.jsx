import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";


function AskName() {

   let {register , handleSubmit} = useForm()
    
 const navigate = useNavigate(); 
 
 function AfterSubmit(data) {


   const myname = data.myname;

   

   if (myname.length < 1 || myname.length >30){

      return alert("Your Name shouldn't consist of more than 30 character and less than 1")

   }

   if (/\d/.test(myname)) {

      return alert("Your Name shouldn't consist of any numbers")
   }

   async function DbQuery() {

      try {

         const  result = await fetch("http://localhost:8001/name" , {
         credentials : "include",
         method : "POST",
         body : JSON.stringify({name : myname}),
         headers : {
            "Content-Type": "application/json"
         }
      })  

      if (result.ok) {

         navigate("/profile")
         
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

<h1>What do you want us to call you Today !!</h1>

<form onSubmit={handleSubmit(AfterSubmit)}>
<input type="text" placeholder="Just call me ..." required {...register("myname")}/>
<br /><br /><br />
<p className="footer">You can change your name anytime. </p>
<p className="footer">Your name shoul'nt consists any numbers or special character have plain letters characters from 1 to 100 characters long</p>
<br /><br /><br />
<button type="submit">Get started</button>



</form>


</>


}

export default AskName;


