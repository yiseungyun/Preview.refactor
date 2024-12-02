import useAuth from "@hooks/useAuth.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@hooks/useToast.ts";
import axios, { isAxiosError } from "axios";

interface UseValidateProps {
  setIsSignUp: (isSignUp: boolean) => void;
}

const useValidate = ({ setIsSignUp }: UseValidateProps) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [errors, setErrors] = useState<string[]>();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", {
        userId: username,
        password: password,
      });

      const { success = false } = response.data;

      if (success) {
        toast.success("로그인에 성공했습니다.");
        auth.logIn();
        auth.setNickname(nickname);
        navigate("/");
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const { response } = err;
        if (response?.status === 401) {
          toast.error("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else {
          toast.error("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else console.error("로그인 도중 에러", err);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const errorArray: string[] = [];

    // 아이디 검증
    if (!username) {
      errorArray.push("아이디는 필수입니다.");
    } else {
      if (username.length < 4) {
        errorArray.push("아이디는 최소 4글자 이상이어야 합니다.");
      }
      if (username.length > 20) {
        errorArray.push("아이디는 20글자 이하여야 합니다.");
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errorArray.push(
          "아이디는 영문자, 숫자, 언더스코어(_)만 사용할 수 있습니다."
        );
      }
    }

    // 비밀번호 검증
    if (!password) {
      errorArray.push("비밀번호는 필수입니다.");
    } else {
      if (password.length < 7) {
        errorArray.push("비밀번호는 최소 7글자 이상이어야 합니다.");
      }
      if (password.length > 20) {
        errorArray.push("비밀번호는 20글자 이하여야 합니다.");
      }
      if (!/[a-z]/.test(password)) {
        errorArray.push("비밀번호는 최소 1개의 소문자를 포함해야 합니다.");
      }
      if (!/[0-9]/.test(password)) {
        errorArray.push("비밀번호는 최소 1개의 숫자를 포함해야 합니다.");
      }
      if (password.includes(username)) {
        errorArray.push("비밀번호에 아이디을 포함할 수 없습니다.");
      }
    }

    // 비밀번호 확인 검증
    if (!passwordCheck) {
      errorArray.push("비밀번호 확인은 필수입니다.");
    } else {
      if (password !== passwordCheck) {
        errorArray.push("비밀번호가 일치하지 않습니다.");
      }
    }

    // 닉네임 검증
    if (!nickname) {
      errorArray.push("닉네임은 필수입니다.");
    } else {
      if (nickname.length < 2) {
        errorArray.push("닉네임은 최소 2글자 이상이어야 합니다.");
      }
      if (nickname.length > 10) {
        errorArray.push("닉네임은 10글자 이하여야 합니다.");
      }
    }

    return {
      isValid: errorArray.length === 0,
      errorArray: errorArray,
    };
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      const { isValid, errorArray } = validate();
      setErrors(errorArray);

      if (isValid) {
        const response = await axios.post("/api/user/signup", {
          id: username,
          password: password,
          nickname: nickname,
        });

        if (response.data.status) {
          toast.success("회원가입에 성공했습니다. 로그인해주세요.");
          setIsSignUp(false);
        } else {
          const { code } = response.data;
          switch (code) {
            case "DUPLICATE_NICKNAME":
              toast.error("이미 존재하는 닉네임입니다.");
              break;
            case "DUPLICATE_ID":
              toast.error("이미 존재하는 아이디입니다.");
              break;
            default:
              toast.error(
                "회원가입에 실패했습니다. 잠시 후 다시 시도해주세요."
              );
              break;
          }
        }
      }
    } catch (err) {
      console.error("회원가입 도중 에러", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    setUsername,
    setPassword,
    setPasswordCheck,
    setNickname,
    loading,
    handleLogin,
    handleSignUp,
    errors,
  };
};

export default useValidate;
