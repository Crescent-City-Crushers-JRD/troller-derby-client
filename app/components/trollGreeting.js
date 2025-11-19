import {useTroller} from "@/app/components/trollProvider";

export default function TrollGreeting({user}) {
    console.log("Message from Troll Greeting: ", user);
    return (
        <div className="text-black text-center w-full">
            <p>Hello {user.trollName}</p>
            <p>{user.email}</p>
        </div>
    )
}