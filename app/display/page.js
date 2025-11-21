"use client"
import {useEffect, useState} from "react";

export default function Page() {
    const [pending, setPending] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [approved, setApproved ] = useState([]);
    const [upNext, setUpNext] = useState([]);
    const [running, setRunning] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [currentJam, setCurrentJam] = useState(0);
    const host = process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD;
    useEffect(() => {
        setQueueProcessing(true);
        axios.get(host+"/queues/"+process.env.NEXT_PUBLIC_EVENT_ID).then((response) => {
            console.log(response.data);
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
            setCurrentJam(queues.current_jam);
        }).finally(()=>{setQueueProcessing(false)});
    }, []);
    useEffect(() => {
        console.log("Starting Event Listener on: ", host + "/events");
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
            setCurrentJam(data.current_jam);
        })
        events.onerror = (err) => {
            console.error("SSE error:", err)
        }
        return () => events.close()
    }, [])


}