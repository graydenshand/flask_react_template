import React, { useState, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';

export default function useAlerts() {
  const [alerts, setAlerts] = useState(JSON.parse(localStorage.getItem('alerts')))	  
  if (alerts == null) {
    localStorage.setItem('alerts', '[]')
  }
  function addAlert(message) {
  	
  	setAlerts(prev => {
  		let msgs = [...prev, message]
  		localStorage.setItem("alerts", JSON.stringify(msgs))
  		return msgs
  	})
  }

 	function removeAlert(index) {
 		setAlerts(prev => {
 			let msgs = prev.slice()
 			msgs.splice(index, 1)
 			localStorage.setItem("alerts", JSON.stringify(msgs))
 			return msgs
 		})
 	}

  return [alerts, addAlert, removeAlert]
}

