import { Form } from "@remix-run/react"
import axios from 'axios'
import { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useLoaderData } from "@remix-run/react"
import store from 'store'
import { CurrentUserContext } from '../contexts.js'

export async function loader() {
	return process?.env.REST_URL
}
export default function Login() {
	const restBaseUrl = useLoaderData()
	const navigate = useNavigate()
	const {setCurrentUser} = useContext(CurrentUserContext)
	const [form, setForm] = useState({
		identifier: 'Barbara',
		password: '1233456',
		email: '',
		phone: '',
	})
	const [userExist, setUserExist] = useState(true)
	const [isStaff, setIsStaff] = useState(false)

	const login = async () => {
		if (userExist) {
			if (form.identifier && form.password) {
				try {
					const { data } = await axios.post(`${restBaseUrl}/auth/local`, {
						identifier: form.identifier,
						password: form.password
					})
					console.log('data', data)
					const currentUser = {
						jwt: data.jwt,
						id: data.user.id,
						username: data.user.username,
						email: data.user.email,
						phone: data.user.phone,
						type: data.user.type,
					}
					setCurrentUser(currentUser)
					store.set('currentUser', currentUser)
					navigate('/me')
				} catch(e) {
					console.log('e.response', e.response)
					if (e.response.status) {
						setUserExist(false)
					}
				}
			}
		} else {
			if (form.email && form.identifier && form.password && form.phone) {
			  try {
				  const { data } = await axios.post(`${restBaseUrl}/auth/local/register`, {
					  email: form.email,
					  username: form.identifier,
					  password: form.password,
					  phone: form.phone,
					  type: isStaff ? 2 : 1,
				  })
				  console.log('data', data)
				  const currentUser = {
					  jwt: data.jwt,
					  id: data.user.id,
					  username: data.user.username,
					  email: data.user.email,
					  phone: data.user.phone,
					  type: data.user.type,
				  }
				  setCurrentUser(currentUser)
				  store.set('currentUser', currentUser)
				  setUserExist(true)
				  navigate('/me')
			  } catch(e) {
				  console.log('e.response', e.response)
			  }
			}
		}
	}
	return (
		<div className="p-3">
			<div id="loginForm" className="p-6 block w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
				<Form>
					<div className="mb-6">
						<label htmlFor="identifier" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
						<input type="text" id="identifier" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" value={form.identifier} onChange={e => {
							setForm({
								...form,
								identifier: e.target.value
							});
						}} required/>
					</div>
					<div className="mb-6">
						<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
						<input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.password} onChange={e => {
							setForm({
								...form,
								password: e.target.value
							});
						}} required/>
					</div>
					<div className={ userExist ? 'hidden' : 'mb-6'}>
						<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
						<input type="email" id="email" name="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@hilton.com" value={form.email} onChange={e => {
							setForm({
								...form,
								email: e.target.value
							});
						}} required/>
					</div>
					<div className={ userExist ? 'hidden' : 'mb-6'}>
						<label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Phone</label>
						<input type="text" id="phone" name="phone" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={form.phone} onChange={e => {
							setForm({
								...form,
								phone: e.target.value
							});
						}} required/>
					</div>
					<div className={`flex items-start mb-6 ${userExist ? 'hidden' : 'mb-6'}`}>
						<div className="flex items-center h-5">
							<input id="remember" type="checkbox" value={isStaff} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" onChange={e => {
								setIsStaff(!isStaff);
							}} required/>
						</div>
						<label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">I'm a staff</label>
					</div>
					<button onClick={login} type="submit" className=" bg-yellow-400 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center">Next</button>
				</Form>
			</div>
		</div>

	)
}
