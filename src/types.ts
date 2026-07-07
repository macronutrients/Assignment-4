export type Status = "want"|"active"|"done"|"dropped";
export type Item = {//everything that we want in item and everything that we want in status in these lines
    id:number; title: string; creator:string, year: number; genre:string; status: Status; rating: number|null; note:string | null;

};