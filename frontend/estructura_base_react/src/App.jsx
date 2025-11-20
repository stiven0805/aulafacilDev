import { useRoutes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Home from './pages/Home.jsx'
import StudentReservations from './pages/StudentReservations.jsx'
import AdminReservations from './pages/AdminReservations.jsx'
import AdminAulas from './pages/AdminAulas.jsx'
import AdminReportes from './pages/AdminReportes.jsx'

const routes = [
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/login',
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: '/registro',
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
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
  const element = useRoutes(routes)
  return element
}

export default App
