import React, {useState, useContext,  useEffect} from 'react';
import {api, CurrentUser} from 'App';
import Toggle from 'toggle';
import {Link} from 'react-router-dom';
import * as buttons from 'buttons';
import LoginRequired from 'auth/login-required';
import CenteredPage from 'centered-page';

export default function Dashboard() {
	let {user, setUser} = useContext(CurrentUser)

	return (
		<CenteredPage className="flex flex-col justify-center items-center">
				<p className="text-xs uppercase tracking-wide font-bold">Hello</p>

				<p className="font-extrabold text-2xl">{user && user.email}</p>

				<p className="mt-4"><Link to="/logout" className="underline text-sm" >Log out</Link></p>
		</CenteredPage>
	)
}