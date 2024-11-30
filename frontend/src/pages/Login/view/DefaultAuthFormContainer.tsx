import useToast from "@hooks/useToast.ts";
import { useState } from "react";
import { api } from "@/api/config/axios.ts";
import LoadingIndicator from "@components/common/LoadingIndicator.tsx";
import { useNavigate } from "react-router-dom";
import useAuth from "@hooks/useAuth.ts";

interface DefaultAuthFormContainerProps {
  isSignUp: boolean;
  setIsSignUp: (isSignUp: boolean) => void;
}

const DefaultAuthFormContainer = ({
  isSignUp,
  setIsSignUp,
}: DefaultAuthFormContainerProps) => {
  const toast = useToast();
  const navigate = useNavigate();
  const auth = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await api.post("/api/auth/login", {
        userId: username,
        password: password,
      });

      if (response.data.success) {
        toast.success("로그인에 성공했습니다.");
        auth.logIn();
        auth.setNickname(nickname);
        navigate("/");
      } else {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요");
      }
    } catch (err) {
      console.error("로그인 도중 에러", err);
    }
  };

  const validate = () => {
    const errors: string[] = [];

    // 사용자 이름 검증
    if (!username) {
      errors.push("사용자 이름은 필수입니다.");
    } else {
      if (username.length < 4) {
        errors.push("사용자 이름은 최소 4글자 이상이어야 합니다.");
      }
      if (username.length > 20) {
        errors.push("사용자 이름은 20글자 이하여야 합니다.");
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push(
          "사용자 이름은 영문자, 숫자, 언더스코어(_)만 사용할 수 있습니다."
        );
      }
    }

    // 비밀번호 검증
    if (!password) {
      errors.push("비밀번호는 필수입니다.");
    } else {
      if (password.length < 7) {
        errors.push("비밀번호는 최소 7글자 이상이어야 합니다.");
      }
      if (password.length > 20) {
        errors.push("비밀번호는 20글자 이하여야 합니다.");
      }
      if (!/[a-z]/.test(password)) {
        errors.push("비밀번호는 최소 1개의 소문자를 포함해야 합니다.");
      }
      if (!/[0-9]/.test(password)) {
        errors.push("비밀번호는 최소 1개의 숫자를 포함해야 합니다.");
      }
      if (password.includes(username)) {
        errors.push("비밀번호에 사용자 이름을 포함할 수 없습니다.");
      }
    }

    // 비밀번호 확인 검증
    if (!passwordCheck) {
      errors.push("비밀번호 확인은 필수입니다.");
    } else {
      if (password !== passwordCheck) {
        errors.push("비밀번호가 일치하지 않습니다.");
      }
    }

    // 닉네임 검증
    if (!nickname) {
      errors.push("닉네임은 필수입니다.");
    } else {
      if (nickname.length < 2) {
        errors.push("닉네임은 최소 2글자 이상이어야 합니다.");
      }
      if (nickname.length > 10) {
        errors.push("닉네임은 10글자 이하여야 합니다.");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { isValid, errors } = validate();

      if (errors.length > 0) {
        errors.forEach((error) => {
          toast.error(error);
        });
        return;
      }

      if (isValid) {
        const response = await api.post("/api/user/signup", {
          id: username,
          password: password,
          nickname: nickname,
        });

        if (response.data.success) {
          toast.success("회원가입에 성공했습니다. 로그인해주세요.");
          setIsSignUp(false);
        } else {
          toast.error("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      }
    } catch (err) {
      console.error("회원가입 도중 에러", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDefaultLogin = (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      if (isSignUp) {
        handleSignUp();
      } else {
        handleLogin();
      }
    } catch (err) {
      console.error("로그인 도중 에러", err);
    }
  };

  return (
    <>
      <div>
        <input
          type="email"
          id="email"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="이메일을 입력하세요"
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          id="password"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="비밀번호를 입력하세요"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isSignUp && (
        <>
          <div>
            <input
              type="password"
              id="passwordCheck"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="비밀번호를 한번 더 입력하세요"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
          <div>
            <input
              type="text"
              id="nickname"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="닉네임을 입력하세요"
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </>
      )}

      <button
        onClick={(e) => handleDefaultLogin(e)}
        className="w-full bg-green-200 text-white py-3 rounded-md hover:bg-green-100 transition-colors font-medium text-lg shadow-16"
      >
        {!isSignUp ? "로그인" : "회원가입"}
      </button>

      <div className="flex items-center justify-between text-base text-gray-600">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          {loading ? (
            <LoadingIndicator loadingState={loading} type={"spinner"} />
          ) : isSignUp ? (
            "로그인"
          ) : (
            "회원가입"
          )}
        </button>
        <button
          type="button"
          className="hover:text-green-300 transition-colors"
        >
          비밀번호 찾기
        </button>
      </div>
    </>
  );
};

export default DefaultAuthFormContainer;
