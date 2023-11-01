import axios from 'axios'
import qs from 'qs'
import 'dotenv/config'
const { REST_URL } = process.env
export const register = async (_, { payload }) => {
	const { data } = await axios.post(`${REST_URL}/auth/local/register`, payload)
	return {
		jwt: data.jwt,
		id: data.user._id,
		username: data.user.username,
		phone: data.user.phone,
		type: data.user.type,
	}
}
export const login = async (_, { payload }) => {
	const { data } = await axios.post(`${REST_URL}/auth/local`, payload)
	return {
		jwt: data.jwt,
		id: data.user._id,
		username: data.user.username,
		phone: data.user.phone,
		type: data.user.type,
	}
}
