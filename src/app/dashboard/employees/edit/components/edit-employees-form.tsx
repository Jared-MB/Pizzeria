"use client";

import { insertClient } from "@/actions/client";
import { insertEmployee, updateEmployee } from "@/actions/employee";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardBody,
	CardDescription,
	CardFooter,
	CardHeader,
	CardSubtitle,
	CardTitle,
} from "@/components/ui/card";
import Divider from "@/components/ui/divider";
import { Input, InputContainer, InputError } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Employee } from "@/db/schemas";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

export default function EditEmployeeForm({
	employee,
}: { employee: Omit<Employee, "password"> }) {
	const [errors, dispatch] = useFormState(updateEmployee, undefined);

	return (
		<form action={dispatch} className="flex flex-col gap-y-4">
			<CardHeader className="p-0">
				<CardTitle>Agregar empleado</CardTitle>
				<CardDescription>
					Completa los campos para agregar un nuevo cliente. Los campos marcados
					con * son obligatorios
				</CardDescription>
			</CardHeader>
			<Card>
				<CardBody>
					<CardSubtitle>Información básica</CardSubtitle>
					<div className="flex flex-col gap-y-4 mt-4">
						<input
							hidden
							aria-hidden
							readOnly
							name="_id"
							value={employee._id}
						/>
						<InputContainer>
							<Label>Nombre *</Label>
							<Input
								name="name"
								placeholder="Adrian L."
								defaultValue={employee.name}
							/>
							{errors?.name && <InputError>{errors.name[0]}</InputError>}
						</InputContainer>
						<InputContainer>
							<Label>Usuario</Label>
							<Input
								name="username"
								placeholder="lino"
								defaultValue={employee.username}
							/>
							{errors?.username && (
								<InputError>{errors.username[0]}</InputError>
							)}
						</InputContainer>
						{/* <InputContainer>
							<Label>Contraseña</Label>
							<Input
								name="password"
								type="password"
								placeholder="* * * * * * * *"
							/>
							{errors?.password && (
								<InputError>{errors.password[0]}</InputError>
							)}
						</InputContainer>
						<InputContainer>
							<Label>Confirmar contraseña</Label>
							<Input
								name="confirmPassword"
								type="password"
								placeholder="* * * * * * * *"
							/>
							{errors?.confirmPassword && (
								<InputError>{errors.confirmPassword[0]}</InputError>
							)}
						</InputContainer> */}
						<InputContainer>
							<Label>Rol</Label>
							<RadioGroup defaultValue={employee.role} name="role">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="USER" id="USER" />
									<Label htmlFor="USER">Usuario</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="ADMIN" id="ADMIN" />
									<Label htmlFor="ADMIN">Admin</Label>
								</div>
							</RadioGroup>
							{errors?.role && <InputError>{errors.role[0]}</InputError>}
						</InputContainer>
					</div>
				</CardBody>
				<Divider />
				<CardFooter className="justify-end gap-x-4">
					<Link
						className={buttonVariants({
							variant: "outline",
						})}
						href="/dashboard/employees"
					>
						Cancelar
					</Link>
					<SubmitButton />
				</CardFooter>
			</Card>
			{/* {errors?.error && <InputError>{errors.error}</InputError>} */}
		</form>
	);
}

const SubmitButton = () => {
	const { pending } = useFormStatus();

	return (
		<Button type="submit" disabled={pending}>
			{pending ? "Cargando..." : "Agregar cliente"}
		</Button>
	);
};
