import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [userInfo, setUserInfo] = useState(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    console.log("Synchronously setting userInfo from token:", token);
                    return { id: decoded.id, token };
                } else {
                    console.log("Token expired on initial load, clearing localStorage");
                    localStorage.removeItem("token");
                    return null;
                }
            } catch (error) {
                console.log("Token decode error on initial load:", error);
                localStorage.removeItem("token");
                return null;
            }
        }
        return null;
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("UserContext useEffect, token check:", token);
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setUserInfo({ id: decoded.id, token });
                } else {
                    console.log("Token expired in useEffect, clearing localStorage");
                    localStorage.removeItem("token");
                    setUserInfo(null);
                }
            } catch (error) {
                console.log("Token decode error in useEffect:", error);
                localStorage.removeItem("token");
                setUserInfo(null);
            }
        }
    }, []);

    const logout = () => {
        console.log("Logging out, clearing userInfo and token");
        localStorage.removeItem("token");
        setUserInfo(null);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logout }}>
            {children}
        </UserContext.Provider>
    );
}