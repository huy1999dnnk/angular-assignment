import { User } from '../../models/auth.model';

export interface AuthStateModel {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
