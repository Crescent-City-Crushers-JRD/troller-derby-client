"use client"
import MultiColumnBoard from "@/app/components/MutliColumnDrop";
import {useEffect, useState} from "react";
import axios from "axios";

export default function Page() {
    const[purchased, setPurchased] = useState([]);
    const[upNext, setUpNext] = useState([]);
    const[completed, setCompleted] = useState([]);
    const host = process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD;
    useEffect(() => {
        const queueParser = (queue) => {
            console.log(queue);
            let results = [];
            if(queue !== null) {
                results = queue.map((buy) => {
                    return {id: buy.id, buyer_name: buy.buyer_troll_name, buyer_email:buy.buyer_email, item_name:buy.item.name, price:buy.item.price, description:buy.item.description};
                });
            }
            return results
        }
        axios.get(host+"/queues/"+process.env.NEXT_PUBLIC_EVENT_ID).then((response) => {
            console.log(response.data.queues);
            const reviews = response.data.queues.review
            if(reviews && reviews.length > 0){
                setPurchased(queueParser(reviews))
            }
            const upNextData = response.data.queues.upNext
            if(upNextData && upNextData.length > 0){
                setUpnext(queueParser(upNextData))
            }

        })
    }, [])
    let columns = {
        purchases: {
            id: "purchases",
            title: "Review Purchases",
            items: purchased,
        },
        next: {
            id: "next",
            title: "Up Next",
            items: upNext,
        },
        completed: {
            id: "completed",
            title: "Completed",
            items: completed,
        }
    };
    console.log(columns);
    const Item = ({ item }) => <div>
        {item.item_name}
    </div>;
    console.log(Item)
    const TopBtn = ({ columnId }) => (
        <button className="text-xs bg-green-200 px-2 py-1 rounded">Add to {columnId}</button>
    );

    const BottomBtn = ({ columnId }) => (
        <button className="text-xs bg-red-200 px-2 py-1 rounded">Clear {columnId}</button>
    );
    return(
        <MultiColumnBoard
            columns={columns}
            ItemComponent={Item}
            getId={(item) => item.id}
            onMove={(item, from, to, idx) => console.log(item, from, to, idx)}
            topButton={TopBtn}
            bottomButton={BottomBtn}
        />
    )
}