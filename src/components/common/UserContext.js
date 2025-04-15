import { createContext } from "react";

export const UserContext = createContext({
    userDetails: null,
    setUserDetails: () => { },
});
