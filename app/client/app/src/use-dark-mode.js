import React, { useState, useContext, useEffect } from 'react';
import {CurrentUser, api, Alerts} from 'App';
import {useMutation} from 'react-query'


export default function useDarkMode(user, setUser) {
	const {alerts, addAlert} = useContext(Alerts);

	// Pull darkmode from user context
	let [darkMode, setDarkMode] = useState(user && user.uses_dark_mode);

	// Update darkMode when user changes
	useEffect(()=> {
		if (user) {
			setDarkMode(user.uses_dark_mode)	
		}
	}, [user])

	// User is logged out, look at local storage
	if (darkMode == null) {
		if (localStorage.getItem("darkmode") !== null) {
			setDarkMode(localStorage.getItem("darkmode") === 'true');
		} else {
			// Nothing in local storage, default to OS preference
			setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
		}
	}

	// API Call to save settings on server
	const darkModeMutation = useMutation((status)=>{return api.update_user(user.id, {uses_dark_mode: status})}, {
		onError: error=>{
			addAlert(error) 
		}, 
		onSucces: data=> {
			// Update user context
			setUser(prevUser => {
				return {...prevUser, uses_dark_mode: data.uses_dark_mode}
			})
		}
	})
	
	function toggleDarkMode() {

		setDarkMode(prevDarkMode => {
			// Update local storage
			localStorage.setItem('darkmode', !prevDarkMode);
			if (user !== null) {
				// API call -- update user settings in db
				darkModeMutation.mutate(!prevDarkMode)
			}
			return !prevDarkMode
		})
	}

	return {darkMode, toggleDarkMode}
}
