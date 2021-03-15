import {cookies} from 'App';

//const cookies = new Cookies();

export default class API {
	/*
		API CLIENT
			* contains functions mapped to api endpoints 
			* endpoint functions returns a promise that:
				- resolves successfully with data
				- throws an error
	*/
	constructor() {
		this.url_base = process.env.REACT_APP_API_URL;
		this._access_token = null;
		this.expires_at = null;
	}

	set_access_token(token, expires_in) {
		this._access_token = token;
		this.expires_at = new Date()
		this.expires_at.setTime(new Date().getTime() + expires_in*1000);
		cookies.set('session', token, { path: "/",  maxAge: expires_in})
		cookies.set('session_expiration', this.expires_at.getTime(), { path: "/",  maxAge: expires_in})
	}

	get_access_token() {
		// Check data member, if not found check cookie
		if (this._access_token) {
			return this._access_token
		} else {
			let token = cookies.get('session')
			let expires_at = cookies.get('session_expiration')
			if (token) {
				this._access_token = token;
				this.expires_at = new Date();
				this.expires_at.setTime(expires_at);
				return token;
			} else {
				return null
			}
		}
	}

	clear_access_token() {
		this._access_token = null;
		this.expires_at = null;
		cookies.remove("session");
		cookies.remove("session_expiration");

	}

	///////////////////////
	// Request template ///
	///////////////////////
	async request(method="GET",endpoint="", opts={}, suppress_errors=false) {
		
		let payload = {
			method: method,			
			headers: {},
		}

		if (this.get_access_token()) {
			payload.headers = {
				Authorization:`Bearer ${this.get_access_token()}`,
				'Content-Type':"application/json"
			}
			//console.log(method, endpoint)
			if (method!=="POST" || endpoint !== "/session") {
				// Check time to live on access token
				const now = new Date();
				const timeToLive = (this.expires_at - now) / 1000
				//console.log("Session time to live", timeToLive)
				// If ttl < N seconds, refresh token before proceeding
				if (timeToLive < process.env.REACT_APP_SESSION_REFRESH_TTL) {
					const data = await this.refresh_access_token()
					this.set_access_token(data.token, data.expires_in)
				}		
			}
		}
		if (opts.headers) {
			payload.headers = Object.assign({}, payload.headers, opts.headers)
		}

		let url = this.url_base + endpoint;
		if (opts.params) {
			url += "?" + new URLSearchParams(opts.params).toString();
		} 

		if (opts.data) {
			payload['body'] = JSON.stringify(opts.data)
		}

		const resp = await fetch(url, payload)

		if (!suppress_errors) {
			this.throw_standard_errors(resp)
		}
		return resp
	}

	throw_standard_errors(resp) {
		if (resp.status == 401) {
			let alerts = JSON.parse(localStorage.getItem("alerts"))
			alerts.push("Session expired |You were signed out after a period of inactivity")
			localStorage.setItem("alerts", JSON.stringify(alerts))
			window.location.href = "/login"
			//throw new FetchError(resp, "Expired session")
		} else if (!resp.ok) {
			throw new FetchError(resp, "An unexpected error occured")
		}
	}


	////////////////////
	// Access Tokens ///
	////////////////////
	async new_access_token(username, password) {
		// Requst a new access token, using Basic Auth (base64 encode username password)
		const encoded = btoa(`${username}:${password}`)
		let opts = {
			headers: {
				"Authorization": `Basic ${encoded}`
			}
		}
		const resp = await this.request("POST", "/session", opts, true)
		if (resp.status === 401) {
			throw new FetchError(resp, "Unrecognized email/password combination")
		}
		this.throw_standard_errors(resp);
		return resp.json()
	}

	async refresh_access_token() {
		// Request a new access token, using an existing access token to authenticate
		const resp = await this.request("POST", "/session")
		return resp.json()
	}

	async revoke_all_access_tokens() {
		// Has the effect of logging user out on all devices (invalidating any and all existing sessions)
		const resp = await this.request("DELETE", "/session")
		return resp.json()
	}

	async current_user() {
		// Validate session token and get session data
		const resp = await this.request("GET", "/session")
		return resp.json()
	}
	
	/////////////////////
	// Reset Password	///
	/////////////////////
	async request_password_reset(email) {
		// request a reset password email
		const opts = {
			data: {
				"email": email
			},
			headers: {
				"Content-Type": 'application/json'
			}
		}
		const resp = await this.request("POST", "/reset-password", opts, true)
		if (resp.status === 404) {
			throw new FetchError(resp, "No user found with that email")
		}
		this.throw_standard_errors(resp)
		return resp.json()
	}
	async check_password_reset(token) {
		const opts = {
			params: {
				token: token
			}
		}
		const resp = await this.request("GET", "/reset-password", opts, true)
		if (resp.status === 404) {
			throw new FetchError(resp, "Invalid or expired link")
		}
		this.throw_standard_errors(resp)
		return resp.json()
	}

	async submit_password_reset(token, password) {
		const opts = {
			data: {
				token: token,
				password: password
			},
			headers: {
				'Content-Type': "application/json"
			}
		}
		const resp = await this.request("PUT", "/reset-password", opts)
		return resp.json()
	}

	////////////////////
	// Verify Email ////
	////////////////////
	async request_email_verification(email) {
		// request an email verification link
		const opts = {
			data: {
				"email": email
			}
		}
		const resp = await this.request("POST", "/verify-email", opts)
		return resp.json()
	}
	async submit_email_verification(token) {
		// Trigger an email verification based on a token
		const opts = {
			params: {
				token: token
			}
		}
		const resp = await this.request("GET", "/verify-email", opts)
		return resp.json()
	}

	////////////////////
	// User Resource ///
	////////////////////
	async create_user(email, name, password) {
		// Sign up
		const opts = {
			data: {
				email: email,
				name: name,
				password: password,
			},
			headers: {
				"Content-Type": "application/json"
			}
		}
		const resp = await this.request("POST", "/users", opts, true)
		if (resp.status === 400) {
			throw new FetchError(resp, "An account with that email already exists")
		}
		this.throw_standard_errors(resp)
		return resp.json()
	}

	async update_user(user_id, data) {
		// Update user
		const opts = {
			data: data,
			headers: {
				"Content-Type": "application/json"
			}
		}
		const resp = await this.request("PUT", "/users/" + user_id, opts)
		return resp.json()
	}

}


class FetchError extends Error {
	constructor(response, message) {
    super(message)
    this.response = response
  }
}