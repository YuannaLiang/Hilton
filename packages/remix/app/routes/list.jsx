import {useEffect, useState} from 'react';
import axios from 'axios'
import { useLoaderData } from "@remix-run/react"
import dayjs from 'dayjs'
import {
	Link
} from "@remix-run/react";
import { useNavigate } from "react-router-dom"
import qs from 'qs'
import store from 'store'
export async function loader() {
	return process?.env.REST_URL
}
export default function List () {
	const restBaseUrl = useLoaderData()
	const currentUserStore = store.get('currentUser')
	const [reservations, setReservations] = useState(null)
	const [dropMenuShow, setDropMenuShow] = useState(null)
	const navigate = useNavigate()
	const cardColor = ['border-gray-200', 'border-yellow-300', 'border-green-300', 'border-green-500']
	const statusText = ['Canceled', 'Booked', 'Confirmed', 'Completed']
	const handleDropMenu = (index) => {
		setDropMenuShow(index)
	}
	useEffect(() => {
		if (!currentUserStore) {
			return navigate('/login')
		}
		const fetchData = async () => {
			let query = {
				_sort: 'updatedAt:DESC',
				_limit: 100
			}
			if (currentUserStore.type === 1) {
				query = {
					...query,
					guest: currentUserStore.id
				}
			}
			const { data } = await axios.get(`${restBaseUrl}/reservations?${qs.stringify(query)}`, {
				headers: {
					Authorization: `Bearer ${currentUserStore.jwt}`
				}
			})
			setReservations(data)
		}
		fetchData().catch((e) => {
			console.log('e', e)
		})
	}, [])
	const handleEdit = (id) => {
		setDropMenuShow(false)
		navigate(`/book?id=${id}`)
	}
	const handleStatus = async (id, targetStatus) => {
		const { data } = await axios.put(`${restBaseUrl}/reservations/${id}`, {
			status: targetStatus
		}, {
			headers: {
				Authorization: `Bearer ${currentUserStore.jwt}`
			}
		})
		await axios.post(`${restBaseUrl}/logs`, {
			action: `${currentUserStore.username} updated the status to ${statusText[targetStatus]}`,
			reservation: id,
		}, {
			headers: {
				Authorization: `Bearer ${currentUserStore.jwt}`
			}
		})
		const newReservations  = reservations.map((item) => {
			if (item.id === id) {
				item = data
			}
			return item
		})
		setReservations(newReservations)
		setDropMenuShow(false)
	}
	if (!reservations?.length) {
		return (
			<div className="p-3">
				<div className="w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
					<div className="flex flex-col items-center pb-10 pt-6">
						<h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">You have no reservations.</h5>
						<div className="flex mt-4 space-x-3 md:mt-6">
							<Link to={'/book'}>
								<span className="inline-flex bg-yellow-400 items-center px-4 py-2 text-sm font-medium text-center text-gray-900 rounded-lg">Book</span>
							</Link>
						</div>
					</div>
				</div>
			</div>
			)
	} else {
		return (
			<div className="p-3">
				{
					reservations?.map((item, index) => {
						return (
							<div key={index} className={`mb-3 bg-white relative block w-full border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ${cardColor[item.status]}`}>
								<div className={`absolute right-0 top-0 flex justify-end px-4 pt-2 ${item.status !== 0 && item.status !== 3 ? '' : 'hidden'}`}>
									<button id="dropdownButton" data-dropdown-toggle="dropdown" className={`inline-block text-gray-500 dark:text-gray-400 rounded-lg text-sm p-1.5 ${dropMenuShow !== index ? '' : 'hidden'}`} type="button"
									        onClick={() => {
										        handleDropMenu(index)
									        }}
									>
										<span>...</span>
									</button>
									<div id="dropdown" className={`z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${dropMenuShow === index ? '' : 'hidden'}`} >
										<ul className="py-2" aria-labelledby="dropdownButton">
											<li className={item.status === 1 ? '' : 'hidden'}>
											<span onClick={() => {
												handleEdit(item.id)
											}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</span>
											</li>
											<li className={item.status !== 0 && item.status !== 3 && currentUserStore.type === 2 ? '' : 'hidden'}>
											<span onClick={() => {
												handleStatus(item.id, item.status === 1 ? 2 : 3)
											}} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">{item.status === 1 ? 'Confirm' : 'Complete'}</span>
											</li>
											<li className={item.status === 1 || item.status === 2 ? '' : 'hidden'}>
											<span onClick={() => {
												handleStatus(item.id, 0)
											}} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Cancel</span>
											</li>
										</ul>
									</div>
								</div>
								<div className="p-6" onClick={() => {
									setDropMenuShow(null)
								}}>
									<h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
										<span className="mr-2">{dayjs(item.expectTime).format('YYYY-MM-DD HH:mm')}</span>
										<span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{statusText[item.status]}</span>
									</h5>
									<p className="font-normal text-gray-700 dark:text-gray-400">
										Adult: {item.adult}
									</p>
									<div className={item.children > 0 ? '' : 'hidden'}>
										<p className="font-normal text-gray-700 dark:text-gray-400">
											Children: {item.children}
										</p>
									</div>
									<div className={item.guest ?? 'hidden'}>
										<p className="font-normal text-gray-700 dark:text-gray-400">
											Name: {item.guest?.username}
										</p>
										<p className="font-normal text-gray-700 dark:text-gray-400">
											Phone: {item.guest?.phone}
										</p>
										<p className="font-normal text-gray-700 dark:text-gray-400">
											Email: {item.guest?.email}
										</p>
									</div>
									<p className="font-normal text-gray-700 dark:text-gray-400">
										Created at: {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm')}
									</p>
								</div>
							</div>
						)
					})
				}

			</div>
		)
	}
}
