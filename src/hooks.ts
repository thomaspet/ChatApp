import cookie from 'cookie';
import { v4 as uuid } from '@lukeed/uuid';
import type { GetSession, Handle } from '@sveltejs/kit';
import { dev } from '$app/env';

import tokens from "$lib/token";

export const handle: Handle = async ({ event, resolve }) => {
	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	event.locals.userid = cookies.userid || uuid();

	const response = await resolve(event);

	if (!cookies.userid) {
		// if this is the first time the user has visited this app,
		// set a cookie so that we recognise them when they return
		response.headers.set(
			'set-cookie',
			cookie.serialize('userid', event.locals.userid, {
				path: '/',
				httpOnly: true,
				secure: !dev,
			})
		);
	}

	return response;
};


export const getSession: GetSession = async (event) => {
	const token = tokens.getToken(event.locals.userid);

	if (token) {
		// This is bad.. but uni doesn't use a different endpoint to use an profile token on?
		const payload = parseJwt(token);

		return {
			userid: event.locals.userid,
			authenticated: true,
			displayName: payload.preferred_username || payload.name || payload.email
		};
	}

	return {
		userid: event.locals.userid,
		authenticated: false,
		displayName: ''
	}
}

function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
		Buffer.from(base64, 'base64')
			.toString()
			.split('')
			.map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
			.join(''));

    return JSON.parse(jsonPayload);
};