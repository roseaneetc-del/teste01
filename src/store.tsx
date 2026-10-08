import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import type {Role,Student,Task,Payment,Teacher,SchoolClass} from "./types";
import * as seed from "./data";
import {supabase,isSupabaseConfigured} from "./lib/supabase";

type AppState={
 role:Role; userId:string; loading:boolean; students:Student[]; teachers:Teacher[]; classes:SchoolClass[];
 tasks:Task[]; payments:Payment[]; focus:boolean; setFocus:(v:boolean)=>void;
 completeTask:(id:string)=>Promise<void>; addStudent:(s:Student)=>Promise<void>; addTask:(t:Task)=>Promise<void>;
 addPayment:(p:Payment)=>Promise<void>; logout:()=>Promise<void>; login:(email:string,password:string)=>Promise<Role>;
 signUp:(name:string,email:string,password:string)=>Promise<void>;
};

const C=createContext<AppState|null>(null);
const localRole=()=>((localStorage.getItem("pas-role") as Role)||"admin");
const mapStudent=(s:any):Student=>({id:s.id,name:s.name,nickname:s.nickname||s.name.split(" ")[0],birthDate:s.birth_date||"",email:s.email||"",phone:s.phone||"",guardian:s.guardian||"",guardianPhone:s.guardian_phone||"",classId:s.class_id||"",joinedAt:s.joined_at||"",notes:s.pedagogical_notes||"",active:s.active!==false,points:s.points||0,stars:s.stars||0,streak:s.streak||0});
const mapTask=(t:any,subjects:any[]):Task=>({id:t.id,studentId:t.student_id,teacherId:t.teacher_id||"",date:t.date,subject:subjects.find(s=>s.id===t.subject_id)?.name||"Geral",today:t.task_of_day,next:t.next_task||"",difficulty:t.difficulty,status:t.status,notes:t.notes||"",completedAt:t.completed_at?.slice(0,10)});
const mapPayment=(p:any):Payment=>({id:p.id,studentId:p.student_id,amount:Number(p.amount),dueDate:p.due_date,paidAt:p.paid_at||undefined,method:p.method||"Não informado",status:p.status});

export function AppProvider({children}:{children:React.ReactNode}){
 const [role,setRole]=useState<Role>(localRole()),[userId,setUserId]=useState(()=>localStorage.getItem("pas-user")||"admin"),[loading,setLoading]=useState(true);
 const [students,setStudents]=useState<Student[]>(seed.students),[teachers,setTeachers]=useState<Teacher[]>(seed.teachers),[classes,setClasses]=useState<SchoolClass[]>(seed.classes),[tasks,setTasks]=useState<Task[]>(seed.tasks),[payments,setPayments]=useState<Payment[]>(seed.payments),[focus,setFocus]=useState(false);

 const loadData=async()=>{
   if(!supabase)return;
   const [st,te,cl,sub,ta,pa]=await Promise.all([
     supabase.from("students").select("*").order("name"),
     supabase.from("teachers").select("*").order("name"),
     supabase.from("classes").select("*").order("name"),
     supabase.from("subjects").select("*").order("name"),
     supabase.from("tasks").select("*").order("date",{ascending:false}),
     role==="admin"?supabase.from("payments").select("*").order("due_date",{ascending:false}):Promise.resolve({data:[],error:null})
   ]);
   if(!st.error&&st.data?.length)setStudents(st.data.map(mapStudent));
   if(!te.error&&te.data?.length)setTeachers(te.data as Teacher[]);
   if(!cl.error&&cl.data?.length)setClasses(cl.data.map((c:any)=>({id:c.id,name:c.name,teacherIds:[],studentIds:[],schedule:c.schedule||""})));
   if(!ta.error&&ta.data?.length)setTasks(ta.data.map((t:any)=>mapTask(t,sub.data||[])));
   if(!pa.error&&pa.data?.length)setPayments(pa.data.map(mapPayment));
 };

 const login=async(email:string,password:string)=>{
   if(isSupabaseConfigured&&supabase){
     const {data,error}=await supabase.auth.signInWithPassword({email,password});
     if(error)throw error;
     const {data:p,error:pe}=await supabase.from("profiles").select("role").eq("id",data.user.id).single();
     if(pe)throw pe;
     const r=p.role as Role; setRole(r);setUserId(data.user.id);localStorage.setItem("pas-role",r);localStorage.setItem("pas-user",data.user.id);await loadData();return r;
   }
   const r:Role=email.includes("prof")?"teacher":email.includes("aluno")||email.includes("@amigosdosaber.demo")?"student":"admin";
   const id=r==="teacher"?"t1":r==="student"?"s1":"admin";
   setRole(r);setUserId(id);localStorage.setItem("pas-role",r);localStorage.setItem("pas-user",id);return r;
 };

 const signUp=async(name:string,email:string,password:string)=>{
   if(!supabase)throw new Error("O cadastro real exige a configuração do Supabase.");
   const {error}=await supabase.auth.signUp({email,password,options:{data:{full_name:name}}});
   if(error)throw error;
 };

 const logout=async()=>{if(supabase)await supabase.auth.signOut();localStorage.removeItem("pas-role");localStorage.removeItem("pas-user");setRole("admin");setUserId("admin");setStudents(seed.students);setTasks(seed.tasks);setPayments(seed.payments)};
 const completeTask=async(id:string)=>{
   const completedAt=new Date().toISOString();
   if(supabase&&userId!=="admin"){
     const {error}=await supabase.from("tasks").update({status:"done",completed_at:completedAt}).eq("id",id);
     if(error)throw error;
   }
   setTasks(v=>v.map(t=>t.id===id?{...t,status:"done",completedAt:completedAt.slice(0,10)}:t));
 };
 const addStudent=async(s:Student)=>{
   if(supabase&&role==="admin"){
     const {data,error}=await supabase.from("students").insert({name:s.name,nickname:s.nickname,birth_date:s.birthDate||null,email:s.email||null,phone:s.phone||null,guardian:s.guardian||null,guardian_phone:s.guardianPhone||null,class_id:s.classId||null,joined_at:s.joinedAt||null,pedagogical_notes:s.notes||null,active:s.active,points:s.points,stars:s.stars,streak:s.streak}).select().single();
     if(error)throw error; if(data)s=mapStudent(data);
   }
   setStudents(v=>[s,...v]);
 };
 const addTask=async(t:Task)=>{setTasks(v=>[t,...v]);};
 const addPayment=async(p:Payment)=>{setPayments(v=>[p,...v]);};
 useEffect(()=>{let mounted=true;(async()=>{try{if(isSupabaseConfigured&&supabase){const {data}=await supabase.auth.getSession();if(data.session){setUserId(data.session.user.id);const {data:p}=await supabase.from("profiles").select("role").eq("id",data.session.user.id).single();if(p){setRole(p.role as Role);localStorage.setItem("pas-role",p.role);localStorage.setItem("pas-user",data.session.user.id);}}await loadData();}}finally{if(mounted)setLoading(false)}})();return()=>{mounted=false}},[]);
 const value=useMemo(()=>({role,userId,loading,students,teachers,classes,tasks,payments,focus,setFocus,completeTask,addStudent,addTask,addPayment,logout,login,signUp}),[role,userId,loading,students,teachers,classes,tasks,payments,focus]);
 return <C.Provider value={value}>{children}</C.Provider>;
}
export const useApp=()=>{const c=useContext(C);if(!c)throw new Error("AppProvider ausente");return c};
