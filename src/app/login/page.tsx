"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSession, login } from "@/lib/local-data";
import { useToast } from "@/hooks/use-toast";
import { CircleDollarSign } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ADMIN_PASSCODE = "1234";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [passcode, setPasscode] = useState("");

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (getSession().isAuthed) {
      router.replace('/dashboard');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      login();
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Code incorrect",
        description: "Le code administrateur est incorrect.",
      });
      setPasscode("");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
         <Link href="/" className="flex items-center gap-2 justify-center mb-6">
          <CircleDollarSign className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">BemPay</span>
        </Link>
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Accès Admin</CardTitle>
            <CardDescription>
              Entrez le code pour accéder au tableau de bord.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passcode">Code admin</Label>
                <Input
                  id="passcode"
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••"
                />
              </div>
              <Button type="submit" className="w-full !mt-6">
                Se connecter
              </Button>
            </CardContent>
          </form>
        </Card>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Retour à la{" "}
          <Link href="/" className="underline hover:text-primary font-medium">
            page d'accueil
          </Link>
          .
        </p>
      </div>
    </div>
  );
}