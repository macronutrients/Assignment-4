import type {Item, Status} from "./types";

const API_URL = "http://localhost:3001/items";

export async function getItems(): Promise<Item[]> {
const res = await fetch(API_URL);
if(!res.ok) throw new Error("Could not load items");
return res.json();
}

export async function getItem(id:number): Promise<Item |null>{
    const res = await fetch(`${API_URL}/${id}`);

    if(res.status === 404){
        return null;
    }

    if(!res.ok){
        throw new Error("Couldn't Load Item");
    }

    return res.json();
}

export async function updateItem(
    id:number, 
    data:{stats?: Status; rating?: number|null; note?: string|null}
): Promise<Item>{
    const res=await fetch(`${API_URL}/${id}`,{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }, body:JSON.stringify(data)
    });
    if(!res.ok){
        throw new Error("Could not update item");
    }
    return res.json();

}


