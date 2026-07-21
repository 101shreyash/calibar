import Homepage from "./components/homepage";
import Signup from "./components/signup";
import "./App.css"
import {Routes , Route} from "react-router-dom"
import Login from "./components/login";
import AskName from "./components/askname";
import Profile from "./components/profile";
import TrackWorkout from "./components/trackworkout";
import Viewworkout from "./components/viewworkout";
import Setting from "./components/setting";
import Compete from "./components/friendsaccount";
import SearchWorkouts from "./components/searchworkouts";

function App () {

   return  <>

    <Routes>
        <Route path="/" element = {<Homepage/>}/>
        <Route path="/signup" element = {<Signup/>}/>
        <Route path="/login" element = {<Login/>}/>
        <Route path="/askname" element = {<AskName/>}/>
        <Route path="/profile" element = {<Profile/>}/>
        <Route path="/trackworkout" element = {<TrackWorkout/>}/>
        <Route path="/viewworkout" element = {<Viewworkout/>}/>
        <Route path="/setting" element = {<Setting/>}/>
        <Route path="/compete" element = {<Compete/>}/>
        <Route path="/searchworkouts" element = {<SearchWorkouts/>}/>

        <Route path="*" element = {<h1>404 Not found</h1>}/>

    </Routes>
   
   </>
   

}


export default App;