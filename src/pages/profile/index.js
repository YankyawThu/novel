import React,{useEffect} from 'react'
import Head from 'next/head'
import Layout from '@/layouts/Layout'
import ProfileComponent from "@/components/Profile/index"
import Api from "@/services/api";
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import helper from '@/utils/helper'
import { signOut } from "next-auth/react"

export async function getServerSideProps(context) {
	const session = await getServerSession(context.req, context.res, authOptions)

	if(!session){
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		}
	}

	try {
		const result = await Api.puller( session.accessToken,'/user/profile', {c:9});
		const res = JSON.parse(helper.decrypt(result.data.data))
		const user = res

		return {
			props: {
				isAuthenticated: true,
				user,
				messages: {
				...require(`../../lang/${context.locale}.json`)
				},
			},
		};

	}  catch (error) {
		if(error?.response?.data?.status === 40101){

			return {
				props: {
					isAuthenticated: false,
					user: null,
					messages: {
					...require(`../../lang/${context.locale}.json`)
					},
				},
			}
		} else {
			return {
				props: {
					isAuthenticated: true,
					user: null,
					messages: {
					...require(`../../lang/${context.locale}.json`)
					},
				},
			}
		}
    }
}

export default function Profile({isAuthenticated, user}) {
	useEffect(() => {
		if(!isAuthenticated){
			signOut({callbackUrl: '/login'})
		}
	}, [isAuthenticated])

	const updateUserData = (data) => {
		user.name = data.name ? data.name : '';
		user.email = data.email ? data.email : '';
		user.gender = data.gender ? data.gender : '';
		user.profile = data.profile ? data.profile : '';
	}

	return (
		<>
			<Head>
				<title>{ user?.name ? user?.name : 'Profile' }</title>
			</Head>
			<Layout>
				<ProfileComponent user={user} updateUserData={updateUserData} />
			</Layout>
		</>
	)
}
