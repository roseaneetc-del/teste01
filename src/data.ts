import type {Achievement, Activity, Payment, SchoolClass, Student, Task, Teacher} from "./types";
export const teachers:Teacher[]=[
{id:"t1",name:"Marina Souza",email:"prof.marina@amigosdosaber.demo",phone:"(11) 99999-1111",active:true},
{id:"t2",name:"Lucas Almeida",email:"prof.lucas@amigosdosaber.demo",phone:"(11) 99999-2222",active:true}];
export const students:Student[]=[
{id:"s1",name:"Ana Beatriz Lima",nickname:"Bia",birthDate:"2015-03-12",email:"bia@amigosdosaber.demo",phone:"",guardian:"Carla Lima",guardianPhone:"(11) 98888-1111",classId:"c1",joinedAt:"2026-02-01",notes:"Gosta de atividades visuais.",active:true,points:120,stars:12,streak:5},
{id:"s2",name:"Miguel Santos",nickname:"Miguel",birthDate:"2013-08-20",email:"miguel@amigosdosaber.demo",phone:"",guardian:"Paulo Santos",guardianPhone:"(11) 98888-2222",classId:"c1",joinedAt:"2026-02-05",notes:"",active:true,points:90,stars:9,streak:3},
{id:"s3",name:"Sofia Martins",nickname:"Sofi",birthDate:"2014-11-02",email:"sofi@amigosdosaber.demo",phone:"",guardian:"Renata Martins",guardianPhone:"(11) 98888-3333",classId:"c2",joinedAt:"2026-03-10",notes:"Responde bem a desafios curtos.",active:true,points:180,stars:18,streak:8},
{id:"s4",name:"João Pedro",nickname:"João",birthDate:"2012-06-18",email:"joao@amigosdosaber.demo",phone:"",guardian:"Marcos Pedro",guardianPhone:"(11) 98888-4444",classId:"c2",joinedAt:"2026-01-15",notes:"",active:true,points:70,stars:7,streak:2},
{id:"s5",name:"Lara Oliveira",nickname:"Lara",birthDate:"2016-01-25",email:"lara@amigosdosaber.demo",phone:"",guardian:"Fernanda Oliveira",guardianPhone:"(11) 98888-5555",classId:"c1",joinedAt:"2026-04-02",notes:"",active:true,points:150,stars:15,streak:6}];
export const classes:SchoolClass[]=[
{id:"c1",name:"Descobridores",teacherIds:["t1"],studentIds:["s1","s2","s5"],schedule:"Seg e Qua · 14:00"},
{id:"c2",name:"Exploradores",teacherIds:["t2"],studentIds:["s3","s4"],schedule:"Ter e Qui · 16:00"}];
export const tasks:Task[]=[
{id:"task1",studentId:"s1",teacherId:"t1",date:"2026-10-08",subject:"Matemática",today:"Resolver 5 continhas de adição.",next:"Desafio de subtração.",difficulty:"easy",status:"done",notes:"Excelente concentração.",completedAt:"2026-10-08"},
{id:"task2",studentId:"s2",teacherId:"t1",date:"2026-10-08",subject:"Português",today:"Ler uma história curta.",next:"Identificar personagens.",difficulty:"medium",status:"progress",notes:"",},
{id:"task3",studentId:"s3",teacherId:"t2",date:"2026-10-08",subject:"Matemática",today:"Sequência lógica de números.",next:"Problemas de multiplicação.",difficulty:"medium",status:"pending",notes:"",},
{id:"task4",studentId:"s4",teacherId:"t2",date:"2026-10-07",subject:"Português",today:"Jogo de palavras.",next:"Criar três frases.",difficulty:"easy",status:"done",notes:"Muito bem!",completedAt:"2026-10-07"}];
export const payments:Payment[]=[
{id:"p1",studentId:"s1",amount:280,dueDate:"2026-10-05",paidAt:"2026-10-04",method:"Pix",status:"paid"},
{id:"p2",studentId:"s2",amount:280,dueDate:"2026-10-05",method:"Pix",status:"pending"},
{id:"p3",studentId:"s3",amount:320,dueDate:"2026-10-05",method:"Cartão",status:"late"},
{id:"p4",studentId:"s4",amount:320,dueDate:"2026-10-05",paidAt:"2026-10-05",method:"Pix",status:"paid"},
{id:"p5",studentId:"s5",amount:280,dueDate:"2026-10-05",paidAt:"2026-10-03",method:"Dinheiro",status:"paid"}];
export const activities:Activity[]=[
{id:"a1",title:"Quiz de Matemática",type:"quiz",subject:"Matemática",description:"Desafios rápidos de cálculo."},
{id:"a2",title:"Quiz de Português",type:"quiz",subject:"Português",description:"Palavras, frases e interpretação."},
{id:"a3",title:"Jogo da Memória",type:"memory",subject:"Geral",description:"Encontre os pares."},
{id:"a4",title:"Associação de Palavras",type:"match",subject:"Português",description:"Ligue palavra e significado."},
{id:"a5",title:"Desafio Relâmpago",type:"challenge",subject:"Geral",description:"Perguntas rápidas para você."},
{id:"a6",title:"Sequência Lógica",type:"logic",subject:"Matemática",description:"Descubra o próximo passo."},
{id:"a7",title:"Matemática Básica",type:"math",subject:"Matemática",description:"Pratique operações simples."}];
export const achievements:Achievement[]=[
{id:"ach1",title:"Primeira tarefa",icon:"🏆",description:"Concluiu sua primeira tarefa.",threshold:1},
{id:"ach2",title:"5 tarefas",icon:"⭐",description:"Concluiu 5 tarefas.",threshold:5},
{id:"ach3",title:"10 tarefas",icon:"🚀",description:"Concluiu 10 tarefas.",threshold:10},
{id:"ach4",title:"20 atividades",icon:"📚",description:"Concluiu 20 atividades.",threshold:20},
{id:"ach5",title:"5 dias estudando",icon:"🔥",description:"Manteve uma sequência de 5 dias.",threshold:5}];