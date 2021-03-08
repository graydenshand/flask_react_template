from flask import request, g, render_template, current_app
from flask_restful import Resource
from ..models import Session, User, UserSchema
from datetime import datetime
from app import db, mail
import base64
from ..helpers import send_email, useAuth

class Sessions(Resource):

	@useAuth
	def get(self):
		"""
		Validate a session token / get current user
		"""
		user = g.user
		User.query.filter(User.id == user.id).update({"last_seen":datetime.now()})
		db.session.commit()
		schema = UserSchema()
		return {"user":schema.dump(user), "expires_in": Session.expires_in(g.token)}, 200


	def post(self):
		"""
		Authenticate and issue a new session token

		Authenticate with basic auth (email & password) or with an existing bearer token
		"""
		auth = request.headers.get("Authorization").split(" ")
		if auth[0] == "Basic":
			payload = base64.b64decode(bytes(auth[1], 'utf-8')).decode('utf-8').split(":")
			user = User.query.filter(User.email == payload[0]).first()
			if user and user.check_password(payload[1]):
				user.last_seen = datetime.now()
				db.session.commit()
				return {"token": Session.set(user), "expires_in": current_app.config.get("SESSION_EXPIRATION_TIME")}
			else:
				return {"error": "Invalid credentials"}, 401
		else:
			user = Session.get(auth[1])
			if user is None:
				return {"error": "Invalid token"}, 401
			else:
				return {"token": Session.set(user), "expires_in": current_app.config.get("SESSION_EXPIRATION_TIME")}

	@useAuth
	def delete(self):
		"""
		Invalidate all existing access tokens for a user
		"""
		Session.delete(g.user)
		return "Ok", 200


class ResetPassword(Resource):

	def get(self):
		"""
		Validate a password reset token
		"""
		token = request.args.get('token')
		if token is None:
			return {"error": "Missing token"}, 400
		valid = Session.is_valid_verification_token(token)
		if not valid:
			return {"error": "Not found"}, 404
		return "Ok", 200

	def post(self):
		"""
		Request a password reset link
		"""
		data = request.get_json()
		user = User.query.filter(User.email == data.get('email')).first()
		if user is None:
			return {"error": "No user found with that email address"}, 404
		token = Session.generate_verification_token(user)
		
		# Send link via email
		pw_reset_link = request.url_root + f"reset-password/{token}"
		if current_app.config.get('ENV') == 'development':
			pw_reset_link = "http://localhost:3000/" + f"reset-password/{token}"
		html = render_template('reset_password.html', pw_reset_link=pw_reset_link)
		text = render_template('reset_password.txt', pw_reset_link=pw_reset_link)
		send_email(subject="Your Password Reset Link", recipients=[user.email], text_body=text, html_body=html)

		return "Ok", 200

	def put(self):
		"""
		Validate a password reset token and update password
		"""
		data = request.get_json()
		token = data.get('token')
		if token is None:
			return {"error": "Missing token"}, 400
		if Session.is_valid_verification_token(token):
			user = Session.get_user_from_verification_token(token)
			try:
				user.password = data.get("password")
			except AssertionError as e: # weak password
				return {"error": str(e)}, 400
			db.session.commit()
			Session.delete_verification_token(token)
			return {"token": Session.set(user), "expires_in": current_app.config.get("SESSION_EXPIRATION_TIME")}, 200
		else:
			return {"error": "Invalid token"}, 400


class VerifyEmail(Resource):

	def get(self):
		"""
		Validate an email verification token and verify the user's account
		"""
		token = request.args.get('token')
		if token is None:
			return {"error": "No email verification token specified"}, 400
		if Session.is_valid_verification_token(token):
			user = Session.get_user_from_verification_token(token)
			user.is_verified = True
			db.session.commit()
			Session.set(user)
			Session.delete_verification_token(token)
			return {"valid": True}, 200
		else:
			return {"error": "Invalid token"}, 404


	def post(self):
		"""
		Create and send a new email verification link
		"""
		data = request.get_json()
		user = User.query.filter(User.email == data.get('email')).first()
		if user is None:
			return {"error": "No user found with that email address"}, 404
		token = Session.generate_verification_token(user)

		# Send link via email
		verification_link = request.url_root + f"confirm/{token}"
		if current_app.config.get('ENV') == 'development':
			verification_link = "http://localhost:3000/" + f"confirm/{token}"
		html = render_template('verify_email.html', verification_link=verification_link)
		text = render_template('verify_email.txt', verification_link=verification_link)
		send_email(subject="Verify your email address", recipients=[user.email], text_body=text, html_body=html)

		return "Ok", 200






