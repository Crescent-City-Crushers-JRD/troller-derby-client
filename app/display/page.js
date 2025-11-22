"use client"
import {useEffect, useState} from "react";
import axios from "axios";


export default function Page() {
    function capitalizeFirstLetter(string) {
        if (!string) return ""; // Handle empty or null strings
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const [pending, setPending] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [approved, setApproved ] = useState([]);
    const [upNext, setUpNext] = useState([]);
    const [running, setRunning] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [currentJam, setCurrentJam] = useState(0);
    const [totalRaised, setTotalRaised] = useState(0.00);
    const host = process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD;
    useEffect(() => {
        axios.get(host+"/queues/"+process.env.NEXT_PUBLIC_EVENT_ID).then((response) => {
            console.log(response.data.queues);
            const queues = response.data.queues;
            if(queues.approved !== null) {
                setApproved(queues.approved);
            }
            if(queues.completed !== null) {
                setCompleted(queues.completed);
            }
            if(queues.pending !== null) {
                setPending(queues.pending);
            }
            if(queues.purchased !== null) {
                setPurchased(queues.purchased);
            }
            if(queues.running !== null) {
                setRunning(queues.running);
            }
            if(queues.up_next !== null) {
                setUpNext(queues.up_next);
            }
            setTotalRaised(queues.total_raised);
            setCurrentJam(queues.current_jam);
        });
    }, []);
    useEffect(() => {
        const events = new EventSource(host + "/events")
        events.addEventListener("buy", (e) => {
            const data = JSON.parse(e.data)
            console.log("Buy event:", data)
            setPending(prevArray => [...prevArray, data])
        })
        events.addEventListener("queues", (e) => {
            const data = JSON.parse(e.data)
            console.log("Queues event:", data)
            if(data.approved !== null) {
                setApproved(data.approved);
            } else {
                setApproved([])
            }
            if(data.completed !== null) {
                setCompleted(data.completed);
            } else {
                setCompleted([])
            }
            if(data.pending !== null) {
                setPending(data.pending);
            } else {
                setPending([])
            }
            if(data.purchased !== null) {
                setPurchased(data.purchased);
            } else {
                setPurchased([]);
            }
            if(data.running !== null) {
                setRunning(data.running);
            } else {
                setRunning([])
            }
            if(data.up_next !== null) {
                setUpNext(data.up_next);
            } else {
                setUpNext([])
            }
            setTotalRaised(data.total_raised);
            setCurrentJam(data.current_jam);
        })
        events.onerror = (err) => {
            console.error("SSE error:", err)
        }
        return () => events.close()
    }, [])
    const trollBox = (trolls, orient) => {
        let width = ""
        if(orient === "row") {
            width = "w-1/6"
        } else {
            width = "w-full"
        }
        return trolls.map((troll) => {
            const target = troll.troll_target_selection;
            const tBg = target === "white" ? "bg-white text-black" : (target === "black" ? "bg-black text-white" : "bg-teal-300")
            return (
                <ul
                    key={troll.id}
                    className={`transitional-all duration-500 ease-out ${width} border h-[180px] ${tBg} text-black flex flex-col justify-center items-center m-2 pt-2 pb-2 rounded-2xl`}>
                    <li className="w-full text-center text-xl font-bold p-1">{troll.troll_item.name}</li>
                    <li className="p-1 w-full text-center text-lg">{troll.troll_item.description}</li>
                    <li className="p-1 w-full text-center text-lg italic">{capitalizeFirstLetter(troll.troll_target_selection)}</li>
                    <li className="p-1 w-fill text-center">Donated By: <span className="text-xl font-extrabold">{troll.buyer_name}</span></li>
                </ul>
            )
        })
    }
    const happeningNow = (trolls) => {
        const myTrolls = trollBox(trolls, "row")

        return (
            <div className="w-full flex flex-col justify-center items-center border mt-4 p-3">
               <h2 className="text-4xl font-extrabold text-center w-full border-b-3 pb-2">Happening Now - Jam #{currentJam}</h2>
              <div className="w-full flex flex-row">
                  {myTrolls.length > 0 ? myTrolls : <div className="w-full border rounded-2xl mt-2 mb-2 h-[200px] text-4xl flex justify-center items-center bg-pink-400 text-black">Nothing So Far! Go Buy A Troll!</div>}
              </div>
            </div>
      )
    };
    let upcomingTrolls = [...purchased,...approved,...upNext]
    const toCome = (trolls) => {
        const myTrolls = trollBox(trolls, "row")
        return (
            <div className="w-full flex flex-col justify-center items-center border mt-4 p-3">
                <h2 className="text-4xl font-extrabold text-center w-full border-b-3 pb-2">Trolls To Come</h2>
                <div className="w-full flex flex-row pr-4 pl-4">
                    {myTrolls}
                </div>
            </div>
        )
    };
    const ofLegend = (trolls) => {
        const myTrolls = trollBox(trolls, "row")
        return (
            <div className="w-full flex flex-col justify-center items-center border mt-4 p-3">
                <h2 className="text-4xl font-extrabold text-center w-full border-b-3 pb-2">Trolls of Fame</h2>
                <div className="w-full flex flex-row flex-wrap overflow-scroll h-[200px]">
                    {myTrolls}
                </div>
            </div>
        )
    };
    return (
        <div className="flex flex-col justify-center items-center">
            <h1 className="mt-5 mb-2 text-8xl font-extrabold text-black text-shadow-md text-shadow-amber-400 w-full text-center">This Is Troller Derby!</h1>
            {happeningNow(running)}
            <div className="text-6xl mt-4 mb-4 font-extrabold text-pink-700">Total Raised So Far: ${totalRaised.toFixed(2)}</div>
            {toCome(upcomingTrolls)}
            {ofLegend(completed)}

        </div>
    )
}