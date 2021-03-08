import React from 'react';

export default function CenteredPage(props) {

	const {children, className, ...other} = props
	return (
		<div className={"min-h-screen w-full flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 " + (className ? className : null) }>
			{children}
		</div>
	)
}