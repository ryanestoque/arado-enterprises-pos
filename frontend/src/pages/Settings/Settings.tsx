import { SiteHeader } from "@/components/common/SiteHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useSWRMutation from "swr/mutation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import ChangeUsername from "@/components/settings/ChangeUsernameBtn";
import ChangeUsernameBtn from "@/components/settings/ChangeUsernameBtn";
import { useEffect, useState } from "react";
import { useUserById } from "@/hooks/useAPI";
import type { User } from "@/components/users/Columns";
import ChangePasswordBtn from "@/components/settings/ChangePasswordBtn";

async function authPost(url: string, { arg }: { arg: any }) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`, },
    body: JSON.stringify(arg),
  })
  if (!res.ok) throw new Error('Authentication failed.')
  return res.json()
}


export default function Settings() {
  const navigate = useNavigate();
  
  const { user } = useAuth();

  const { data: currentUser } = useUserById(user?.user_id ?? null) 

  const [localUser, setLocalUser] = useState<User | null>(null);

  useEffect(() => {
    if (currentUser) setLocalUser(currentUser);
  }, [currentUser]);

  const { trigger: logoutTrigger } = useSWRMutation("http://localhost:5000/api/auth/logout", authPost)  

  const logout = async () => {
    try {
      await logoutTrigger(); // wait for API
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return(
    <>
      <header className="overflow-hidden">
        <SiteHeader title="Settings"/>
      </header>
      <main className="h-[80vh] flex-1 p-4 md:p-6 flex flex-col gap-4"> 
        <Card>
          <CardHeader>
            <CardTitle>Username</CardTitle>
            <CardDescription>{localUser?.username}</CardDescription>
          </CardHeader>
          <CardContent>
            {localUser && <ChangeUsernameBtn user={localUser} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your current password</CardDescription>
          </CardHeader>
          <CardContent>
            {localUser && <ChangePasswordBtn user={localUser} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Log out</CardTitle>
            <CardDescription>You have to login again afterwards</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"destructive"}>
                  Log out
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

      </main>
    </>
  )
}