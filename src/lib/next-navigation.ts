import { useNavigate, useLocation } from 'react-router-dom';

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (url: string) => navigate(url),
    back: () => navigate(-1),
    replace: (url: string) => navigate(url, { replace: true }),
  };
}

export function useSearchParams() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return searchParams;
}
