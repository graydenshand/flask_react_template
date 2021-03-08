import React, { useEffect, useContext } from 'react';
import {cookies, api, CurrentUser} from 'App';
import {useHistory} from 'react-router-dom';

export default function SignOut() {
	let history = useHistory()
	const {user, setUser} = useContext(CurrentUser);

	useEffect(() => {
		api.clear_access_token()
		setUser(null);
		history.push("/login");
	})
	
	return ""
}