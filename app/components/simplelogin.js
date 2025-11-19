import {useTroller} from "@/app/components/trollProvider";
import {useState} from "react";


export default function SimpleLogin() {
    const {user, setUser} = useTroller();

    const [email, setEmail] = useState("");
    const [trollName, settrollName] = useState("");


    const register = <form className="flex flex-col mt-3">
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="email" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Email: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2 text-black" type="text" placeholder="Your email"
                   value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="trollerName" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Troller Name: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2 text-black" type="text"  placeholder="The name to show with your trolls"
                   value={trollName} onChange={(e) => settrollName(e.target.value)} />
        </div>

        <div className="flex flex-row justify-end items-center mt-5 mr-20"
             onClick={()=>{
                 if(email !== "" && trollName !== ""){
                     setUser({email: email, trollName: trollName});
                     if (typeof window !== "undefined") {
                         localStorage.setItem("trollUser", JSON.stringify({email: email, trollName: trollName}));
                     }

                 }
             }}>
            <div className="flex justify-center items-center border w-1/3 h-[40px] bg-amber-100 text-pink-900">Register</div>
        </div>
    </form>


    return (
        <div className=" bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-2 flex flex-col justify-center">
            {register}
        </div>
    )

}