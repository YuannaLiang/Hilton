import dayjs from 'dayjs'
import axios from 'axios'
import store from 'store'
import { useLoaderData } from "@remix-run/react"
import {useEffect, useState} from 'react';
import { useNavigate, useSearchParams } from "react-router-dom"
export async function loader() {
	return process?.env.REST_URL
}
export default function Book () {
	const restBaseUrl = useLoaderData()
	const navigate = useNavigate()
	const currentUserStore = store.get('currentUser')
	const [searchParams] = useSearchParams()


	const [form, setForm] = useState({
		adult: 2,
		children: 0,
		expectTime: dayjs().add(1, 'd').hour(11).minute(30).format('YYYY-MM-DDThh:mm'),
	})

	const [editId] = useState(searchParams.get('id'))

	useEffect(() => {
		if (!currentUserStore) {
			return navigate('/login')
		}
		if (editId) {
			const fetchData = async () => {
				const { data } = await axios.get(`${restBaseUrl}/reservations/${editId}`, {
					headers: {
						Authorization: `Bearer ${currentUserStore.jwt}`
					}
				})
				setForm({
					adult: data.adult,
					children: data.children,
					expectTime: dayjs(data.expectTime).format('YYYY-MM-DDThh:mm'),
				})
			}
			fetchData()
		}
	}, [])

	const handleBook = async () => {
		const formData = {
			...form,
			expectTime: dayjs(form.expectTime).toISOString(),
			guest: currentUserStore.id,
		}
		if (!editId) {
			try {
				await axios.post(`${restBaseUrl}/reservations`, formData, {
					headers: {
						Authorization: `Bearer ${currentUserStore.jwt}`
					}
				})
				navigate('/list')
			} catch(e) {
				console.log('e', e)
			}
		} else {
			try {
				await axios.put(`${restBaseUrl}/reservations/${editId}`, formData, {
					headers: {
						Authorization: `Bearer ${currentUserStore.jwt}`
					}
				})
				navigate('/list')
			} catch(e) {
				console.log('e', e)
			}
		}
	}

	return (
		<div className="p-3">

			<form className="p-6 block max-w-sm bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
				<div className="mb-6">
					<label htmlFor="adult" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Adult</label>
					<input type="number" min={1} id="adult" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.adult} onChange={e => {
						setForm({
							...form,
							adult: e.target.value
						});
					}} required/>
				</div>
				<div className="mb-6">
					<label htmlFor="children" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Children</label>
					<input type="number" id="children" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.children} onChange={e => {
						setForm({
							...form,
							children: e.target.value
						});
					}}   />
				</div>
				<div className="mb-6">
					<label htmlFor="" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expect Time</label>
					<input type="datetime-local" id="children" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.expectTime} onChange={e => {
						setForm({
							...form,
							expectTime: e.target.value
						});
					}}  />
					<div>
					</div>
				</div>
				<div className="text-center">
					<button type="button" className=" bg-yellow-400 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center" onClick={handleBook}>Book</button>
				</div>
			</form>

		</div>
	)
}
