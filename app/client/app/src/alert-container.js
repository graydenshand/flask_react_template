import React, { useContext } from 'react';
import Alert from 'alert';
import useAlerts from 'use-alerts';
import { Alerts } from 'App';

export default function AlertContainer() {

	const {alerts, addAlert, removeAlert} = useContext(Alerts);
	let messages = []
	for (const [index, message] of alerts.entries()) {
		messages.push(<Alert key={index} message={message} close={()=>{removeAlert(index)}} />)
	}
	return (
		<div className="fixed z-20 w-full sm:w-96 right-0 top-0 flex flex-col px-4 py-6 sm:p-6">
			{messages}
		</div>
	)
}