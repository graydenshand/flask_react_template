import React, { useState, useEffect, createContext } from 'react';


export default function useAuth(api) {
	const [user, setUser] = useState("init") // takes three states: "init" - loading; null - signed out; {<user>} - signed in.

	// Validate session
	useEffect(() => {
		// Check for existing session
		if (api.get_access_token() && user === "init") {
			// session found, validate and set user state
			api.current_user()
			.then(data => {
				console.log(data)
				setUser(data.user)
			})
		} else if (user === "init") {
			// no session found, set User context to null
			setUser(null);
		}
	}, [user])
	return [user, setUser]

}