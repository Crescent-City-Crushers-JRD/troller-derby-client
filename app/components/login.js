import {useTroller} from "@/app/components/trollProvider";
import {useState} from "react";


export default function Login() {
    const {user, setUser} = useTroller();

    const [loading, setLoading] = useState(true);
    const [loginOrRegister, setLoginOrRegister] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [trollName, settrollName] = useState("");

    const formToggle =
    <ul className="flex flex-row justify-around mt-8">
        <li onClick={()=>{setLoginOrRegister("login"); setEmail(""); setPassword("");} }
            className={`${loginOrRegister === "login" ? "text-purple-800 font-extrabold bg-amber-50 " : "text-gray-600 cursor-pointer bg-pink-300"} flex items-center justify-center border w-1/3 h-[40px]`}>Login</li>
        <li className="text-black text-shadow-md text-lg flex items-center justify-center">OR</li>
        <li onClick={()=>{setLoginOrRegister("register"); setEmail(""); setPassword("");} }
            className={`${loginOrRegister === "register" ? "text-purple-800 font-extrabold bg-amber-50 " : "text-gray-600 cursor-pointer bg-pink-300 "} flex items-center justify-center border w-1/3 h-[40px]`}>Register</li>
    </ul>;

    const register = <form className="flex flex-col mt-3">
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="name" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Name: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="text" placeholder="Your full name please"
                   value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="email" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Email: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="text" placeholder="Your email"
                   value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="trollerName" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Troller Name: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="text"  placeholder="The name to show with your trolls"
                   value={trollName} onChange={(e) => settrollName(e.target.value)} />
        </div>
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="password" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Password: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="text" placeholder="Set a password of any length or characters"
                   value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex flex-row justify-end items-center mt-5 mr-20"
        onClick={()=>{
            if(name !== "" && email !== "" && trollName !== "" && password !== ""){
                setUser({id:1, name: name, email: email, trollName: trollName, trollEmail: email,  loggedIn: false,
                    authToken:""});
            }
        }}>
            <div className="flex justify-center items-center border w-1/3 h-[40px] bg-amber-100 text-pink-900">Register</div>
        </div>
    </form>

    const login = <form className="flex flex-col mt-3">
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="email" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Email: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="text" placeholder="Your email"
                   value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="flex flex-row justify-start items-space-between mt-2">
            <label htmlFor="password" className="w-1/3 mr-2 flex text-right justify-end-safe items-center">Password: </label>
            <input className="h-[40px] w-1/2 border bg-white pl-2" type="password" placeholder="Your password"
                   value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex flex-row justify-end items-center mt-5 mr-20">
            <div className="flex justify-center items-center border w-1/3 h-[40px] bg-amber-100 text-pink-900"
            onClick={() => {
                if(email !== "" && password !== ""){
                    setUser({id:2, name: "Khaled Alquaddoomi", email: email, trollName: "Troller", trollEmail: email,  loggedIn: true,
                        authToken:""});
                }
            }}
            >Login</div>
        </div>
    </form>

    return (
        <div className=" bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 p-2 flex flex-col justify-center">
            {formToggle}
            {loginOrRegister === "register" ? register : login}
        </div>
    )

}