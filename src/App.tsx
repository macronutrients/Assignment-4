import {useEffect,  useState } from 'react';
import {Link, NavLink, Route, Routes, useParams, useSearchParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getItem, getItems, updateItem} from "./api";
import type {Item, Status} from "./types";
import {useUiStore} from "./useUiStore";

const statuses: Status[]=["want", "active","done","dropped"];
function Nav(){
  const theme = useUiStore((state)=>state.theme);
  const density = useUiStore((state) => state.density);
  const toggleTheme = useUiStore((state)=> state.toggleTheme);
  const setDensity = useUiStore((state)=> state.setDensity);

  const linkClass = ({isActive}: {isActive: boolean}) =>
    isActive?"bg-blue-600 text-white px-3 py-2 rounded":"px-3 py-2 rounded";

  return(
    <nav className="flex flex-wrap gap-2 border-b p-4">
      <NavLink to="/" end className={linkClass}>
      Home</NavLink>

      {statuses.map((s)=> (
        <NavLink key={s} to={`/list/${s}`} className={linkClass}>
          {s}
        </NavLink>
      ))}
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

function ItemCards({items}: {items:Item[]}){
  const density = useUiStore((state)=> state.density);
  const pad = density === "compact" ? "p-2": "p-4";
  if(items.length ===0){
    return <p className="mt-4">No items found.</p>;
  }

  return (<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item) =>(
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
