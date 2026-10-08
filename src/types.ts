export type Role = "admin" | "teacher" | "student";
export type Difficulty = "easy" | "medium" | "hard";
export type TaskStatus = "pending" | "progress" | "done";
export type PaymentStatus = "paid" | "pending" | "late";

export interface User { id: string; name: string; email: string; role: Role; }
export interface Student { id:string; name:string; nickname:string; birthDate:string; email:string; phone:string; guardian:string; guardianPhone:string; classId:string; joinedAt:string; notes:string; active:boolean; points:number; stars:number; streak:number; }
export interface Teacher { id:string; name:string; email:string; phone:string; active:boolean; }
export interface SchoolClass { id:string; name:string; teacherIds:string[]; studentIds:string[]; schedule:string; }
export interface Task { id:string; studentId:string; teacherId:string; date:string; subject:string; today:string; next:string; difficulty:Difficulty; status:TaskStatus; notes:string; completedAt?:string; }
export interface Payment { id:string; studentId:string; amount:number; dueDate:string; paidAt?:string; method:string; status:PaymentStatus; }
export interface Activity { id:string; title:string; type:string; subject:string; description:string; }
export interface Achievement { id:string; title:string; icon:string; description:string; threshold:number; }
export interface Notification { id:string; text:string; read:boolean; createdAt:string; }
export interface CalendarEvent { id:string; title:string; date:string; type:"class"|"task"|"event"; }
