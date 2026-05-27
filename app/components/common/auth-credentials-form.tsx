"use client";

import { useEffect, useRef } from "react";

import { loginWithCredentials, signupWithCredentials } from "@/app/actions/auth-actions";

type LoginValues = {
  email: string;
};

type SignupValues = {
  name: string;
  email: string;
};

type AuthCredentialsFormProps =
  | {
      mode: "login";
      callbackUrl: string;
      errorMessage: string;
      initialValues: LoginValues;
      preservePasswordsOnError?: boolean;
    }
  | {
      mode: "signup";
      callbackUrl: string;
      errorMessage: string;
      initialValues: SignupValues;
      preservePasswordsOnError?: boolean;
    };

const signupPasswordStorageKey = "signup-credentials-passwords";

export default function AuthCredentialsForm(props: AuthCredentialsFormProps) {
  const action = props.mode === "login" ? loginWithCredentials : signupWithCredentials;
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (props.mode !== "signup") {
      return;
    }

    if (!props.preservePasswordsOnError) {
      window.sessionStorage.removeItem(signupPasswordStorageKey);
      return;
    }

    const savedValues = window.sessionStorage.getItem(signupPasswordStorageKey);

    if (!savedValues) {
      return;
    }

    try {
      const parsed = JSON.parse(savedValues) as {
        password?: string;
        confirmPassword?: string;
      };

      if (passwordInputRef.current && parsed.password) {
        passwordInputRef.current.value = parsed.password;
      }

      if (confirmPasswordInputRef.current && parsed.confirmPassword) {
        confirmPasswordInputRef.current.value = parsed.confirmPassword;
      }
    } catch {
      window.sessionStorage.removeItem(signupPasswordStorageKey);
    }
  }, [props.mode, props.preservePasswordsOnError]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (props.mode !== "signup") {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    window.sessionStorage.setItem(
      signupPasswordStorageKey,
      JSON.stringify({
        password: typeof password === "string" ? password : "",
        confirmPassword: typeof confirmPassword === "string" ? confirmPassword : "",
      }),
    );
  }

  return (
    <form action={action} className="space-y-4" onSubmit={handleSubmit}>
      <input type="hidden" name="callbackUrl" value={props.callbackUrl} />

      {props.errorMessage ? <div className="ui-alert">{props.errorMessage}</div> : null}

      {props.mode === "signup" ? (
        <label className="block">
          <span className="ui-field-label">이름</span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={props.initialValues.name}
            className="ui-field-control"
            placeholder="이름을 입력하세요."
          />
        </label>
      ) : null}

      <label className="block">
        <span className="ui-field-label">이메일</span>
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={props.initialValues.email}
          className="ui-field-control"
          placeholder="name@example.com"
        />
      </label>

      <label className="block">
        <span className="ui-field-label">비밀번호</span>
        <input
          required
          name="password"
          type="password"
          autoComplete={props.mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          className="ui-field-control"
          placeholder="영문+숫자 포함 8자 이상이어야 합니다."
          ref={passwordInputRef}
        />
      </label>

      {props.mode === "signup" ? (
        <>
          <label className="block">
            <span className="ui-field-label">비밀번호 확인</span>
            <input
              required
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className="ui-field-control"
              placeholder="비밀번호를 한번 더 입력해주세요."
              ref={confirmPasswordInputRef}
            />
          </label>
        </>
      ) : null}

      <button type="submit" className="ui-submit-button">
        {props.mode === "login" ? "로그인" : "계정 만들기"}
      </button>
    </form>
  );
}
