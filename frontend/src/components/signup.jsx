import { Link, useNavigate } from "react-router-dom";
import {useForm} from "react-hook-form"




function Signup() {
   
   const navigate = useNavigate(); 
   
   let {register , handleSubmit} = useForm();

   function AfterSubmit(data) {
   
   
      
      const username = data.username
      const password = data.password
      const confirmpassword = data.confirmpassword
      
      if (username.length > 50 || username.length < 3){
          return alert("Username should be less than 50 characters and more than 3")
      }

      if (username.includes(" ")){
         return alert("Username should'nt consists spaces")
      }

      if (password.length < 8 || password.includes(" ")) {

         return alert("Password must be of 8 characters and shouldnt consist spaces")
      }

      if (confirmpassword !== password) {

         return alert("Confirmation password didnt matched")
      }


  
      async function DbQuery() {

         try {
            
          const result = await fetch("http://localhost:8001/signup" , {
      method : "POST",
      body : JSON.stringify({username : username , password : password , confirmpassword : confirmpassword}),
     headers : {"Content-Type": "application/json"}
         
         
         })


             if (result.ok) {
            
               alert("Signup Sucessfull")
               return navigate("/login")
  
               
             }

             const data = await result.json()             
             
             if (data.error === "USERNAME_ALREDY_EXISTS") {
                return  alert("Username alredy exists try another username ")
               
             }


         } 
         
         
         catch (error) {

            console.log(error);
         return alert("Something went wrong")
            
            
         }
         
      }

      DbQuery();
   
   
}
   
   return <>

   

      <h1>Signup Now</h1>

      <form onSubmit={handleSubmit(AfterSubmit)}>
         <h2>Username</h2>
         <input type="text" placeholder="Enter your username" required  {...register("username")}/>
         <br /><br />
         <h2>Password</h2>
         <input type="password" placeholder="Enter your password" required {...register("password")} />
         <br /><br />
         <h2>Confirm Password</h2>
         <input type="password" placeholder="Make sure its the same password" required {...register("confirmpassword")} />
         <br /><br /><br />
         <button type="submit">Signup</button>


      </form>
      <p className="footer">Have an account ? <Link to="/login"  className="footerlink"> Login </Link> </p> 

   </>


}

export default Signup;