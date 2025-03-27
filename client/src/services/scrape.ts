import axios from "axios";

interface website {
    url: string;
    tags?: string;
};
const SERVER = "http://localhost:3000/sel"

export async function scrape(website: website) {
    return axios
        .post(SERVER, website, {
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((res)=>res.data)
        .catch((error)=>{
            throw error;
        })

}