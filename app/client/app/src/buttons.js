import React from 'react';

export function Button(props) {
	const {children, ...other } = props;
	return (
		<button {...other} className={"py-2 sm:py-4 sm:px-5 shadow-sm rounded-md w-full font-semibold sm:w-auto focus:ring-2 focus:ring-purple-700 focus:ring-offset-2 dark:focus:ring-offset-black focus:outline-none " + props.className}>
			{children}
		</button>
	)
}

export function Primary(props) {
	const {children, ...other } = props;
	return (
		<Button {...props} className={"bg-purple-700 text-white hover:bg-purple-600 " + props.className}>
			{props.children}
		</Button>
	)
}

export function Secondary(props) {
	const {children, ...other } = props;
	return (
		<Button {...props} className={"bg-gray-300 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-gray-200 dark:hover:bg-gray-600 " + props.className}>
			{props.children}
		</Button>
	)
}