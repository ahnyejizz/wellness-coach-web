import {
  loginWithCredentials,
  signupWithCredentials,
} from "@/app/auth-actions";
import {
  wellnessFocusOptions,
  type WellnessFocus,
} from "@/lib/auth/user-store";

type LoginValues = {
  email: string;
};

type SignupValues = {
  name: string;
  email: string;
  focus: WellnessFocus;
};

type AuthCredentialsFormProps =
  | {
      mode: "login";
      callbackUrl: string;
      errorMessage: string;
      initialValues: LoginValues;
    }
  | {
      mode: "signup";
      callbackUrl: string;
      errorMessage: string;
      initialValues: SignupValues;
    };

const fieldClassName =
  "mt-2 w-full rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-shadow duration-200 placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--accent-soft)]";

export default function AuthCredentialsForm(
  props: AuthCredentialsFormProps,
) {
  const action =
    props.mode === "login" ? loginWithCredentials : signupWithCredentials;

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={props.callbackUrl} />

      {props.errorMessage ? (
        <div className="rounded-[1.3rem] border border-[rgba(220,95,62,0.22)] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--foreground)]">
          {props.errorMessage}
        </div>
      ) : null}

      {props.mode === "signup" ? (
        <label className="block">
          <span className="text-sm font-medium text-[var(--foreground)]">
            이름
          </span>
          <input
            required
            name="name"
            type="text"
            autoComplete="name"
            defaultValue={props.initialValues.name}
            className={fieldClassName}
            placeholder="이름을 입력하세요."
          />
        </label>
      ) : null}

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">
          이메일
        </span>
        <input
          required
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={props.initialValues.email}
          className={fieldClassName}
          placeholder="name@example.com"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-[var(--foreground)]">
          비밀번호
        </span>
        <input
          required
          name="password"
          type="password"
          autoComplete={props.mode === "login" ? "current-password" : "new-password"}
          minLength={8}
          className={fieldClassName}
          placeholder="영문+숫자 포함 8자 이상이어야 합니다."
        />
      </label>

      {props.mode === "signup" ? (
        <>
          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">
              비밀번호 확인
            </span>
            <input
              required
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              className={fieldClassName}
              placeholder="비밀번호를 한번 더 입력해주세요."
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-[var(--foreground)]">
              우선 코칭
            </span>
            <select
              name="focus"
              defaultValue={props.initialValues.focus}
              className={fieldClassName}
            >
              {wellnessFocusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}

      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-[1.3rem] bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[#fffaf2] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {props.mode === "login" ? "로그인" : "계정 만들고 온보딩 시작하기"}
      </button>
    </form>
  );
}
