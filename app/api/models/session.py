"""
Token Class

Responsible for managing sessions and generating/validating tokens with redis

Use jwt tokens to hide uuid and ensure session hasn't been tampered with by client

"""
import redis
import jwt
from flask import current_app
import time
import json
import uuid
import hashlib
from .user import UserSchema, User
from datetime import datetime

class Session():
	"""

	Data schema

	auth:session:<token> = <user_id>
	"""

	_r = None

	@classmethod
	def connect(cls, connection_string):
		cls._r = redis.Redis().from_url(connection_string)

	@classmethod
	def get(cls, token):
		# try:
		decoded = cls._decode_token(token)		
		session_id = decoded['token_id']
		session = cls._r.get(f"auth:session:{session_id}")
		if session and time.time() - decoded['created_at'] < current_app.config.get("SESSION_EXPIRATION_TIME"):
			schema = UserSchema()
			return schema.loads(session.decode("utf-8"))
		else:
			return None

	@classmethod
	def expires_in(cls, token):
		decoded = cls._decode_token(token)
		return int(current_app.config.get("SESSION_EXPIRATION_TIME") - (time.time() - decoded['created_at']))

	@classmethod
	def set(cls, user):
		session_id = hashlib.sha256(bytes(user.email, 'utf-8')).hexdigest()
		schema = UserSchema()
		body = schema.dump(user)
		cls._r.set(f"auth:session:{session_id}", json.dumps(body, default=str), ex=current_app.config.get("SESSION_EXPIRATION_TIME"))
		return cls._encode_token(session_id)

	@classmethod
	def delete(cls, user):
		session_id = hashlib.sha256(bytes(user.email, 'utf-8')).hexdigest()
		return cls._r.delete(f"auth:session:{session_id}")

	@classmethod
	def generate_verification_token(cls, user):
		token_id = str(uuid.uuid4())
		cls._r.set(f"auth:token:{token_id}", user.id, ex=3600) # 60s * 60m = 360000ms = 1hr
		return cls._encode_token(token_id)

	@classmethod
	def is_valid_verification_token(cls, token):
		token_id = cls._decode_token(token)['token_id']
		user_id = cls._r.get(f"auth:token:{token_id}")
		if user_id:
			return True
		else:
			return False

	@classmethod
	def get_user_from_verification_token(cls, token):
		token_id = cls._decode_token(token).get('token_id')
		user_id = cls._r.get(f"auth:token:{token_id}")
		print(token, token_id, user_id)
		if user_id:
			return User.query.get(user_id.decode("utf-8"))

	@classmethod
	def delete_verification_token(cls, token):
		token_id = cls._decode_token(token).get('token_id')
		return cls._r.delete(f"auth:token:{token_id}")


	@staticmethod
	def _encode_token(token_id):
		return jwt.encode({
				"token_id": token_id,
				"created_at": time.time()
			}, 
			current_app.config['SECRET_KEY'], 
			algorithm='HS256'
		)

	@staticmethod
	def _decode_token(token):
		return jwt.decode(
			bytes(token, 'utf-8'), 
			current_app.config['SECRET_KEY'], 
			algorithms='HS256'
		)

	