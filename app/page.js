"use client"
import {createContext, useContext, useState, useEffect} from "react";
import TrollsContainer from "@/app/components/trollcontainer";
import TrollsMenu from "@/app/components/trollsmenu";

import {useTroller} from "@/app/components/trollProvider";
import SimpleLogin from "@/app/components/simplelogin";
import axios from "axios";
import TrollGreeting from "@/app/components/trollGreeting";
import TrollerIntro from "@/app/components/TrollerIntro";


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [makePurchase, setMakePurchase] = useState("pending");
    const[purchaseReference, setPurchaseReference] = useState("");
    const [menu, setMenu] = useState([]);
    const [event, setEvent] = useState({});
    const [readIntro, setReadIntro] = useState(false);
    const {menuSelection, setMenuSelection, user, setUser} = useTroller()

    const host = (process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD);
    useEffect(() => {
        const result = axios.get(host+"/menu/"+process.env.NEXT_PUBLIC_EVENT_ID).then((response) => {
            const menu = response.data.menu;
            const event = response.data.event;
            const menuItems = []
            console.log(response);
            menu.forEach(element => {
                const tTarget = (element.troll_target === "Everyone" ? "Everyone" : "");
                const menuItem = {
                    id: element.id,
                    name: element.name,
                    description: element.description,
                    price: element.price,
                    troll_type:element.troll_type,
                    troll_image:element.troll_image,
                    troll_target:element.troll_target,
                    multiple_buy:element.multiple_buy,
                    troll_target_selection:tTarget,
                    troll_count: 1,
                    total:element.price,
                }
                menuItems.push(menuItem)
            })
            setMenu(menuItems)
            setEvent(event)
        }).finally(() => setLoading(false));

        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("trollUser");
            if (savedUser) {
                setUser(JSON.parse(savedUser)); // Assuming you store JSON strings
            }
                        const readIntro = localStorage.getItem("trollReadIntro");
            if (readIntro) {
                setReadIntro(true);
            }
        }
    }, []);

    useEffect(() => {
        if(menuSelection.id === 0){
            setMakePurchase("pending");
        }
    }, [menuSelection]);

    const handlePurchase = (menuChoice, user, actionMode, setMenuSelection) => {
        if(actionMode === "cancel") {
            setPurchaseLoading(true);
            axios.get(host+"/purchase/cancel/"+purchaseReference).then((response) => {
                setMenuSelection({id:""})
                setMakePurchase("pending");
            }).finally(() => setPurchaseLoading(false));
            return
        }
        if(makePurchase === "pending") {
            setPurchaseLoading(true);
            axios.post(host+"/purchase/push",
                {
                    event_id: process.env.NEXT_PUBLIC_EVENT_ID,
                    buyer_name: user.trollName,
                    buyer_email: user.email,
                    troll_target_selection: menuChoice.troll_target_selection,
                    pay_amount: menuChoice.total,
                    troll_item_id: menuChoice.id,
                    payment_method: actionMode,
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            ).then((response) => {
                const purchase = response.data.buy;
                setPurchaseReference(purchase.id)
                setMenuSelection(prev=>({...prev, purchase_id: purchase.id}));
                if(actionMode === "with-venmo") {
                    setMakePurchase("venmo-started");
                    window.open(encodeURI("https://venmo.com/cccrushers?txn=pay&amount=" + menuChoice.total.toFixed(2) + "&note=Troller Derby Donation: " + menuChoice.name + " \n Crescent City Crushers Thank You!\n\n Donation Reference: " + purchase.id), "_blank", "noopener,noreferrer");
                } else if (actionMode === "with-cash") {
                    setMakePurchase("cash-started")
                }
            }).finally(() => setPurchaseLoading(false));
        }
    }
    const purchaseButtons = (menuSelection, user, setMenuSelection) => {
        if(menuSelection.id !== "" && user !== null) {
            if(makePurchase === "pending" ) {
                return(
                    <div className="flex flex-row justify-around flex-wrap">
                        <button
                            className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px] p-2
                                        bg-amber-100 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                if(!loading) {
                                    handlePurchase(menuSelection, user, "with-venmo", setMenuSelection);
                                }
                            }}
                        >
                            <p> Buy This Troll With Venmo ( ${menuSelection.total.toFixed(2)} )</p>
                            <p className="text-sm text-black italic">You'll be directed to the Crescent City Crushers Venmo, please pay there</p>
                        </button>
                        <button
                            className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px] p-2
                                    bg-amber-100 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                if(!loading) {
                                    handlePurchase(menuSelection, user, "with-cash", setMenuSelection);
                                }
                            }}
                        >
                            <p> Buy This Troll With Cash ( ${menuSelection.total.toFixed(2)} )</p>
                            <p className="text-sm text-black italic">Please pay at the Event at the Cashier's table</p>
                        </button>
                    </div>
                );
            } else if (makePurchase === "cash-started") {
                return(
                    <div className="flex flex-row justify-around flex-wrap">
                        <button
                            className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px] p-2
                                        bg-amber-100 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                setMakePurchase("pending");
                                setMenuSelection({id:""});
                            }}
                        >
                            <p> Alright! Please come over to the Cashier to pay.</p>
                            <p className="text-xs text-black italic">Purchase ID: { purchaseReference }</p>
                        </button>
                        <button
                            className="mt-2 border-1 rounded-xl border-black w-[300px] h-[90px] p-2
                                        bg-gray-300 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                handlePurchase(menuSelection, user, "cancel", setMenuSelection);
                            }}
                        >
                            <p>Actually, never mind. Please cancel my troll.</p>
                        </button>
                    </div>
                );
            } else if(makePurchase === "venmo-started") {
                return(
                    <div className="flex flex-row justify-around flex-wrap">
                        <button
                            className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px] p-2
                                        bg-amber-100 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                setMakePurchase("pending");
                                setMenuSelection({id:""});
                            }}>
                            <p> Alright! Venmo Complete. Let's make this Troll happen!</p>
                        </button>
                        <button
                            className="mt-2 border-1 rounded-xl border-black w-[300px] h-[90px] p-2
                                        bg-gray-300 flex flex-col justify-center items-center justify-self-center text-black"
                            onClick={() => {
                                handlePurchase(menuSelection, user, "cancel", setMenuSelection);
                            }}
                        >
                            <p>Actually, never mind. Please cancel my troll.</p>
                        </button>
                    </div>
                );
            }
        } else {
            return null;
        }
    }
    //
    return (
    <TrollsContainer event={event}>
        {readIntro ?
            <>
            {user === null ? null : <TrollGreeting user={user} changeUser={setUser} />}
            <TrollsMenu items={menu} />
            {user === null && menuSelection.id !== "" ? <SimpleLogin /> : null }
            {purchaseButtons(menuSelection, user, setMenuSelection)}
            </> : <TrollerIntro closeRead={setReadIntro} />
        }
   </TrollsContainer>
    );
}
