import LoginForm from "@/features/auth/LoginForm";
import RegisterForm from "@/features/auth/RegisterForm";

export default function AuthPage({ isLogin }) {
  return (
    <div className="">
      {isLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}
