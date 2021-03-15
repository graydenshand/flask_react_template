import React, { useState, useEffect, useContext } from 'react';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { Link, useHistory, Redirect } from 'react-router-dom';
import FormError from 'form-error';
import * as buttons from 'buttons';
import {api, CurrentUser} from "App";
import Config from 'config';


export default function SignInForm(props) {
	const {register, handleSubmit, watch, errors, clearErrors, getValues} = useForm();
	let history = useHistory()
	const {user, setUser} = useContext(CurrentUser);
	const signInMutation = useMutation(
		args => api.new_access_token(args.email, args.password), 
		{
			onSuccess: data => {
				// Successful authentication, log user in
				api.set_access_token(data.token, data.expires_in)
				setUser("init")
			}
	})

	const onSubmit = data => {
		signInMutation.mutate({email: data.email, password: data.password});
	}
	
	if (signInMutation.isLoading) {
		return "Loading..."
	}

	if (signInMutation.isSuccess) {
		// Redirect to dashboard unless otherwise specified
		let url = "/dashboard"
		if (history.location.state) {
			if (history.location.state.referrer) {
				url = history.location.state.referrer;
			}
		}
		return <Redirect push to={url} />
	}

	return (
		  <div className="max-w-md w-full space-y-8">
		    <div>
		    	<h1 className="text-center text-6xl text-purple-700 dark:text-purple-600 font-extrabold tracking-tighter">{Config.siteTitle}</h1>
		      <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-50">
		        Sign in to your account
		      </h2>
		    </div>
		    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
		      {/*Email & Password inputs */}
		      <div>
			      <div className="rounded-md shadow-sm -space-y-px">
			        <div>
			          <label for="email-address" className="sr-only">Email address</label>
			          <input id="email-address" name="email"  type="text"
			          		ref={register({ required: "Email address is required", pattern: {value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, message: "Invalid email address"} })} 
			          		autocomplete="email" className={"rounded-t-md " + (errors.email ? "error" : "")} placeholder="Email address" />
			        </div>
			        <div>
			          <label for="password" className="sr-only">Password</label>
			          <input id="password" name="password" ref={register({ required: "Password is required" })} type="password" autocomplete="current-password" 
			          		className={"rounded-b-md " + (errors.password ? "error" : "")} placeholder="Password" />
			        </div>
			      </div>
			      <div className="text-xs mt-1 flex justify-between">
		          <Link to="/reset-password">
		            Forgot your password?
		          </Link>
		        </div>
	        </div>

		    	{/*Error messages*/}
		      <div className="flex flex-col space-y-2">
		      	{errors.email && <FormError message={errors.email.message} /> }
		      	{errors.password && <FormError message={errors.password.message} />}
		      	{signInMutation.isError && <FormError message={signInMutation.error.message} />}
		      </div>

		      <div>
		        <buttons.Primary type="submit" className="group relative sm:w-full text-sm flex justify-center ">
		          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
		            {/*<!-- Heroicon name: lock-closed -->*/}
		            <svg className="h-5 w-5 text-purple-500 group-hover:text-purple-400 group-focus:text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
		            </svg>
		          </span>
		          Sign in
		        </buttons.Primary>
		        <Link to="/signup"><buttons.Secondary className="mt-2 group relative flex justify-center items-center sm:w-full text-sm">
		        	<span className="absolute left-0 inset-y-0 flex items-center pl-3">
		            {/*<!-- Heroicon name: lock-closed -->*/}
		            <svg className="h-5 w-5 text-gray-400 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
		              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
		            </svg>
		          </span>
		        	Create an account
		        </buttons.Secondary></Link>
		      </div>
		    </form>
		  </div>
	)
}