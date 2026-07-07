import type {Item, Status} from "./types"; //importing items from local ./types file

const API_URL = "http://localhost:3001/items"; //pretty standard URL used in when using JSON

export async function getItems(): Promise<Item[]> { //all of these async functions allows the the transition from backend to front end.
const res = await fetch(API_URL); //waiting because  takes time to retrieve backend
if(!res.ok) throw new Error("Could not load items");
return res.json();
}

export async function getItem(id:number): Promise<Item |null>{ // this transition takes place when one of these async functions are called in a variable that is created
    const res = await fetch(`${API_URL}/${id}`); //almost always has to wait for the backend

    if(res.status === 404){
        return null;
    }

    if(!res.ok){
        throw new Error("Couldn't Load Item");
    }

    return res.json();
}

export async function updateItem( //async function again but the purpose here is to update the value
    id:number, 
    data:{status?: Status; rating?: number|null; note?: string|null}
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


