from flask import request, g, render_template, current_app
from flask_restful import Resource
from ..models import Session, User, UserSchema
from datetime import datetime
from app import db
from ..helpers import send_email, useAuth

class Users(Resource):

	def post(self):
		"""
		Handle sign up form submissions
		"""
		data = request.get_json()
		required_fields = ['email', 'name', 'password']
		required_check = [field for field in required_fields if data.get(field) is None]
		# Check required fields
		if len(required_check) > 0:
			return {"error": f"Missing required fields: {','.join(required_check)}"}, 400

		# Check for existing account with this email
		user = User.query.filter(User.email == data.get('email').lower()).first()
		if user:
			return {"error": "That email is already in use."}, 400

		try:
			user = User(email=data.get('email').lower(), name=data.get("name"), password=data.get("password"))
		except AssertionError as e:
			# Password was not strong enough
			return {"error": str(e)}, 400


		# Create account
		db.session.add(user)
		db.session.commit()

		# Trigger email verification email
		token = Session.generate_verification_token(user)

		# Send link via email
		verification_link = request.url_root + f"confirm/{token}"
		if current_app.config.get('ENV') == 'development':
			verification_link = "http://localhost:3000/" + f"confirm/{token}"
		html = render_template('verify_email.html', verification_link=verification_link)
		text = render_template('verify_email.txt', verification_link=verification_link)
		send_email(subject="Verify your email address", recipients=[user.email], text_body=text, html_body=html)

		# Create a new session and return an access token to the user
		return {"token": Session.set(user), "expires_in": current_app.config.get("SESSION_EXPIRATION_TIME")}


	@useAuth
	def put(self, user_id):
		"""
		Update a user
		"""	
		# Only allow users to update their own account, unless they're an admin
		if user_id != g.user.id and g.user.is_admin == False:
			return {"error": "You do not have permission to update that resource"}, 403

		# Process input data
		data = request.get_json()

		# These fields are not allowed to be updated manually
		not_allowed = ['password', 'created_at', 'last_seen']
		not_allowed_check = [field for field in not_allowed if data.get(field) is not None]
		if len(not_allowed_check) > 0:
			return {"error": f"Contains non-editable fields: {','.join(not_allowed_check)}"}, 400
			
		# These fields are only allowed if the current user is an admin
		admin_restricted = ['is_verified']
		if not g.user.is_admin:
			admin_restricted_check = [field for field in admin_restricted if data.get(field) is not None]
			if len(not_allowed_check) > 0:
				return {"error": f"Contains fields that you do not have permission to edit: {','.join(admin_restricted_check)}"}, 403

		# Get user
		user = User.query.get(user_id)
		if not user:
			return {"error", "Not found"}, 404

		# Update user with passed data
		for k,v in data.items():
			if hasattr(user, k):
				setattr(user, k, v)
			else:
				return {"error": f"Unrecognized field: {k}"}, 400

		# Save changes
		db.session.commit()

		# Update cache
		Session.set(user)

		return "Ok", 200

