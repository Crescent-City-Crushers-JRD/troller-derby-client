"use client"; // required in Next.js App Router for context components

import { createContext, useContext, useState } from "react";

const TrollContext = createContext();

export function TrollProvider({ children }) {
    const [menuSelection, setMenuSelection] = useState({id:""});
    const [user, setUser] = useState(null);

    return (
        <TrollContext.Provider value={{ menuSelection, setMenuSelection, user, setUser }}>
            {children}
        </TrollContext.Provider>
    );
}

export function useTroller() {
    return useContext(TrollContext);
}
