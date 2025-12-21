export type signinType = {
  data: {
    avatar: null;
    created_at: string;
    deleted_at: null;
    email: string;
    email_verified_at: null;
    full_name: string;
    id: 19;
    provider_id: null;
    provider_name: null;
    range: 0;
    role: null;
    status: string;
    updated_at: string;
    verification_code: string;
    verification_code_expires_at: null;
    verify: null;
  };
  is_success: boolean;
  message: string;
  tokens: tokensType;
};

export type userDetailsType = {
  avatar: null;
  created_at: string;
  deleted_at: null;
  email: string;
  email_verified_at: null;
  full_name: string;
  id: number;
  provider_id: null;
  provider_name: null;
  range: number;
  role: null;
  status: string;
  updated_at: string;
  verification_code: string;
  verification_code_expires_at: null;
  verify: null;
  totalReview: number;
};

export type tokensType = {
  accessToken: string;
  refreshToken: string;
};

export type signupDetailsType = {
  data: {
    created_at: string;
    email: string;
    full_name: string;
    id: number;
    status: string;
    updated_at: string;
    verification_code: number;
  };
  is_success: boolean;
  message: string;
};
