import React, { useState }from 'react';
import { Switch, Transition } from '@headlessui/react';


export default function Alert(props) {
  const [show, toggleShow] = useState(true);

  const [message, details] = props.message.split('|')

  function handleClose() {
    //localStorage.removeItem('message')

    if (props.close) {
      props.close()  
    } else {
      toggleShow(false);
    }
    
  }

  return (
    /*<!-- This example requires Tailwind CSS v2.0+ -->*/
    <div className="flex items-end justify-center my-2 pointer-events-none sm:items-start sm:justify-end">
      {/*<!--
        Notification panel, show/hide based on alert state.

        Entering: "transform ease-out duration-300 transition"
          From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          To: "translate-y-0 opacity-100 sm:translate-x-0"
        Leaving: "transition ease-in duration-100"
          From: "opacity-100"
          To: "opacity-0"
      -->*/}
       <Transition
        show={show}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="max-w-sm w-full bg-white dark:bg-gray-900 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black dark:ring-white ring-opacity-5 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {message}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {details}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button className="bg-white dark:bg-gray-900 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={handleClose}>
                <span className="sr-only">Close</span>
                {/*<!-- Heroicon name: solid/x -->*/}
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
      </div>
    </Transition>
    </div>


  )
}
