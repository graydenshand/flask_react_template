import React from 'react';
import * as buttons from 'buttons';

export default function StyleGuide() {
	
	return (
		<div className='max-w-screen-xl w-full'>
			<section>
				<h4 className="uppercase text-xl font-extrabold text-gray-600 dark:text-gray-400 tracking-tight mb-3">Buttons and links</h4>
				<div className="flex flex-col space-y-3 sm:space-x-5 sm:space-y-0  sm:flex-row sm:items-center">
					<buttons.Primary>Primary Action</buttons.Primary>
					{/*<button className="btn btn-primary">Primary Action</button>*/}
					<buttons.Secondary>Secondary Action</buttons.Secondary>
					<a href="#">Basic link</a>
				</div>
			</section>	
			<section>
				<h4 className="uppercase text-xl font-extrabold text-gray-600 dark:text-gray-400 tracking-tight mb-3">Typography</h4>
				<div>
					<h1>Corporation neural assault sprawl </h1>
					<h2>Monofilament paranoid shrine hacker dolphin pen futurity </h2>
					<h3>8-bit marketing motion plastic media uplink shanty town </h3>
					<p>Tower 8-bit rifle vinyl face <a href="#">forwards monofilament math-convenience</a> store papier-mache systemic military-grade lights sign narrative dolphin 3D-printed wristwatch. Plastic decay meta-towards warehouse 8-bit face forwards Kowloon smart-rain office. Shoes wristwatch RAF render-farm drone long-chain hydrocarbons vehicle advert Kowloon numinous denim 3D-printed artisanal ablative. Paranoid corporation tanto tattoo garage neon systema jeans tiger-team.</p>
				</div>
			</section>
			<section>
				<h4 className="uppercase text-xl font-extrabold text-gray-600 dark:text-gray-400 tracking-tight mb-3">Forms</h4>
				<form>
					<input className="rounded-md" type="text" placeholder="Text Input" />
				</form>
			</section>
		</div>
	)
}