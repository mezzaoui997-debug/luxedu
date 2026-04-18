import { create } from 'zustand';
const useAuthStore = create((set) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  school: JSON.parse(localStorage.getItem('school') || 'null'),
  login: (token, user, school) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('school', JSON.stringify(school));
    set({ token, user, school });
  },
  logout: () => {
    localStorage.clear();
    set({ token: null, user: null, school: null });
  }
}));
export default useAuthStore;
