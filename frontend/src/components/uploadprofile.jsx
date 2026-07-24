import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";


function UploadProfile() {

    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();


    function AfterUpload(data) {

        const profilepicture = data.userpp[0]

        const formData = new FormData()
        formData.append( "pp", profilepicture)

        async function NetworkCall() {

            try {


                const result = await fetch("http://localhost:8001/profilepicture", {
                    body : formData,
                    method: "POST",
                    credentials: "include"
                })

                
                const profilepath = await result.json()
                console.log(profilepath);
                
                

                if (result.ok) {

                    alert("Profile Picture Uploaded Sucessfully")
                    navigate("/profile")
                    



                }


            }

            catch (error) {

            }

        }

        NetworkCall();

    }


    return <>

        <form onSubmit={handleSubmit(AfterUpload)}>

            <h1>Upload Your profile Picture</h1>
            <input type="file" name="pp" style={{ color: "black", height: "80px", alignContent: "center" }} {...register("userpp")} />
            &nbsp; &nbsp;
            <button type="submit">Upload</button>
            <br /><br /><br />

            <Link to="/profile" className="links" style={{ textDecoration: "none" }}>Skip For Now</Link>
        </form>

    </>

}

export default UploadProfile;