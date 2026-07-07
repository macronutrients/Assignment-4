import {useEffect,  useState } from 'react'; //external library react for functions uses
import {Link, NavLink, Route, Routes, useParams, useSearchParams} from "react-router-dom"; //external library react-router more specific for its functions
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"; // the legendary copy of the backend holder has arrived
import {getItem, getItems, updateItem} from "./api"; //rest are imports from my local files
import type {Item, Status} from "./types";
import {useUiStore} from "./useUiStore";

const statuses: Status[]=["want", "active","done","dropped"]; //these are the only options that you can choose from
function Nav(){
  const theme = useUiStore((state)=>state.theme); // go into the store for said section and grab the frontend data of that variable and fill it same for the rest for each category filling up the nav bar
  const density = useUiStore((state) => state.density);
  const toggleTheme = useUiStore((state)=> state.toggleTheme);
  const setDensity = useUiStore((state)=> state.setDensity);

  const linkClass = ({isActive}: {isActive: boolean}) =>
    isActive?"bg-blue-600 text-white px-3 py-2 rounded":"px-3 py-2 rounded text-inherit";

  return(//this section just deals with the styling of the page tailwind styling to be specific
    <nav className="flex flex-wrap gap-2 border-b p-4">
      <NavLink to="/" end className={linkClass}> 
      Home</NavLink>

      {statuses.map((s)=> (
        <NavLink key={s} to={`/list/${s}`} className={linkClass}>
          {s}
        </NavLink>
      ))}{/*we have the navbar here the text wrapping the gaps padding, and the edges dealt with here */}
      <NavLink to="/about" className={linkClass}>
      About
      </NavLink>

      <button onClick={toggleTheme} className="rounded border px-3 py-2">
        Theme: {theme}</button>

        <select value={density} onChange={(e) => setDensity(e.target.value as "compact"|"comfortable")}
        className="rounded border px-3 py-2 text-black">
          <option value="comfortable">comfortable</option>
          <option value="compact">compact</option>
        </select>

    </nav>

  );
}

function ItemCards({items}: {items:Item[]}){ //describing that Items has got to be an array item
  const density = useUiStore((state)=> state.density); //looks for further details in zustand for both lines 
  const pad = density === "compact" ? "p-2": "p-4";
  if(items.length ===0){ // something like a base case if their is nothing well then nothing is found
    return <p className="mt-4">No items found.</p>;
  }
//styling of the said item card, gaps grid style for allignment, 
  return (<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) =>( //go through each item in the array and make sure to make a link out of it
      <Link key={item.id}
      to={`/items/${item.id}`}
      className={`rounded border ${pad}`}>
        <h2 className="text-xl font-bold">{item.title}</h2>
        <p>{item.creator}</p>
        <p>{item.year}</p>
        <p>{item.genre}</p>
        <p>Status: {item.status}</p>
        <p>Rating:{item.rating??"Not rated"}</p>
      </Link>
    ))}
  </div>);
}
function CatalogPage(){
  const {status} = useParams();
  const[searchParams, setSearchParams] = useSearchParams(); //using our useSearch react paramus function for connecting to the URL
  const q = searchParams.get("q") ?? ""; //use either "q" or ?? when in your search
  const{data,isLoading,isError}= useQuery({ // a destructor here where getItems gets the backend data and UseQuery saves a copy of it we call that the front end copy and gives it back to the inital variables
    queryKey:["items"], queryFn: getItems
  });

  function changeSearch(value: string) {
    const next = new URLSearchParams(searchParams); //get a new dynamic version of searchParams

    if(value){
      next.set("q",value);
    }else{
      next.delete("q");
    }
    setSearchParams(next);
  }
  if(status&&!statuses.includes(status as Status)){
    return <p>Invalid status.</p>;
  }

  if (isLoading){ //we pause here at this section if the functions are indeed loading and waiting for backend data
    return <p>Loading items...</p>;
  }
  if(isError){ //if the data comes back with an message, then we say that their was an error in the process
    return <p>Error loading items.</p>;
  }

  const items = data??[];

  const shown = items.filter((items)=>{
    const statusMatch = !status|| items.status === status;
    const titleMatch = items.title.toLowerCase().includes(q.toLowerCase());
    return statusMatch && titleMatch;
  });
  return ( //the styling of the catalog
    <><h1 className="text-3xl font-bold">MovieShelf</h1>
    <p className="mt-2">A simple movie tracker.</p>
    <input value ={q} onChange={(e) => changeSearch(e.target.value)} placeholder = "search by title" className="mt-4 w-full rounded border p-2 text-black placeholder-gray-200"/> <ItemCards items={shown} />
    </>
  );
}

function DetailPage(){
  const{id} = useParams();
  const itemId = Number(id);
  const queryClient = useQueryClient(); const [note, setNote] = useState("");
  const{data, isLoading, isError} = useQuery({ //here we create a copy of the backend for the frontend to store in usequery so that we can fill in those values so we can work backwords
    queryKey:["items", itemId],
    queryFn: ()=>getItem(itemId), enabled: Number.isFinite(itemId) //the funciton getItem getting the actual data
  });

  useEffect(()=>{
    if(data){
      setNote(data.note??"");
    }
  }, [data]);

  const statusMutation = useMutation({ // variable functions that deal with going from backend data to refreshing front end data
    mutationFn: (status:Status) => updateItem(itemId, {status}),
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ["items"]}) 
  });

  const noteMutation = useMutation({ //same thing here, queryClient is only ran if their is something in the front end copy if their is nothing and nothing is hard coded then ignored
    mutationFn: (note:string)=>updateItem(itemId,{note}),
    onSuccess:()=>queryClient.invalidateQueries({queryKey: ["items"]})

  });

  const ratingMutation = useMutation({
    mutationFn: (rating:number|null)=>updateItem(itemId, {rating}), 
    onSuccess:()=> queryClient.invalidateQueries({queryKey: ["items"]})
  });

  if(!Number.isFinite(itemId)){ return <p>Loading item...</p>;
  }

  if(isLoading){ //if above is loading stop and wait for it to finish
    return<p>Loading item...</p>;
  }

  if(isError){return <p>Error Loading item.</p> //if their is an error while loading communicate that

  }

  if(!data){return <p>Not found.</p>; //also if you can't find the data then also communicate that before we proceed

  }
// this is just styling using tailwind
  return(<><Link to="/" className="underline">Back</Link>
  <h1 className="mt-4 text-3xl font-bold">{data.title}</h1>
  <div className="mt-4 rounded border p-4">
    <p>Creator: {data.creator}</p>
    <p>Year: {data.year}</p>
    <p>Genre: {data.genre}</p> <p>Status: {data.status}</p> <p>Rating: {data.rating ??"Not rated"}</p></div>
    
    <div className ="mt-4 rounded border p-4"><label>Status</label><select
      value={data.status} onChange = {(e)=>statusMutation.mutate(e.target.value as Status)}
      className="ml-2 rounded border p-2 text-Purple-500">{statuses.map((s)=>(
        <option key={s} value ={s}>{s}</option>
      ))}</select></div>
      <div className="mt-4 rounded border p-4"><label>Rating</label>
      <select value={data.rating??""} onChange={(e)=> ratingMutation.mutate(e.target.value ===""?null:Number(e.target.value))} 
      className="ml-2 rounded border p-2 text-black">
        <option value="">Not Rated</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        </select></div>
        
        <div className="mt-4 rounded border p-4">
          <label className="block">Note</label><textarea
          value={note} onChange={(e)=>setNote(e.target.value)}
          className="mt-2 w-full rounded border p-2 text-black"/>

          <button onClick={()=>noteMutation.mutate(note)}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-yellow-300">Save Note</button>
        </div>
        
        {(statusMutation.isPending || noteMutation.isPending || ratingMutation.isPending) &&<p className="mt-4">Saving... </p>}</>);
}
function AboutPage(){ //gives a short description in the about page on intentions of the app
  return(
    <><h1 className="text-3xl font-bold">About</h1><p className="mt-4">
      Movieshelf just a basic movie tracker, it has elements like react router, Tanstack query, zustand, tailwind, and the JSON</p></>
  );
}

function NotFoundPage(){ //if their is some sort of error in locating the page then communicate that with the infamous 404 error
  return (
    <><h1 className='text-3xl font-bold'>404 not Found</h1>
    <Link to="/" className="mt-4 inline-block underline">Go Home</Link></>

  );
}

export default function App(){ //the function for the actuale app, some of the buttons and UI information can be found here
  const theme = useUiStore((state)=>state.theme);
  const density = useUiStore((state)=>state.density);
  const colors = theme ==="dark" ? "bg-slate-900 text-gray-100": "bg-white text-black";
  const size = density ==="compact"?"text-sm":"text-base";
  return(
    <div className={`min-h-screen ${colors} ${size}`}>
      <Nav />
      <main className="mx-auto max-w-5xl p-4">
        <Routes>
          <Route path="/"element={<CatalogPage />}/>
          <Route path="/list/:status"element={<CatalogPage />}/>
          <Route path="/items/:id"element={<DetailPage />}/>
          <Route path="/about"element={<AboutPage />}/>
          <Route path="*"element={<NotFoundPage />}/>

        </Routes>
      </main>
    </div>
  )
}
