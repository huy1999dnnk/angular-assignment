// Auth Actions
export class Login {
  static readonly type = '[Auth] Login';
  constructor(public credentials: { username: string; password: string }) {}
}

export class GetCurrentUser {
  static readonly type = '[Auth] Get Current User';
}

export class SetCurrentUser {
  static readonly type = '[Auth] Set Current User';
  constructor(public user: any) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class RefreshToken {
  static readonly type = '[Auth] Refresh Token';
  constructor(public refreshTokenRequest?: { refreshToken: string; expiresInMins?: number }) {}
}

export class SetTokens {
  static readonly type = '[Auth] Set Tokens';
  constructor(public accessToken: string, public refreshToken: string) {}
}
