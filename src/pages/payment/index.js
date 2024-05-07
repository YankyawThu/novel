import React, {useEffect} from 'react'
import Layout from '@/layouts/Layout'
import Head from 'next/head'
import Api from "@/services/api";
import { getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import helper from '@/utils/helper'
import { signOut } from "next-auth/react"
import PaymentComponent from '@/components/Payment/index'

export async function getServerSideProps(context) {
    const {query} = context
    const point = query.point
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
		const response = await Api.puller( session.accessToken,'/user/profile', {c:9});
		const user = JSON.parse(helper.decrypt(response.data.data))

        const res = await Api.puller( session.accessToken,'/package-select', {c:9});
		const packages = JSON.parse(helper.decrypt(res.data.data))

		return {
			props: {
				isAuthenticated: true,
				user,
                point: point,
                packages: packages,
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
                    point: point,
                    packages: null,
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
                    point: point,
                    packages: null,
					messages: {
					...require(`../../lang/${context.locale}.json`)
					},
				},
			}
        }
    }
}

export default function Payment({isAuthenticated, user, point, packages}) {
    useEffect(() => {
		if(!isAuthenticated){
			signOut({callbackUrl: '/login'})
		}
	}, [isAuthenticated])

	return (
		<>
			<Head>
				<title>Payment</title>
			</Head>
			<Layout>
                <PaymentComponent user={user} point={point} packages={packages} />
			</Layout>
		</>
		
	)
}