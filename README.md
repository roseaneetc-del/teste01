# PROJETO AMIGOS DO SABER

**Aprender pode ser divertido!**

Aplicação web responsiva para administração de uma escola de reforço escolar, com experiência especial para crianças e adolescentes e princípios de acessibilidade para TDAH.

## Implementado
- Dashboard administrativo e área dedicada ao aluno.
- Perfis de administrador, professor e aluno com menus diferentes.
- 5 alunos, 2 professores, 2 turmas, tarefas, atividades e pagamentos fictícios.
- Cadastro rápido de alunos.
- Gestão visual de tarefas, dificuldade, status e conclusão.
- Atividades educativas com quiz e feedback positivo.
- Gamificação com pontos, estrelas, sequência e conquistas.
- Financeiro, calendário, notificações, relatórios e configurações.
- Modo foco para reduzir distrações e animações.
- Layout responsivo para celular, tablet e desktop.
- Estrutura Supabase em supabase/schema.sql com RLS.
- Cliente Supabase opcional em src/lib/supabase.ts.

## Rodar
1. Node.js 20+.
2. npm install
3. npm run dev
4. Para produção, copie .env.example para .env e configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
5. Execute supabase/schema.sql no SQL Editor do Supabase.
6. Configure usuários no Supabase Auth e atribua as funções em profiles.

## Demonstração
admin@amigosdosaber.demo
prof@amigosdosaber.demo
aluno@amigosdosaber.demo

Qualquer senha funciona no modo demonstração. Os dados são fictícios e não devem ser usados como dados reais de alunos.

## Próxima etapa de produção
Conectar as telas CRUD ao Supabase e substituir o estado demo por consultas autenticadas. O RLS já separa administrador, professor e aluno no banco e bloqueia o acesso do aluno ao financeiro.