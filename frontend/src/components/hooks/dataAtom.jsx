import { atom } from "jotai";
import api from "../../api";


export const dataAtomUser = atom(null)
export const profileAvatar = atom("")

export const fetchDataAtomUser = atom(async (get) => {
    try {
        const response = await api.get("/v1/user");
        return response.data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
});

export const resetUserAtom = atom(null, (get, set) => {
    set(dataAtomUser, null);
});

export const resetAvatar = atom("", (get, set) => {
    set(profileAvatar, "");
});