"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  getSignUpDefaultValues,
  signUpSchema,
  TSignUpSchema,
} from "@/schema/sign-up";
import SignUpForm from "@/components/custom/forms/sign-up";
import { signUp } from "@/lib/auth.client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const form = useForm<TSignUpSchema>({
    defaultValues: getSignUpDefaultValues(),
    resolver: zodResolver(signUpSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: TSignUpSchema) => {
    await signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess(context) {
          toast.success("User Created Successfully");
          router.push("/");
        },
        onError(context) {
          toast.error(context.error.message);
        },
      }
    );
  };

  return (
    <Card className="md:w-lg w-full mx-auto">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <SignUpForm form={form} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-sm">
          Already an user.&nbsp;
          <u className="text-primary">
            <Link href={"/auth/sign-in"}>Sign In</Link>
          </u>
        </p>
      </CardFooter>
    </Card>
  );
}
