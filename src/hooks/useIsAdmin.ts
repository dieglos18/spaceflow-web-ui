export function useIsAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('spaceflow_admin') === 'true';
}
