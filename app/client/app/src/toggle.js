import React, { useState } from 'react';
import { Switch, Transition } from '@headlessui/react';

export default function Toggle(props) {
	const [active, setActive] = useState(false);

	let inactiveIcon = (
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
      <path d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
	);
	if (props.inactiveIcon) {
		inactiveIcon = props.inactiveIcon;
	}

	let activeIcon = (
		<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 12 12">
      <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
    </svg>
	);
	if (props.activeIcon) {
		activeIcon = props.activeIcon;
	}

	return (
		<Switch.Group as="div" className={"flex items-center space-x-4 " + props.className}>
			<Switch.Label className={props.hideLabel ? "sr-only" : ""}>{props.label}</Switch.Label>
			<Switch
				as="button"
				checked={props.checked}
				onChange={props.onChange}
				className={`${props.checked ? 'bg-purple-500 dark:bg-purple-400' : 'bg-gray-200 dark:bg-gray-700'} relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:shadow-outline focus:ring-purple-700 focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-black`}
				title={props.label}
			>
				{({ checked }) => (
          <span
            className={`${
              checked ? "translate-x-5 " : "translate-x-0 "
            } inline-block w-5 h-5 transition duration-200 ease-in-out transform bg-white dark:bg-black rounded-full`}
          >	
          	<Transition
          		show={checked}
          		enter="transition-opacity duration-100 ease-in"
          		enterFrom="opacity-0"
          		enterTo="opacity-100"
          		leave="transition-opacity duration-200 ease-out"
          		leaveFrom="opacity-100"
          		leaveTo="opacity-0"
          	>
          		<span class="opacity-100 text-purple-500 dark:text-white ease-out duration-100 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden={!checked}>
					      {activeIcon}
					    </span>
					  </Transition>
					  <Transition
					  	show={!checked}
					  	enter="transition-opacity duration-100 ease-in"
          		enterFrom="opacity-0"
          		enterTo="opacity-100"
          		leave="transition-opacity duration-200 ease-out"
          		leaveFrom="opacity-100"
          		leaveTo="opacity-0"
					  >
          		<span class="opacity-100 text-gray-400 dark:text-gray-600 ease-in duration-200 absolute inset-0 h-full w-full flex items-center justify-center transition-opacity" aria-hidden={checked}>
					      {inactiveIcon}
					    </span>
					  </Transition>
          </span>
        )}

			</Switch>
		</Switch.Group>
	)
}