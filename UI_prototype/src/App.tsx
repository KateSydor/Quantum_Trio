import { RouterProvider, usePage } from './router';
import LandingPage  from './pages/Landing';
import LoginPage    from './pages/Login';
import RegisterPage from './pages/Register';
import HomePage     from './pages/Home';
import GeneratePage from './pages/Generate';
import LoadingPage  from './pages/Loading';
import RecipePage   from './pages/Recipe';
import ProfilePage  from './pages/Profile';

function Pages() {
  const page = usePage();
  const map: Record<string, JSX.Element> = {
    landing:  <LandingPage />,
    login:    <LoginPage />,
    register: <RegisterPage />,
    home:     <HomePage />,
    generate: <GeneratePage />,
    loading:  <LoadingPage />,
    recipe:   <RecipePage />,
    profile:  <ProfilePage />,
  };
  return map[page] ?? <LandingPage />;
}

export default function App() {
  return (
    <RouterProvider>
      <Pages />
    </RouterProvider>
  );
}
