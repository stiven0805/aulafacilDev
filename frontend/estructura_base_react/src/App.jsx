import { useRoutes } from 'react-router-dom'
import './App.css'

// Layout general que incluye tu PublicHeader
import { Layout } from './components/Layout.jsx'

// Rutas protegidas
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

// Páginas públicas
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'

// Páginas estudiante
import StudentReservations from './pages/StudentReservations.jsx'

// Páginas admin
import AdminReservations from './pages/AdminReservations.jsx'
import AdminAulas from './pages/AdminAulas.jsx'
import AdminReportes from './pages/AdminReportes.jsx'

const routes = [
  // 🔹 RUTAS PÚBLICAS SIN LAYOUT
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/registro',
    element: <Register />,
  },

  // 🔹 HOME PÚBLICO CON LAYOUT (tiene el header)
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },

  // 🔹 RUTAS DEL ESTUDIANTE (PROTEGIDAS + LAYOUT)
  {
    element: (
      <Layout>
        <ProtectedRoute />
      </Layout>
    ),
    children: [
      { path: '/estudiante/reservas', element: <StudentReservations /> },
    ],
  },

  // 🔹 RUTAS DE ADMIN (PROTEGIDAS + LAYOUT)
  {
    element: (
      <Layout>
        <ProtectedRoute requiredAdmin />
      </Layout>
    ),
    children: [
      { path: '/admin/reservas', element: <AdminReservations /> },
      { path: '/admin/aulas', element: <AdminAulas /> },
      { path: '/admin/reportes', element: <AdminReportes /> },
    ],
  },
]

function App() {
  return useRoutes(routes)
}

export default App
