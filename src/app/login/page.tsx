"use client";
import { authenticate } from "@/actions/authenticate";
import { Button } from "@/components/ui/button";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import React from "react";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
	const [errorMessage, dispatch] = useFormState(authenticate, undefined);

	return (
		<main className="grid grid-cols-2 h-dvh">
			<aside className="bg-purple-500 dark:bg-purple-500/70 rounded-r-lg grid place-content-center">
				<Image
					src="./login.svg"
					alt="Login"
					width={500}
					height={500}
					className="aspect-[500/347]"
				/>
			</aside>
			<form action={dispatch} className="grid place-content-center">
				<div className="flex flex-col gap-y-4">
					<h2 className="font-medium text-3xl mb-4">¡Bienvenido de vuelta!</h2>
					<InputContainer>
						<Label>Usuario</Label>
						<Input name="username" type="text" placeholder="usuario" />
					</InputContainer>
					<InputContainer>
						<Label>Contraseña</Label>
						<Input
							name="password"
							type="password"
							placeholder="* * * * * * * * *"
						/>
					</InputContainer>
					<LoginButton />
					{errorMessage && (
						<>
							<p className="text-sm text-rose-500">{errorMessage}</p>
						</>
					)}
				</div>
			</form>
		</main>
	);
}

const LoginButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Cargando..." : "Iniciar sesión"}
		</Button>
	);
};
