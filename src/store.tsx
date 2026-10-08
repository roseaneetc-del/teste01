import React,{createContext,useContext,useMemo,useState} from "react";
import type {Role,Student,Task,Payment} from "./types";
import * as seed from "./data";
type AppState={role:Role;userId:string;students:Student[];tasks:Task[];payments:Payment[];focus:boolean;setFocus:(v:boolean)=>void;completeTask:(id:string)=>void;addStudent:(s:Student)=>void;addTask:(t:Task)=>void;addPayment:(p:Payment)=>void;logout:()=>void;login:(role:Role,id:string)=>void};
const C=createContext<AppState|null>(null);
export function AppProvider({children}:{children:React.ReactNode}){
 const [role,setRole]=useState<Role>(()=>(localStorage.getItem("pas-role") as Role)||"admin");
 const [userId,setUserId]=useState(()=>localStorage.getItem("pas-user")||"admin");
 const [students,setStudents]=useState(seed.students),[tasks,setTasks]=useState(seed.tasks),[payments,setPayments]=useState(seed.payments),[focus,setFocus]=useState(false);
 const login=(r:Role,id:string)=>{setRole(r);setUserId(id);localStorage.setItem("pas-role",r);localStorage.setItem("pas-user",id)};
 const logout=()=>{localStorage.removeItem("pas-role");localStorage.removeItem("pas-user");setRole("admin");setUserId("admin")};
 const completeTask=(id:string)=>setTasks(v=>v.map(t=>t.id===id?{...t,status:"done",completedAt:new Date().toISOString().slice(0,10)}:t));
 const value=useMemo(()=>({role,userId,students,tasks,payments,focus,setFocus,completeTask,addStudent:(s:Student)=>setStudents(v=>[s,...v]),addTask:(t:Task)=>setTasks(v=>[t,...v]),addPayment:(p:Payment)=>setPayments(v=>[p,...v]),logout,login}),[role,userId,students,tasks,payments,focus]);
 return <C.Provider value={value}>{children}</C.Provider>
}
export const useApp=()=>{const c=useContext(C);if(!c)throw new Error("AppProvider ausente");return c};