import React, {useState, useContext, useEffect} from 'react';
import {api, CurrentUser} from 'App';
import Toggle from 'toggle';
import {Link, useHistory, Redirect} from 'react-router-dom';
import {useQuery} from 'react-query';
import * as buttons from 'buttons';


export default function LoginRequired(props) {

	let history = useHistory()
	let {user, setUser} = useContext(CurrentUser)

	if (user === null) {
		return <Redirect to={{pathname: "/login", state: { referrer: history.location}}} />
	}

	if (user === "init") {
		return <p>Loading...</p>
	}

	if (!user.is_verified) {
		return <Redirect to="/confirm" />
	}

	const { children, ...other} = props
	return <div {...other}>{children}</div>
}