import axios from 'axios'
import qs from 'qs'
import 'dotenv/config'
const { REST_URL } = process.env
export const createReservation = async (_, { payload }, context) => {
	const { data: reservationRes } = await axios.post(`${REST_URL}/reservations`, payload.reservation, {
		headers: {
			Authorization: context.authorization
		}
	})
	const { data: logRes } = await axios.post(`${REST_URL}/logs`, {
		reservation: reservationRes.id,
		...payload.log,
	}, {
		headers: {
			Authorization: context.authorization
		}
	})
	return {
		id: reservationRes.id,
		status: reservationRes.status,
		adult: reservationRes.adult,
		children: reservationRes.children,
		expectTime: reservationRes.expectTime,
		logs: [{
			id: logRes.id,
			action: logRes.action,
			createdAt: logRes.createdAt
		}]
	}
}
export const updateReservation = async (_, { id, payload }, context) => {
	const { data: reservationRes } = await axios.put(`${REST_URL}/reservations/${id}`, payload.reservation, {
		headers: {
			Authorization: context.authorization
		}
	})
	const { data: logListRes } = await axios.get(`${REST_URL}/logs?${qs.stringify({
		reservation: id,
	})}`, {
		headers: {
			Authorization: context.authorization
		}
	})
	const { data: logRes } = await axios.post(`${REST_URL}/logs`, {
		reservation: reservationRes.id,
		...payload.log,
	}, {
		headers: {
			Authorization: context.authorization
		}
	})
	console.log('logRes', logRes)
	const allLogs = [logRes, ...logListRes]
	return {
		id: reservationRes.id,
		status: reservationRes.status,
		adult: reservationRes.adult,
		children: reservationRes.children,
		expectTime: reservationRes.expectTime,
		logs: allLogs.map((item) => {
			return {
				id: item.id,
				action: item.action,
				createdAt: item.createdAt
			}
		})
	}
}
export const findReservations = async (_, { payload }, context) => {
	const { data }= await axios.get(`${REST_URL}/reservations?${qs.stringify(payload)}`, {
		headers: {
			Authorization: context.authorization
		}
	})
	return data.map((item) => {
		return {
			id: item.id,
			status: item.status,
			adult: item.adult,
			children: item.children,
			expectTime: item.expectTime,
		}
	})
}
export const getReservation = async (_, { id }, context) => {
	const { data: reservationRes } = await axios.get(`${REST_URL}/reservations/${id}`, {
		headers: {
			Authorization: context.authorization
		}
	})
	const { data: logRes } = await axios.get(`${REST_URL}/logs?${qs.stringify({
		reservation: id,
	})}`, {
		headers: {
			Authorization: context.authorization
		}
	})
	return {
		id: reservationRes.id,
		status: reservationRes.status,
		adult: reservationRes.adult,
		children: reservationRes.children,
		expectTime: reservationRes.expectTime,
		logs: logRes.map((item) => {
			return {
				id: item.id,
				action: item.action,
				createdAt: item.createdAt
			}
		})
	}
}
