import React, { useState, useContext } from 'react';
import {useForm} from 'react-hook-form';
import {useParams, useHistory, Redirect} from 'react-router-dom';
import {useQuery, useMutation} from 'react-query';
import FormError from 'form-error';
import {api, CurrentUser, Alerts} from 'App';
import Config from 'config';

export default function ResetPasswordForm() {

	// Get Token from route param
	const {token} = useParams();
	const history = useHistory();

	// Set up form
	const {register, handleSubmit, errors, setError, watch} = useForm();
	const watchPasswords = watch();

	// Current user context
	const {user, setUser} = useContext(CurrentUser);

	// Alerts context
	const {alerts, addAlert, removeAlert} = useContext(Alerts);

	// Request validation of token from server
	const { isLoading, data, isError, error} = useQuery('resetPasswordToken', ()=>api.check_password_reset(token), {
		retry: false
	})

	// Setup function to update password
	const updatePasswordMutation = useMutation(password=>api.submit_password_reset(token, password), {
		onSuccess: data => {
			// Successful authentication, log user in
			api.set_access_token(data.token, data.expires_in)
			setUser("init")
			addAlert("Password updated")
		},
		 onError: error => {
			error.response.json()
			.then( data => setApiError(data.error))
		}
	})
	// State container for errors from API
	const [apiError, setApiError] = useState(null);
	

	// Loading
	if (isLoading || updatePasswordMutation.isLoading){
		return <span>Loading...</span>
	}

	// Token was not found on server
	if (isError) {
		return <span>Invalid or expired link</span>
	}

	// Handle successful pw reset
	if (updatePasswordMutation.isSuccess) {
		// Clear email from local storage
		localStorage.removeItem("email")

		// Redirect to homepage unless otherwise specified
		let url = "/dashboard"
		if (history.location.state) {
			if (history.location.state.referrer) {
				url = history.location.state.referrer;
			}
		}
		return <Redirect push to={url} />
	}

	// Validate password match
	const passwordsMatch = () => {
		return (watchPasswords.password === watchPasswords.verifyPassword)
	}
		

	// Handle form submit
	const onSubmit = formData => {
		updatePasswordMutation.mutate(formData.password)
	}
	
	return (
		  <div className="max-w-md w-full space-y-8">
		    <div>
		    	<h1 className="text-center text-6xl text-purple-700 dark:text-purple-400 font-extrabold tracking-tighter">{Config.siteTitle}</h1>
		      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">
		        Reset your password
		      </h2>
		    </div>
		    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
		      <div className="rounded-md shadow-sm -space-y-px">
		        
		        <div>
		          <label for="password" className="sr-only">Password</label>
		          <input id="password" name="password" ref={register({ required: "Password is required" })} type="password" autocomplete="current-password" className={"rounded-t-md " + (errors.password || errors.verifyPassword ? "error" : "")} placeholder="Password" />
		        </div>
		        <div>
		          <label for="verifyPassword" className="sr-only">Verify Password</label>
		          <input id="verifyPassword" name="verifyPassword" ref={register({ required: "Password verification is required", validate: passwordsMatch })} type="password" autocomplete="current-password" className={"rounded-b-md " + (errors.verifyPassword ? "error" : "")} placeholder="Verify Password" />
		        </div>
		      </div>

		    	{/*Error messages*/}
		      <div className="flex flex-col space-y-2">
		      	{errors.password && <FormError message={errors.password.message} />}
		      	{errors.verifyPassword && <FormError message={errors.verifyPassword.message ? errors.verifyPassword.message : 'Passwords do not match'} />}
		      	{apiError && <FormError message={apiError} /> }
		      </div>

		      <div>
		        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
		          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
		            {/*<!-- Heroicon name: lock-closed -->*/}
		            <svg className="h-5 w-5 text-purple-500 group-hover:text-purple-400 group-focus:text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
		            </svg>
		          </span>
		          Sign up
		        </button>
		      </div>
		    </form>
		  </div>
	)
}