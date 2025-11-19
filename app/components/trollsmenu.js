"use client"
import {useTroller} from "@/app/components/trollProvider";
import Image from "next/image";
import {useEffect} from "react";

export default function TrollsMenu({ items = [] }) {
    const {menuSelection, setMenuSelection, user, setUser} = useTroller();
    const groups = items.reduce((acc, item) => {
        const key = item.troll_type || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    useEffect(() => {
        setMenuSelection({id:""});
    }, [])

    const toppings = (item) => {
        return (<div className="mt-5">
            <h2 className="text-3xl font-extrabold text-pink-700 text-center mb-6 drop-shadow-lg">Pick Your {item.troll_target}</h2>
            {item.troll_target === "Team" ?
                <div className="w-full flex flex-row justify-center">
                    <span
                        data-team={"purple"}
                        onClick={(e) => setMenuSelection(prev => ({...prev, troll_target_selection: e.target.dataset.team})) }
                        className={`${
                            menuSelection.troll_target_selection === "purple" ? "bg-teal-300" : "bg-white/90"
                    } rounded-xl shadow-md p-5 border text-md font-bold text-purple-600 border-pink-300 hover:shadow-xl transition-all mr-5`}>
                        Purple Team
                    </span>
                    <span
                        data-team={"white"}
                        onClick={(e) => setMenuSelection(prev => ({...prev, troll_target_selection: e.target.dataset.team})) }
                        className={`${
                            menuSelection.troll_target_selection === "white" ? "bg-teal-300" : "bg-white/90"
                    } rounded-xl shadow-md p-5 border text-md font-bold text-black border-pink-300 hover:shadow-xl transition-all`}>
                        White Team</span>

                </div> :
                <div className="w-full flex flex-row justify-center">
                    <span className="flex w-11/12 items-center justify-center rounded-xl shadow-md p-5 border text-md font-bold text-pink-900 bg-white transition-all">
                        <label className="w-1/3 transition-all">Choose Your {item.troll_target}:</label>
                        <select className="w-2/3 transition-all border rounded-md shadow-md p-2">
                            <option className="bg-teal-300">Lunatic</option>
                            <option className="bg-teal-300">Vicious</option>
                        </select>
                    </span>
                </div>
            }
        </div>)
    }


    const entries = Object.entries(groups);
    return (
        <div className="flex-col items-center justify-center mb-5">
        <div className="flex items-start justify-center">
            <div className="bg-white/70 backdrop-blur-xl border-2 border-purple-400 rounded-2xl shadow-2xl p-8 w-full relative overflow-hidden">
                <h1 className="text-3xl font-extrabold text-pink-700 text-center mb-6 drop-shadow-lg">🍬Troll Treats🍬</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entries.map(([type, group]) => (
                        <section key={type} className="">
                            <h2 className="text-2xl font-extrabold text-purple-700 mb-3 drop-shadow-sm text-center">{type}</h2>

                            <ul className="space-y-4">
                                {group.map((item) => (
                                    <li
                                        onClick={() => item.id === menuSelection.id ? setMenuSelection({id:""}) : setMenuSelection(item)}
                                        key={String(item.id)}
                                        className={`${
                                            menuSelection.id === item.id ? "bg-teal-300" : "bg-white/90"
                                        } rounded-xl shadow-md p-5 border border-pink-300 hover:shadow-xl transition-all flex cursor-pointer select-none`}
                                    >
                                        { item.troll_image !== "" &&
                                            <Image src={`/${item.troll_image}`} alt="dancing troll"
                                                   width={40}
                                                   height={60}
                                                   className="mr-2"
                                            />
                                        }
                                        <div className="w-full">
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="text-lg font-bold text-purple-700 drop-shadow-sm">{item.name}</h3>
                                                <span className="text-md font-bold text-pink-600">
                            {menuSelection.id === item.id ?
                                typeof menuSelection.total === 'number' ? `$${menuSelection.total.toFixed(2)}` : menuSelection.total.price
                                : typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price}
                          </span>
                                            </div>
                                            <p className="text-purple-600 text-sm font-medium">{item.description}</p>
                                            { item.multiple_buy && menuSelection.multiple_buy && menuSelection.id === item.id  &&
                                            <div className="w-full flex justify-around items-center flex-row mt-2">
                                                <span
                                                    className="border text-4xl font-extrabold rounded-2xl h-[44px]
                                                    w-[44px] flex justify-center items-center bg-pink-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        if(menuSelection.troll_count > 1){
                                                            setMenuSelection(prev => ({
                                                                ...prev,
                                                                troll_count: menuSelection.troll_count - 1,
                                                                total: (menuSelection.troll_count - 1) * menuSelection.price
                                                            }));
                                                        }
                                                    }}
                                                >-</span>
                                                <span className="text-2xl text-black font-extrabold">{menuSelection.troll_count}</span>
                                                <span
                                                    className="border text-4xl font-extrabold rounded-2xl h-[44px]
                                                    w-[44px] flex justify-center items-center bg-pink-200"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setMenuSelection(prev => ({...prev, troll_count: menuSelection.troll_count + 1, total: (menuSelection.troll_count + 1) * menuSelection.price}));
                                                    }}
                                                >+</span>
                                            </div>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
                { menuSelection.id !== "" ? (menuSelection.troll_target !== "Everyone" ? toppings(menuSelection) : null) : null }

            </div>

        </div>

        </div>
    );

}
