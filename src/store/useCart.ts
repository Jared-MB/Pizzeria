import type { Client, paymentMethodEnum, typeEnum } from "@/db/schemas";
import type { Product } from "@/types/cart";
import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useCart = create(
	combine(
		{
			cart: [] as Product[],
			client: null as Client | null,
			paymentMethod: "CASH" as (typeof paymentMethodEnum.enumValues)[number],
			type: "LOCAL" as (typeof typeEnum.enumValues)[number],
		},
		(set) => ({
			addProduct: (product: Product) => {
				set((state) => {
					const productIndex = state.cart.findIndex(
						(prdct) => prdct._id === product._id,
					);
					if (productIndex !== -1) {
						state.cart[productIndex].quantity += product.quantity;
						return { cart: [...state.cart] };
					}
					return { cart: [...state.cart, product] };
				});
			},
			removeProduct: (productId: string) => {
				set((state) => {
					const product = state.cart.find((prdct) => prdct._id === productId);
					if (!product) return { cart: state.cart };
					if (product.quantity === 1) {
						return {
							cart: state.cart.filter((prdct) => prdct._id !== productId),
						};
					}
					const productIndex = state.cart.findIndex(
						(prdct) => prdct._id === productId,
					);
					state.cart[productIndex].quantity -= 1;
					return { cart: [...state.cart] };
				});
			},
			setClient: (client: Client) => {
				set({ client });
			},
			setPaymentMethod: (
				paymentMethod: (typeof paymentMethodEnum.enumValues)[number],
			) => {
				set({ paymentMethod });
			},
			setType: (type: (typeof typeEnum.enumValues)[number]) => {
				set({ type });
			},
			clearAll: () => {
				set({ cart: [], client: null, paymentMethod: "CASH", type: "LOCAL" });
			},
		}),
	),
);
