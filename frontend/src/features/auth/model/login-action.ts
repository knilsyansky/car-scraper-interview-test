"use server";
import { host } from "@shared/api";
import { TOKEN_PROVIDER } from "@shared/lib";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(prevState: unknown, formData: FormData) {
	const login = formData.get("login");
	const password = formData.get("password");

	const res = await fetch(`${host}/auth/login`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ login, password }),
	});

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return { error: `Ошибка сервера: ${res.status}` };
    }

	const data = await res.json();

	if (!res.ok) {
		return {
			error: data.message || "Ошибка авторизации",
			fields: { login },
		};
	}

	const cookieStore = await cookies();

	cookieStore.set(TOKEN_PROVIDER, data.token, {
		path: "/",
		maxAge: 86400, // 24 часа
		httpOnly: false, // Чтобы клиентский JS (твой apiFetch) тоже мог прочитать, если надо
		secure: process.env.NODE_ENV === "production",
	});

	redirect("/");
}
