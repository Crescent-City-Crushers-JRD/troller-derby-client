"use client";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Page() {
    const [queueProcessing, setQueueProcessing] = useState(false);
    const [pending, setPending] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [approved, setApproved ] = useState([]);
    const [upNext, setUpNext] = useState([]);
    const [running, setRunning] = useState([]);
    const [completed, setCompleted] = useState([]);
    const [currentJam, setCurrentJam] = useState(0);
    const host = process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD;

    const findAndRemoveFromQueue = (queue, target) => {

    }
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

    const columnChangeHandler = (itemData, fromColumn, actionName) => {
        setQueueProcessing(true);
        let buyData = {
            buy_id: itemData.id,
            update_type: "",
            update_value: "",
        }
        switch (fromColumn) {
            case "Pending":
                if(actionName === "Confirm") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "pay_status",
                        update_value: "paid",
                    };
                } else if(actionName === "Cancel") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "pay_status",
                        update_value: "cancelled",
                    };
                    setPending(prevItems =>
                        prevItems.filter(item => item.id !== itemData.id)
                    );

                }
                break;
            case "Awaiting":
                if(actionName === "Confirm") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "queue_placement",
                        update_value: "approved",
                    };
                } else if(actionName === "Cancel") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "pay_status",
                        update_value: "pending",
                    };
                }
                break;
            case "Assigning":
                if(actionName === "Cancel") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "queue_placement",
                        update_value: "purchased",
                    };
                }
                break;
            case "UpNext":
                if(actionName === "Cancel") {
                    buyData = {
                        buy_id: itemData.id,
                        update_type: "queue_placement",
                        update_value: "approved",
                    }
                }

        }
        axios.post(host+"/purchase/update",buyData).finally(()=>{ setQueueProcessing(false)})

    }
    const columnItem = (itemData, confirmMessage, columnName, jamColumnType) => {
        if(jamColumnType === "cancelable") {
            return(
            <ul
                key={itemData.id}
                className="flex flex-col border rounded-2xl border-black p-2 mt-2 text-sm"
            >
                <li className="text-black">[{itemData.id}]</li>
                <li className="text-black">{itemData.buyer_name}</li>
                <li className="text-black ">{itemData.buyer_email}</li>
                <li className="text-black ">{itemData.troll_item.name} - {itemData.troll_target_selection}</li>
                <li className="text-black ">Count: {itemData.pay_amount / itemData.troll_item.price}</li>
                <li className="flex flex-row justify-left mt-2 ml-10">
                    <button className="border p-1 bg-red-300 cursor-pointer"
                            onClick={() => {
                                columnChangeHandler(itemData, columnName, "Cancel")
                            }}
                    >Cancel
                    </button>
                </li>
            </ul>
            );
        } else if(jamColumnType === "standard") {
            return (
                <ul
                    key={itemData.id}
                    className="flex flex-col border rounded-2xl border-black p-2 mt-2 text-sm"
                >
                    <li className="text-black">[{itemData.id}]</li>
                    <li className="text-black">{itemData.buyer_name}</li>
                    <li className="text-black ">{itemData.buyer_email}</li>
                    <li className="text-black ">{itemData.payment_method} - ${itemData.pay_amount}</li>
                    <li className="text-black ">{itemData.troll_item.name} - {itemData.troll_target_selection}</li>
                    <li className="text-black ">Count: {itemData.pay_amount / itemData.troll_item.price}</li>
                    <li className="flex flex-row justify-around mt-2">
                        <button className="border p-1 bg-red-300 cursor-pointer"
                                onClick={() => {
                                    columnChangeHandler(itemData, columnName, "Cancel")
                                }}
                        >Cancel
                        </button>
                        <button className="border p-1 bg-green-300 cursor-pointer"
                                onClick={() => {
                                    columnChangeHandler(itemData, columnName, "Confirm")
                                }}
                        >{confirmMessage}</button>
                    </li>
                </ul>
            )
        } else if(jamColumnType === "fixed") {
            return (
                <ul
                    key={itemData.id}
                    className="flex flex-col border rounded-2xl border-black p-2 mt-2 text-sm"
                >
                    <li className="text-black">[{itemData.id}]</li>
                    <li className="text-black">{itemData.buyer_name}</li>
                    <li className="text-black ">{itemData.buyer_email}</li>
                    <li className="text-black ">{itemData.troll_item.name} - {itemData.troll_target_selection}</li>
                    <li className="text-black ">Count: {itemData.pay_amount / itemData.troll_item.price}</li>
                    <li className="flex flex-row justify-around mt-2">
                    </li>
                </ul>
            )
        }
    }

    const pendingItems = pending.map((item) => {
        return columnItem(item, "Confirm Purchase", "Pending", "standard");
    })
    const approvalItems = purchased.map((item) => {
        return columnItem(item, "Approve", "Awaiting", "standard");
    })
    const assignmentItems = approved.map((item) => {
        return columnItem(item, "Assign To Next Jam", "Assigning", "cancelable");
    })
    const upnextItems = upNext.map((item) => {
        return columnItem(item, "Start Next Jam", "UpNext", "cancelable");
    })
    const runningItems = running.map((item) => {
        return columnItem(item, "Complete This Jam", "Running", "fixed");
    })
    const completedItems = completed.map((item) => {
        return columnItem(item, "Completed", "Completed", "fixed");
    })


    return (
        (queueProcessing ?
                <div className="w-full h-full bg-gray-400 flex justify-center items-center">
                    <p className="text-black text-4xl font-bold">Updating Queue...</p>
                </div> :
                <div className="flex flex-row">
                    <div className="w-1/5 border h-full p-2 m-2">
                        <h3 className="text-center w-full text-xl">Review Purchases</h3>
                        {pendingItems}
                    </div>
                    <div className="w-1/5 border h-full p-2 m-2">
                        <h3 className="text-center w-full text-xl">Approve For Jam Assignment</h3>
                        {approvalItems}
                    </div>
                    <div className="w-1/5 border h-full p-2 m-2">
                        <div className="flex flex-row ">
                            <h3 className="text-center w-4/5 text-xl">Assign to Next Jam: #{currentJam + 1}</h3>
                            { approved.length > 0 ?
                            <button
                                className="border p-1 bg-blue-300 cursor-pointer w-1/5"
                                onClick={() => {
                                    const approvalList = approved.map((item) => {
                                        return item.id
                                    })
                                    console.log("ApprovalList: ", approvalList);
                                    const actBlock = {
                                        action: "assign_to_next",
                                        jam_number: currentJam,
                                        buys: approvalList,
                                    }
                                    setQueueProcessing(true)
                                    axios.post(host+'/queue/jam/set', actBlock).finally(() => {setQueueProcessing(false)})
                                }}
                            >Assign</button> : null
                            }
                        </div>
                        {assignmentItems}
                    </div>
                    <div className="w-1/5 border h-full p-2 m-2">
                        <div className="flex flex-row ">
                            <h3 className="text-center w-4/5 text-xl">Up Next For Jam: #{currentJam + 1}</h3>
                            { upNext.length > 0 ?
                                <button
                                    className="border p-1 bg-blue-300 cursor-pointer w-1/5"
                                    onClick={() => {
                                        const upnextList = upNext.map((item) => {
                                            return item.id
                                        })
                                        const actBlock = {
                                            action: "activate_jam",
                                            jam_number: currentJam + 1,
                                            event_id: process.env.NEXT_PUBLIC_EVENT_ID,
                                            buys: upnextList,
                                        }
                                        setQueueProcessing(true)
                                        axios.post(host+'/queue/jam/set', actBlock).finally(() => {setQueueProcessing(false)})
                                    }}
                                >Start Jam</button> : null
                            }
                        </div>
                        {upnextItems}
                    </div>

                    <div className="w-1/5 border h-full p-2 m-2">
                        <div className="flex flex-row ">
                            <div className="flex flex-row ">
                                <h3 className="text-center text-xl">Current Running Jam: #{currentJam}</h3>
                                { running.length > 0 ?
                                    <button
                                        className="border p-1 bg-blue-300 cursor-pointer"
                                        onClick={() => {
                                            const runningList = running.map((item) => {
                                                return item.id
                                            })
                                            const actBlock = {
                                                action: "complete_jam",
                                                jam_number: currentJam,
                                                buys: runningList,
                                            }
                                            setQueueProcessing(true);
                                            axios.post(host+'/queue/jam/set', actBlock).finally(() => {setQueueProcessing(false)})
                                        }}
                                    >Finish </button> : null
                                }
                            </div>
                        </div>
                        {runningItems}
                    </div>

                    <div className="w-1/5 border h-full p-2 m-2">
                        <h3 className="text-center w-full text-xl">Completed Trolls</h3>
                        {completedItems}
                    </div>
                </div>
        )
    );
}