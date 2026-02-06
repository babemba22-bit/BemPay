"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCreator, getSession, logout } from "@/lib/local-data";
import type { Creator } from "@/lib/types";
import { CircleDollarSign, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    setCreator(getCreator());
    setIsAuthed(getSession().isAuthed);

    const handleStorageChange = () => {
       setCreator(getCreator());
       setIsAuthed(getSession().isAuthed);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };
  
  if (!isAuthed || !creator) {
    return (
     <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
       <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
         <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <CircleDollarSign className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">BemPay</span>
        </Link>
       </nav>
        <Button asChild>
            <Link href="/login">Connexion</Link>
        </Button>
     </header>
    )
  }

  const userInitials = creator.display_name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
      <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 w-full">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <CircleDollarSign className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">BemPay</span>
        </Link>
      </nav>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${creator.creator_id}`}
                  alt={creator.display_name}
                />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
