import {useTroller} from "@/app/components/trollProvider";

export default function TrollGreeting({user, changeUser}) {
    return (
        <div className="flex w-full items-center justify-center mb-2">
            <div className="text-black text-center w-2/3 border bg-teal-100 drop-shadow-2xl rounded-3xl mt-2 mb-2 pb-5">
                <div className="flex items-center justify-between w-full p-2 mt-2">
                    <div></div>
                    <button className="w-[120px] h-[30px] border bg-amber-200 mr-2 rounded-xl font-bold"
                            onClick={()=>{
                                localStorage.removeItem("trollUser");
                                changeUser(null);
                            }}
                    >
                        Logout
                    </button>
                </div>
                <p className="text-2xl">Troller: <span className="font-extrabold text-pink-600">{user.trollName}</span></p>
                <p className="text-sm italic">{user.email}</p>
            </div>
        </div>
    )
}