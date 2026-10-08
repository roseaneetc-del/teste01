create extension if not exists pgcrypto;
create type public.app_role as enum ('admin','teacher','student');
create type public.task_difficulty as enum ('easy','medium','hard');
create type public.task_status as enum ('pending','progress','done');
create type public.payment_status as enum ('paid','pending','late');

create table public.profiles(id uuid primary key references auth.users(id) on delete cascade,full_name text not null,email text,role public.app_role not null default 'student',created_at timestamptz not null default now());
create table public.classes(id uuid primary key default gen_random_uuid(),name text not null,schedule text,created_at timestamptz not null default now());
create table public.students(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id) on delete set null,name text not null,nickname text,birth_date date,email text,phone text,guardian text,guardian_phone text,class_id uuid references public.classes(id) on delete set null,joined_at date default current_date,pedagogical_notes text,active boolean not null default true,points integer not null default 0,stars integer not null default 0,streak integer not null default 0,created_at timestamptz not null default now());
create table public.teachers(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id) on delete set null,name text not null,email text,phone text,active boolean not null default true,created_at timestamptz not null default now());
create table public.class_students(class_id uuid references public.classes(id) on delete cascade,student_id uuid references public.students(id) on delete cascade,primary key(class_id,student_id));
create table public.class_teachers(class_id uuid references public.classes(id) on delete cascade,teacher_id uuid references public.teachers(id) on delete cascade,primary key(class_id,teacher_id));
create table public.subjects(id uuid primary key default gen_random_uuid(),name text unique not null);
create table public.tasks(id uuid primary key default gen_random_uuid(),student_id uuid not null references public.students(id) on delete cascade,teacher_id uuid references public.teachers(id) on delete set null,date date not null default current_date,subject_id uuid references public.subjects(id) on delete set null,task_of_day text not null,next_task text,difficulty public.task_difficulty not null default 'medium',status public.task_status not null default 'pending',notes text,completed_at timestamptz,created_at timestamptz not null default now());
create table public.student_progress(id uuid primary key default gen_random_uuid(),student_id uuid unique references public.students(id) on delete cascade,completed_tasks integer not null default 0,activities_done integer not null default 0,updated_at timestamptz not null default now());
create table public.achievements(id uuid primary key default gen_random_uuid(),title text not null,icon text,description text,threshold integer not null);
create table public.student_achievements(student_id uuid references public.students(id) on delete cascade,achievement_id uuid references public.achievements(id) on delete cascade,unlocked_at timestamptz not null default now(),primary key(student_id,achievement_id));
create table public.points(id uuid primary key default gen_random_uuid(),student_id uuid references public.students(id) on delete cascade,amount integer not null,reason text,created_at timestamptz not null default now());
create table public.activities(id uuid primary key default gen_random_uuid(),title text not null,type text not null,subject text,description text,active boolean not null default true);
create table public.activity_results(id uuid primary key default gen_random_uuid(),activity_id uuid references public.activities(id) on delete cascade,student_id uuid references public.students(id) on delete cascade,score integer,completed_at timestamptz not null default now());
create table public.payments(id uuid primary key default gen_random_uuid(),student_id uuid not null references public.students(id) on delete cascade,amount numeric(10,2) not null,due_date date not null,paid_at date,method text,status public.payment_status not null default 'pending',created_at timestamptz not null default now());
create table public.notifications(id uuid primary key default gen_random_uuid(),user_id uuid references auth.users(id) on delete cascade,text text not null,read boolean not null default false,created_at timestamptz not null default now());
create table public.calendar_events(id uuid primary key default gen_random_uuid(),title text not null,date date not null,type text not null,class_id uuid references public.classes(id) on delete set null,student_id uuid references public.students(id) on delete set null);
create table public.settings(key text primary key,value jsonb not null default '{}'::jsonb);

create or replace function public.my_role() returns public.app_role language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() $$;

alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.class_students enable row level security;
alter table public.class_teachers enable row level security;
alter table public.tasks enable row level security;
alter table public.subjects enable row level security;
alter table public.student_progress enable row level security;
alter table public.achievements enable row level security;
alter table public.student_achievements enable row level security;
alter table public.points enable row level security;
alter table public.activities enable row level security;
alter table public.activity_results enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.calendar_events enable row level security;
alter table public.settings enable row level security;

create policy profiles_self on public.profiles for select using (id=auth.uid() or public.my_role()='admin');
create policy admin_all_classes on public.classes for all using (public.my_role()='admin');
create policy staff_read_classes on public.classes for select using (public.my_role() in ('teacher','student'));
create policy admin_all_students on public.students for all using (public.my_role()='admin');
create policy student_self on public.students for select using (user_id=auth.uid());
create policy teacher_students on public.students for select using (public.my_role()='teacher' and exists(select 1 from public.class_students cs join public.class_teachers ct on ct.class_id=cs.class_id join public.teachers t on t.id=ct.teacher_id where cs.student_id=students.id and t.user_id=auth.uid()));
create policy admin_all_teachers on public.teachers for all using (public.my_role()='admin');
create policy teacher_self on public.teachers for select using (user_id=auth.uid());
create policy admin_all_tasks on public.tasks for all using (public.my_role()='admin');
create policy teacher_tasks on public.tasks for all using (public.my_role()='teacher' and exists(select 1 from public.teachers t where t.id=tasks.teacher_id and t.user_id=auth.uid()));
create policy student_tasks on public.tasks for select using (public.my_role()='student' and exists(select 1 from public.students s where s.id=tasks.student_id and s.user_id=auth.uid()));
create policy student_update_own_task on public.tasks for update using (public.my_role()='student' and exists(select 1 from public.students s where s.id=tasks.student_id and s.user_id=auth.uid())) with check (public.my_role()='student');
create policy admin_payments on public.payments for all using (public.my_role()='admin');
create policy no_student_finance on public.payments for select using (public.my_role()='admin');
create policy activities_read on public.activities for select using (auth.uid() is not null);
create policy admin_settings on public.settings for all using (public.my_role()='admin');
create policy own_notifications on public.notifications for select using (user_id=auth.uid() or public.my_role()='admin');

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin
 insert into public.profiles(id,full_name,email,role) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',split_part(new.email,'@',1)),new.email,'student');
 return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Complemento de segurança e dados iniciais do Projeto Amigos do Saber.
create policy authenticated_read_achievements on public.achievements for select using (auth.uid() is not null);
create policy own_student_achievements on public.student_achievements for select using (
  exists(select 1 from public.students s where s.id=student_achievements.student_id and (s.user_id=auth.uid() or public.my_role()='admin'))
);
create policy own_points on public.points for select using (
  exists(select 1 from public.students s where s.id=points.student_id and (s.user_id=auth.uid() or public.my_role()='admin'))
);
create policy own_progress on public.student_progress for select using (
  exists(select 1 from public.students s where s.id=student_progress.student_id and (s.user_id=auth.uid() or public.my_role()='admin'))
);
create policy activity_results_own on public.activity_results for all using (
  public.my_role()='admin' or exists(select 1 from public.students s where s.id=activity_results.student_id and s.user_id=auth.uid())
) with check (
  public.my_role()='admin' or exists(select 1 from public.students s where s.id=activity_results.student_id and s.user_id=auth.uid())
);
create policy calendar_events_read on public.calendar_events for select using (auth.uid() is not null);
create policy calendar_events_admin on public.calendar_events for all using (public.my_role()='admin');

insert into public.subjects(id,name) values
('10000000-0000-0000-0000-000000000001','Matemática'),
('10000000-0000-0000-0000-000000000002','Português'),
('10000000-0000-0000-0000-000000000003','Geral')
on conflict (id) do nothing;

insert into public.classes(id,name,schedule) values
('20000000-0000-0000-0000-000000000001','Descobridores','Seg e Qua · 14:00'),
('20000000-0000-0000-0000-000000000002','Exploradores','Ter e Qui · 16:00')
on conflict (id) do nothing;

insert into public.students(id,name,nickname,birth_date,email,guardian,guardian_phone,class_id,joined_at,pedagogical_notes,points,stars,streak) values
('30000000-0000-0000-0000-000000000001','Ana Beatriz Lima','Bia','2015-03-12','bia@amigosdosaber.demo','Carla Lima','(11) 98888-1111','20000000-0000-0000-0000-000000000001','2026-02-01','Gosta de atividades visuais.',120,12,5),
('30000000-0000-0000-0000-000000000002','Miguel Santos','Miguel','2013-08-20','miguel@amigosdosaber.demo','Paulo Santos','(11) 98888-2222','20000000-0000-0000-0000-000000000001','2026-02-05','',90,9,3),
('30000000-0000-0000-0000-000000000003','Sofia Martins','Sofi','2014-11-02','sofi@amigosdosaber.demo','Renata Martins','(11) 98888-3333','20000000-0000-0000-0000-000000000002','2026-03-10','Responde bem a desafios curtos.',180,18,8),
('30000000-0000-0000-0000-000000000004','João Pedro','João','2012-06-18','joao@amigosdosaber.demo','Marcos Pedro','(11) 98888-4444','20000000-0000-0000-0000-000000000002','2026-01-15','',70,7,2),
('30000000-0000-0000-0000-000000000005','Lara Oliveira','Lara','2016-01-25','lara@amigosdosaber.demo','Fernanda Oliveira','(11) 98888-5555','20000000-0000-0000-0000-000000000001','2026-04-02','',150,15,6)
on conflict (id) do nothing;

insert into public.teachers(id,name,email,phone) values
('40000000-0000-0000-0000-000000000001','Marina Souza','prof.marina@amigosdosaber.demo','(11) 99999-1111'),
('40000000-0000-0000-0000-000000000002','Lucas Almeida','prof.lucas@amigosdosaber.demo','(11) 99999-2222')
on conflict (id) do nothing;

insert into public.class_students(class_id,student_id) values
('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002'),
('20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005'),
('20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000003'),
('20000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000004')
on conflict do nothing;

insert into public.class_teachers(class_id,teacher_id) values
('20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001'),
('20000000-0000-0000-0000-000000000002','40000000-0000-0000-0000-000000000002')
on conflict do nothing;

insert into public.activities(id,title,type,subject,description) values
('50000000-0000-0000-0000-000000000001','Quiz de Matemática','quiz','Matemática','Desafios rápidos de cálculo.'),
('50000000-0000-0000-0000-000000000002','Quiz de Português','quiz','Português','Palavras, frases e interpretação.'),
('50000000-0000-0000-0000-000000000003','Jogo da Memória','memory','Geral','Encontre os pares.'),
('50000000-0000-0000-0000-000000000004','Associação de Palavras','match','Português','Ligue palavra e significado.'),
('50000000-0000-0000-0000-000000000005','Desafio Relâmpago','challenge','Geral','Perguntas rápidas para você.'),
('50000000-0000-0000-0000-000000000006','Sequência Lógica','logic','Matemática','Descubra o próximo passo.'),
('50000000-0000-0000-0000-000000000007','Matemática Básica','math','Matemática','Pratique operações simples.')
on conflict (id) do nothing;

insert into public.achievements(id,title,icon,description,threshold) values
('60000000-0000-0000-0000-000000000001','Primeira tarefa','🏆','Concluiu sua primeira tarefa.',1),
('60000000-0000-0000-0000-000000000002','5 tarefas','⭐','Concluiu 5 tarefas.',5),
('60000000-0000-0000-0000-000000000003','10 tarefas','🚀','Concluiu 10 tarefas.',10),
('60000000-0000-0000-0000-000000000004','20 atividades','📚','Concluiu 20 atividades.',20),
('60000000-0000-0000-0000-000000000005','5 dias estudando','🔥','Manteve uma sequência de 5 dias.',5)
on conflict (id) do nothing;

insert into public.payments(id,student_id,amount,due_date,paid_at,method,status) values
('70000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',280,'2026-10-05','2026-10-04','Pix','paid'),
('70000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000002',280,'2026-10-05',null,'Pix','pending'),
('70000000-0000-0000-0000-000000000003','30000000-0000-0000-0000-000000000003',320,'2026-10-05',null,'Cartão','late'),
('70000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000004',320,'2026-10-05','2026-10-05','Pix','paid'),
('70000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000005',280,'2026-10-05','2026-10-03','Dinheiro','paid')
on conflict (id) do nothing;
