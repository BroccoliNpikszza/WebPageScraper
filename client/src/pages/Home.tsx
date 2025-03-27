import { FormEvent, useRef, useState } from "react";
import {scrape} from "../services/scrape";
// import { useForm } from "react-hook-form"

// interface FormData{
//     url:string;
//     tags: string;
// };


function Home() {
    const urlRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const [scrapedData, setScrapedData] = useState<string | null>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event:FormEvent)=> {
        event.preventDefault();

        if (!urlRef.current){
            setError("Please enter a valid website URL.");
            return;
        }

        const website = {
            url: urlRef.current.value,
            tags: tagsRef.current?.value || "",
        };
        setLoading(true);
        setError(null);

        try{
            const data = await scrape(website);
            setScrapedData((data));
            console.log(scrapedData);
        }catch(error){
            setError("Scraping failed.");
            console.log(error);
        }finally{
            setLoading(false);
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="website" className="form-label">Website URl:</label>
                <input ref={urlRef} id="website" className="form-control" type="text" placeholder="https://example.com" />
                <label htmlFor="tags" className="form-label">Tags:</label>
                <input ref={tagsRef} id="tags" className="form-control" type="text" placeholder="div;h1;h2" />
                <button type="submit" className="btn btn-primary">
                    {loading ? "Scraping..." : "Submit"}
                </button>
            </div>
        </form >
        {scrapedData!==null && <div className="overflow-auto">
           {scrapedData} 
        </div>}
        </>
    )

}
export default Home