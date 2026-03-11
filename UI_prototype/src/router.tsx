import { createContext, useContext, useState, useCallback } from 'react';

export type Page =
  | 'landing' | 'login' | 'register'
  | 'home' | 'generate' | 'loading'
  | 'recipe' | 'profile';

interface RouterCtx {
  page: Page;
  navigate: (p: Page) => void;
}

const Ctx = createContext<RouterCtx>({ page: 'landing', navigate: () => {} });

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [page, setPage] = useState<Page>('landing');
  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  }, []);
  return <Ctx.Provider value={{ page, navigate }}>{children}</Ctx.Provider>;
}

export const useNavigate = () => useContext(Ctx).navigate;
export const usePage = () => useContext(Ctx).page;
