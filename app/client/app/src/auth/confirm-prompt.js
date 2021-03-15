import React, { useContext, useState } from 'react';
import { Primary as Button } from 'buttons';
import { useMutation } from 'react-query';
import { api, CurrentUser } from 'App';
import { useHistory } from 'react-router-dom';

export default function ConfirmPrompt() {
	let {user, setUser} = useContext(CurrentUser);
	let history = useHistory();
	const [didResend, updateDidResend] = useState(false);

	let email = localStorage.getItem("email");


	if (user !== null) {
		// User is logged in, verifying email post sign-up
		if (user.is_verified) {
			history.push('/dashboard');
		}
		email = user.email;
	} else if (email === null) {
		// No user identified, redirect to login
		history.push('/login')
	}

	const passwordResetMutation = useMutation(
		email=>{
			api.request_password_reset(email)
		}
	) 
	const verifyEmailMutation = useMutation(
		email=>{
			api.request_email_verification(email)
		}
	) 

	// Choose appropriate API call
	function handleResendLink() {
		if (user !== null) {
			verifyEmailMutation.mutate(email)
		} else {
			passwordResetMutation.mutate(email)
		}
		updateDidResend(true);
	}

	return (
		<div className="bg-gray-200 dark:bg-gray-900 p-5 max-w-2xl text-center flex flex-col rounded-sm shadow-lg">
			<h2>Please confirm your email address</h2>
			<p className="mb-5 text-gray-600 dark:text-gray-400 leading-normal">We just sent a verification link to {email}. Please click this link to confirm your email address.</p>
			{!didResend ? 
				<Button onClick={handleResendLink}>Resend confirmation email</Button>
				:
				<p className="text-purple-500">
				It's on it's way!
				</p>
			}
			
		</div>
	)
}