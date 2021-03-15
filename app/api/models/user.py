import hashlib
import time
from datetime import datetime
from marshmallow import Schema, fields, post_load
from sqlalchemy.orm import validates
import sqlalchemy as sa
import os
from app import db

class UserSchema(Schema):
	id = fields.String(required=True)
	name = fields.String(required=True)
	email = fields.Email(required=True)
	created_at = fields.DateTime(required=True)
	last_seen = fields.DateTime(required=True)
	is_admin = fields.Boolean(required=True)
	is_verified = fields.Boolean(required=True)
	phone = fields.Boolean(required=True, allow_none=True)
	uses_dark_mode = fields.Boolean(required=True)

	@post_load
	def make_user(self, data, **kwargs):
		return User(**data)

class User(db.Model):
	__tablename__ = "users"

	def __init__(self, **kwargs):
		super().__init__(**kwargs)
		if 'created_at' not in kwargs:
			self.created_at = datetime.now()
			self.last_seen = datetime.now()

	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String, nullable=False, unique=True)
	name = db.Column(db.String, nullable=False)
	password = db.Column(db.String, nullable=False)
	created_at = db.Column(db.DateTime, nullable=False)
	last_seen = db.Column(db.DateTime, nullable=False)
	is_admin = db.Column(db.Boolean, nullable=False, default=False)
	is_verified = db.Column(db.Boolean, nullable=False, default=False)
	phone = db.Column(db.String)
	uses_dark_mode = db.Column(db.Boolean, nullable=False, default=False)

	@validates('password')
	def validate_password(self, key, password):
		assert len(password) > 8, "Password must be longer than 8 characters"
		assert password != password.lower(), "Password must contain both uppercase and lowercase characters"
		return hashlib.sha256(bytes(password, 'utf-8')).hexdigest()

	@validates('email')
	def validate_email(self, key, email):
		assert '@' in email, "Please enter a valid email address"
		return email.lower()

	@validates('is_admin')
	def validate_is_admin(self, key, is_admin):
		return is_admin in ('true', 'True', 'TRUE', True, 1)

	def check_password(self, password):
		digest = hashlib.sha256(bytes(password, 'utf-8')).hexdigest()
		if digest == self.password:
			return True
		else:
			return False

	def __repr__(self):
		return f"<User(email={self.email}>"

	def to_dict(self):
		return {
			"id": self.id,
			"email": self.email,
			"name": self.name,
			"created_at": self.created_at,
			"last_seen": self.last_seen,
			"is_admin": self.is_admin,
			"is_verified": self.is_verified,
			"phone": self.phone,
			"uses_dark_mode": self.uses_dark_mode
		}
	
	def from_dict(self, data):
		for k, v in data.items():
			if hasattr(self, k):
				setattr(self, k, v)


