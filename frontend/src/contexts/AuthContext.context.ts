import { createContext } from 'react';
import { AuthContextType } from './AuthContext.types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;