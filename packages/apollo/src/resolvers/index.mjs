import { register, login} from "./user/index.mjs";
import {createReservation, findReservations, getReservation, updateReservation} from "./reservation/index.mjs";
export const resolvers = {
	Query: {
		findReservations,
		getReservation,
	},
	Mutation: {
		register,
		login,
		createReservation,
		updateReservation,
	}
};
