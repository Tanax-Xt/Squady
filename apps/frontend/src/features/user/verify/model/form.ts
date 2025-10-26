import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useOTP } from "@/entities/auth";

import { UserVerifyFormSchema } from "./schema";
import { UserVerifyFormFieldValues } from "./types";
import { revalidateCurrentUser, verifyCurrentUser } from "../api/actions";

export type UseUserVerifyFormProps = {
  defaultValues?: UserVerifyFormFieldValues;
};

export const useUserVerifyForm = ({
  defaultValues = { otp: "" },
}: UseUserVerifyFormProps) => {
  const router = useRouter();

  const [accepted, setAccepted] = useState<boolean | null>(null);

  const [otp, resend, sending, remaining] = useOTP({
    onSent: () => {
      toast.info("Код подтверждения отправлен!");
    },
  });

  const form = useForm({
    mode: "onChange",
    resolver: zodResolver(UserVerifyFormSchema),
    defaultValues,
  });

  const otpValue = form.watch("otp");
  const otpValueAsNumber = Number(otpValue);

  const [response, dispatch, pending] = useActionState(
    verifyCurrentUser.bind(null, { otp: otpValueAsNumber }),
    undefined,
  );

  const submit = form.handleSubmit(() => startTransition(dispatch));

  useEffect(() => {
    if (otp) {
      form.setFocus("otp", { shouldSelect: true });
    }
  }, [otp]);

  useEffect(() => {
    switch (response?.status) {
      case 406:
        return handleNotAcceptable();
      case 202:
        return handleAccepted();
    }
  }, [response]);

  const handleNotAcceptable = () => {
    setAccepted(false);

    toast.error("Неверный или просроченный код подтверждения!");

    const resetTimeout = window.setTimeout(() => {
      form.setFocus("otp");
      form.resetField("otp");
      setAccepted(null);
    }, 750);

    return () => {
      setAccepted(null);
      window.clearTimeout(resetTimeout);
    };
  };

  const handleAccepted = () => {
    setAccepted(true);

    toast.success("Электронная почта успешно подтверждена!");

    const redirectTimeout = window.setTimeout(() => {
      revalidateCurrentUser();
      router.push("/settings/role");
    }, 1000);

    return () => {
      setAccepted(null);
      window.clearTimeout(redirectTimeout);
    };
  };

  return {
    otp,
    form,
    submit,
    pending,
    resend,
    sending,
    remaining,
    accepted,
  } as const;
};
