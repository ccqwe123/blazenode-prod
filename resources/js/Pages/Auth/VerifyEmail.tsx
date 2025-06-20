import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/button";
import { useToast } from '@/hooks/use-toast';

export default function VerifyEmail() {
  const [resent, setResent] = useState(false);
  const { toast } = useToast();

  const { post, processing } = useForm();

  const resend = () => {
    post(route("verification.send"), {
      preserveScroll: true,
      onSuccess: () => {
        setResent(true);
        toast({
          title: "Verification email resent!",
          description: "Please check your inbox.",
        });
      },
    });
  };

  return (
    <>
      <Head title="Verify Email" />
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Verify Your Email</h1>
        <p className="mb-6 max-w-md">
          Thanks for signing up! Before getting started, please verify your
          email address by clicking the link we just emailed to you. If you
          didn’t receive the email, we’ll gladly send you another.
        </p>

        <Button onClick={resend} disabled={processing}>
          Resend Verification Email
        </Button>

        {resent && (
          <p className="text-sm text-green-500 mt-4">
            A new verification link has been sent to your email.
          </p>
        )}
      </div>
    </>
  );
}
