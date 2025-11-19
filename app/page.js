"use client"
import {createContext, useContext, useState, useEffect} from "react";
import TrollsContainer from "@/app/components/trollcontainer";
import TrollsMenu from "@/app/components/trollsmenu";

import {useTroller} from "@/app/components/trollProvider";
import SimpleLogin from "@/app/components/simplelogin";
import axios from "axios";
import TrollGreeting from "@/app/components/trollGreeting";


export default function Home() {
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [makePurchase, setMakePurchase] = useState("pending");
    const [menu, setMenu] = useState([]);
    const {menuSelection, setMenuSelection, user, setUser} = useTroller()
    const host = (process.env.NEXT_PUBLIC_API_MODE === "dev" ? process.env.NEXT_PUBLIC_API_HOST_DEV : process.env.NEXT_PUBLIC_API_HOST_PROD);
    useEffect(() => {
        const result = axios.get(host+"/menu/"+process.env.NEXT_PUBLIC_EVENT_ID).then((response) => {
            const menu = response.data.menu;
            const menuItems = []
            console.log(menu);
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
        }).finally(() => setLoading(false));

        if (typeof window !== "undefined") {
            const savedUser = localStorage.getItem("trollUser");
            if (savedUser) {
                setUser(JSON.parse(savedUser)); // Assuming you store JSON strings
            }
        }
    }, []);

    useEffect(() => {
        if(menuSelection.id === 0){
            setMakePurchase("pending");
        }
    }, [menuSelection]);

    const handlePurchase = (menuChoice, user) => {
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
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            ).then((response) => {
                const purchase = response.data.buy;
                setMenuSelection(prev=>({...prev, purchase_id: purchase.id}));
                window.open(encodeURI("https://venmo.com/cccrushers?txn=pay&amount=" + menuChoice.price.toFixed(2) + "&note=Troller Derby Donation: " + menuChoice.name + " \n Crescent City Crushers Thank You!\n\n Donation Reference: " + purchase.id), "_blank", "noopener,noreferrer");
            }).finally(() => setPurchaseLoading(false));
            setMakePurchase("venmo-started");
        } else if (makePurchase === "venmo-started") {
            setMakePurchase("complete");
        }
    }

    const handleCancel = (cancelId) => {

    }
    return (
    <TrollsContainer>
            {user === null ? null : <TrollGreeting user={user} />}
            <TrollsMenu items={menu} />
            {user === null && menuSelection.id !== "" ? <SimpleLogin /> : null }
            <div className="flex flex-row justify-around">
                {menuSelection.id !== "" && menuSelection.troll_target_selection !== ""  && user !== null && makePurchase !== "complete" ?
                    <button
                        className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px] p-2
                                bg-amber-100 flex flex-col justify-center items-center justify-self-center text-black"
                        onClick={() => {
                            if(!loading) {
                                handlePurchase(menuSelection, user);
                            }
                        }}
                    >
                        { makePurchase === "pending" && !purchaseLoading &&
                            <>
                                <p> Buy This Troll ( ${menuSelection.total.toFixed(2)} )</p>
                                <p className="text-sm text-black italic">You'll be directed to the Crescent City Crushers Venmo, please pay there</p>
                            </>
                        }
                        { makePurchase === "venmo-started" && !purchaseLoading &&
                            <>
                                <p> All Done! Let's make this Troll Happen!</p>
                            </>
                        }
                        { purchaseLoading && <>
                            <p className="italic text-black">Hold Tight, sending your troll...</p>
                        </> }

                    </button>
                    : null
                }
                {makePurchase === "venmo-started" && menuSelection.id !== "" && !purchaseLoading && <button className="mt-2 border-1 rounded-xl border-purple-700 w-[300px] h-[90px]
                    p-2 bg-gray-400 flex flex-col justify-center items-center justify-self-center text-black"
                                                             onClick={() => {
                                                                 handleCancel(menuSelection.id);
                                                                 setMakePurchase("pending");
                                                                 setMenuSelection({id:""});
                                                             }} >
                    <p>Never Mind! Cancel this Troll Please.</p>
                </button>}

            </div>
    </TrollsContainer>
    );
}
