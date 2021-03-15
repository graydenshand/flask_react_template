import React, { useContext } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useQuery } from 'react-query';
import { api, CurrentUser, Alerts } from 'App';

export default function ConfirmLanding() {
	let { token } = useParams();
	const {alerts, addAlert} = useContext(Alerts);
	const {user, setUser} = useContext(CurrentUser);

	const { isLoading, data, isError, error} = useQuery('verifyEmailToken', ()=>api.submit_email_verification(token), {
		retry: false
	})

	if ( user.is_verified ) {
		return <Redirect to="/" />
	}

	if ( isLoading ) {
		return <span>Loading...</span>
	}

	// Token was not found on server
	if (isError) {
		return <span>Error: Invalid or expired link</span>
	}

	// Successfully validated token, redirect to homepage
	setUser(prevUser => {
		return {...prevUser, is_verified: true}
	})
	return <Redirect to="/" />
}