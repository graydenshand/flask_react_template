import React, { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import FormError from 'form-error';
import { Redirect, useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import { api, Alerts } from 'App';
import * as buttons from 'buttons';

export default function RequestResetPasswordForm(props) {
	const {register, handleSubmit, watch, errors, clearErrors} = useForm();
	let history = useHistory()

	const {alerts, addAlert, removeAlert} = useContext(Alerts)

	const passwordResetMutation = useMutation(
		email=>{
			return api.request_password_reset(email)
		}
	) 

	const onSubmit = data => {
		// Save email to local storage in case we need to reesend the email on the next page
		localStorage.setItem("email", data.email)
		passwordResetMutation.mutate(data.email)
	}

	if (passwordResetMutation.isSuccess) {
		history.push("/confirm")
	}
	
	return (

		  <div className="max-w-md w-full space-y-8">
		    <div>
		      <h2 className="text-center">
		        Reset your password
		      </h2>
		      <p className="mt-4 text-center text-lg text-gray-600 dark:text-gray-400">Enter your email below and we'll send you a link to reset your password</p>
		    </div>
		    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
		      {/*Email & Password inputs */}
		      <div className="rounded-md shadow-sm -space-y-px">
		        <div>
		          <label for="email-address" className="sr-only">Email address</label>
		          <input id="email-address" name="email"  type="text"
		          		ref={register({ required: "Email address is required", pattern: {value: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/, message: "Invalid email address"} })} 
		          		autocomplete="email" className={"rounded-md " + (errors.email ? "error" : "")} placeholder="Email address" />
		        </div>
		      </div>

		    	{/*Error messages*/}
		      <div className="flex flex-col space-y-2">
		      	{errors.email && <FormError message={errors.email.message} /> }
		      	{passwordResetMutation.isError ? <FormError message={passwordResetMutation.error.message} /> : ""}
		      </div>

		      <div>
		        <buttons.Primary type="submit" className="sm:w-full">
		          Confirm
		        </buttons.Primary>
		      </div>
		    </form>
		  </div>
	)
}