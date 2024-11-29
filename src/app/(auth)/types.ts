export interface signUpResult {
  idErrMsg?: string;
  pwErrMsg?: string;
  nicknameErrMsg?: string;
}

export interface loginResult {
  success: boolean;
  message?: string;
  jwtToken?: string;
}
