import React, { useState, useEffect, createContext } from 'react';
import {Switch, Route, useLocation } from 'react-router-dom';
import Toggle from 'toggle';
import SignInForm from 'auth/sign-in-form';
import SignUpForm from 'auth/sign-up-form';
import ConfirmPrompt from 'auth/confirm-prompt';
import ConfirmLanding from 'auth/confirm-landing';
import ResetPasswordForm from 'auth/reset-password-form';
import RequestResetPasswordForm from 'auth/request-reset-password-form';
import StyleGuide from 'style-guide';
import Dashboard from 'dashboard';
import API from 'api';
import Cookies from 'universal-cookie';
import SignOut from 'auth/sign-out';
import AlertContainer from 'alert-container';
import useAuth from 'use-auth';
import useAlerts from 'use-alerts';
import useDarkMode from 'use-dark-mode';
import CenteredPage from 'centered-page'
import LoginRequired from 'auth/login-required';
import Home from 'home';

export const cookies = new Cookies();

export const api = new API()
export const CurrentUser = createContext({
	user: null,
	setUser: ()=>{}
});
export const Alerts = createContext({
	alerts: [],
	addAlert: ()=>{},
	removeAlert: ()=>{},
})

function App() {

	
	const [user, setUser] = useAuth(api)
	const [alerts, addAlert, removeAlert] = useAlerts();

	let {darkMode, toggleDarkMode} = useDarkMode(user, setUser);

  return (
  	// Context for current user
  	<CurrentUser.Provider value={{user, setUser}} >

  		{/* Context for alerts */}
  		<Alerts.Provider value={{alerts, addAlert, removeAlert}} >
		  	
		  	{/*Dark mode container*/}
		  	<div className={darkMode ? "dark" : ""}>

		  		{/* Application Frame*/}
			    <div className="min-h-screen text-black dark:bg-black dark:text-white bg-gray-50">
			    	<AlertContainer />
			    	<Toggle
							label="Dark mode"
							hideLabel={true}
							checked={darkMode ? true : false}
							onChange={toggleDarkMode}
							activeIcon={<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>}
							inactiveIcon={<svg class="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>}
							className="absolute top-0 left-0 pl-3 pt-3"
						/>
			    	<Switch>
			    		
				    	<Route exact path="/" component={Home} />
			    		
				    	<Route exact path="/login" >
				    		<CenteredPage>
				    			<SignInForm/>
				    		</CenteredPage>
				    	</Route>
			    		<Route exact path="/signup">
			    			<CenteredPage>
				    			<SignUpForm/>
				    		</CenteredPage>
			    		</Route>
			    		<Route exact path="/confirm" >
			    			<CenteredPage>
			    				<ConfirmPrompt/>
			    			</CenteredPage>
			    		</Route>
			    		<Route exact path="/confirm/:token" >
			    			<CenteredPage>
			    				<ConfirmLanding/>
			    			</CenteredPage>
			    		</Route>
			    		<Route exact path="/reset-password" >
			    			<CenteredPage>
			    				<RequestResetPasswordForm/>
			    			</CenteredPage>
			    		</Route>
			    		<Route exact path="/reset-password/:token" >
			    			<CenteredPage>
			    				<ResetPasswordForm/>
			    			</CenteredPage>
			    		</Route>
			    		<Route exact path="/style-guide" >
			    			<CenteredPage>
			    				<StyleGuide/>
			    			</CenteredPage>
			    		</Route>
			    		<Route exact path="/logout" >
			    			<CenteredPage>
			    				<SignOut/>
			    			</CenteredPage>
			    		</Route>

			    		<LoginRequired>
			    			<Route exact path="/dashboard" component={Dashboard}/>
			    		</LoginRequired>
			    	</Switch>
			    	
			    </div>
		    </div>
	    </Alerts.Provider>
	 </CurrentUser.Provider> 
  );
}

export default App;
