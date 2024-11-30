import { useEffect } from "react";
import useAuth from "@hooks/useAuth.ts";
import useToast from "@hooks/useToast.ts";
import { useLocation, useNavigate } from "react-router-dom";

interface ProtectedRouteLayoutProps {
  children: React.ReactNode;
}

const ProtectedRouteLayout = ({ children }: ProtectedRouteLayoutProps) => {
  const { isLoggedIn } = useAuth();
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요한 서비스입니다.");
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [isLoggedIn]);

  return <>{children}</>;
};

export default ProtectedRouteLayout;
