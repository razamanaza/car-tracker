import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <section className="grid min-h-svh place-content-center">
      <Card className="w-52">
        <CardHeader>Sign in</CardHeader>
        <CardContent>
          <Button>Google Sign In</Button>
        </CardContent>
      </Card>
    </section>
  );
}
