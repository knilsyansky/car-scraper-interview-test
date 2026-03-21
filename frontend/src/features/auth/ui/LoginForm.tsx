"use client";

import { useActionState } from "react";
import { loginAction } from "../model/login-action";
import { Button, Input } from "@shared/ui";

export function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <form action={formAction} className="flex flex-col gap-4 max-w-sm mx-auto p-6 border rounded-xl shadow-md">
            <h1 className="text-2xl font-bold text-center">Вход в систему</h1>

            <Input
                label={'Логин'}
                name={'login'}
                placeholder={"Введите логин 'admin'"}
                required
                error={state?.error}
            />

            <Input
                label={'Пароль'}
                name={'password'}
                type={"password"}
                placeholder={"admin123"}
                error={undefined}
                required
            />

            <Button
                type="submit"
                className="w-full"
                isLoading={isPending}
            >
                Войти
            </Button>
        </form>
    );
};