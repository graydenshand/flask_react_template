import React from 'react';
import Config from 'config';

export default function Home() {
	return (
		<p className="text-center">{Config.siteTitle} | Home</p>
	)
}