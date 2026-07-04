export type Status = "want"|"active"|"done"|"dropped";
export type Item = {
    id:number; title: string; creator:string, year: number; genre:string; status: Status; rating: number|null; note:string | null;

};