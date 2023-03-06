import axios from 'axios';
import * as React from 'react';
import { http } from '../utils/http';
import Cookies from 'universal-cookie';

export interface IStateStorage<T> {
  user: T;
  getCurrentUser: () => T;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHERS = 'OTHERS',
}

export interface User {
  id: string;
  birthday: string;
  phone: string;
  gender: Gender;
  name: string;
  avatar: string;
  balance: number;
  userType: 'doctor' | 'student';
}

export interface Student extends User {
  studentCode: string;
  email: string;
}

export interface Doctor extends User {
  briefInfo: string;
  isActive: boolean;
  createAt: string;
  updateAt: string;
}

const REACT_APP_URL_SET_COOKIE = process.env.REACT_APP_URL_SET_COOKIE || 'http://localhost:3000/api/set-cookie';
const REACT_APP_URL_NEXT_APP = process.env.REACT_APP_URL_NEXT_APP || 'http://localhost:3000';

export const StateStorageContext = React.createContext<IStateStorage<any>>({
  user: null,
  getCurrentUser: () => null,
});

export interface StateStorageProviderProps {
  userType: 'doctor' | 'student';
}

interface Props extends React.PropsWithChildren<StateStorageProviderProps> {}

export const StateStorageProvider = ({ children, userType }: Props) => {
  const [user, setUser] = React.useState<any>({});
  const [accessToken, setAccessToken] = React.useState<string>('');

  // get token from localhost:3001/room/123-125?token={tokenString} and set to local storage

  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token') || '';
    console.log(token);
    localStorage.setItem('access-token', token);
    setAccessToken(token);
  }, []);

  React.useEffect(() => {
    if (userType === 'doctor') {
      http
        .get('/doctor/me')
        .then(res => {
          setUser({ ...res.data, userType: 'doctor' });
        })
        .catch(() => {
          // window.location.href = `${REACT_APP_URL_NEXT_APP}/doctor/auth/login?redirectUrl=${window.location.href}`;
        });
    }
    if (userType === 'student') {
      http
        .get('/student/me')
        .then(res => {
          setUser({ ...res.data, userType: 'student' });
        })
        .catch(() => {
          // window.location.href = `${REACT_APP_URL_NEXT_APP}/student/auth/login?redirectUrl=${window.location.href}`;
        });
    }
  }, [accessToken]);

  const getCurrentUser = () => {
    if (userType === 'doctor') {
      return user as Doctor;
    }

    return user as Student;
  };

  return <StateStorageContext.Provider value={{ user, getCurrentUser }}>{children}</StateStorageContext.Provider>;
};

export const useStateStorageContext = () => {
  const { user, ...methods } = React.useContext(StateStorageContext);

  return { ...methods, user: user as User };
};
