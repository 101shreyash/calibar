import { useNavigate , Link } from "react-router-dom";
import {useForm} from "react-hook-form"





function Login() {

const navigate = useNavigate()

let {register , handleSubmit} = useForm();

function AfterSubmit(data) {

   const username = data.username
   const password = data.password


async function DbQuery() {

     try {

      const result = await fetch("http://localhost:8001/login" , {
      method : "POST",
      body : JSON.stringify({username : username , password : password}),
      credentials : "include",
      headers : {
         'Content-Type': 'application/json'
      }

     }) // fetch bracket ends here 

     const data = await result.json()

     if (data.error === "PASSWORD_USERNAME_NOTMATCHED") {

      alert("Username or password Didn't Match")
      
     }

     if (data.error === "USERNAME_NOT_FOUND") {

      return alert("Username dosen't exists")
      
     }
     

     if (result.ok) {


      return navigate("/askname")

      
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

      <h1>Login Now</h1>

      <form onSubmit={handleSubmit(AfterSubmit)}>
         <h2>Username</h2>
         <input type="text" placeholder="Enter your username" required  {...register("username")}  />
         <br /><br />
         <h2>Password</h2>
         <input type="password" placeholder="Enter your password" required   {...register("password")} />
         <br /><br />
         <br /><br /><br />
         <button type="submit">Login</button>


      </form>

<p className="footer"> Need an Account ? <Link to="/signup"  className="footerlink"> Signup </Link> </p> 

   </>



}

export default Login;