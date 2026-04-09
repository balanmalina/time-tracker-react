export const USERS = [
  { id: 1, name: "Admin Ionescu", email: "admin@pontaj.ro", password: "admin123", role: "admin", avatar: "AI" },
  { id: 2, name: "Malina", email: "malina@pontaj.ro", password: "user123", role: "user", avatar: "ML" },
  { id: 3, name: "Andrei Dumitrescu", email: "andrei@pontaj.ro", password: "user123", role: "user", avatar: "AD" },
];

export const PROJECTS = [
  "Website Redesign",
  "App Mobile",
  "Dashboard Admin",
  "API Backend",
  "Testing & QA",
];

export const INITIAL_ENTRIES = [
  { id: 1, userId: 2, date: "2025-06-02", hours: 8, project: "Website Redesign", description: "Implementare pagina home", status: "approved" },
  { id: 2, userId: 2, date: "2025-06-03", hours: 6, project: "App Mobile", description: "Design ecran login", status: "approved" },
  { id: 3, userId: 2, date: "2025-06-04", hours: 7, project: "Website Redesign", description: "Componente header si footer", status: "pending" },
  { id: 4, userId: 3, date: "2025-06-02", hours: 8, project: "API Backend", description: "Endpoints autentificare", status: "approved" },
  { id: 5, userId: 3, date: "2025-06-03", hours: 5, project: "Testing & QA", description: "Teste unitare", status: "pending" },
  { id: 6, userId: 3, date: "2025-06-04", hours: 9, project: "Dashboard Admin", description: "Grafice si statistici", status: "rejected" },
];