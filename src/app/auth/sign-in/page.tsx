import { redirect } from "next/navigation";
import SignInPage from "./signin";

export default function SignIn() {
  const isAuthentificated = false;
  if (isAuthentificated) {
    redirect("/dashboard");
  }
  return <SignInPage />;
}
