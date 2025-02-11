import { useEffect } from "react";
import { redirect, useSearchParams } from "react-router";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  useEffect(() => {
    const sendAuthCode = async () => {
      if (code) {
        try {
          const response = await fetch(
            "https://3.84.119.226:8080/api/auth/callback",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log(data);
            redirect("/");
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("no code!");
        alert("잘못된 접근");
        redirect("/");
      }
    };

    sendAuthCode();
  }, [code]);

  return <h1>Login</h1>;
}
