from flask_mail import Message
from threading import Thread
from flask import current_app, request, g
from app import mail
from functools import wraps
from .models import Session

def useAuth(func=None, admin_only=False):
	def decorator(f):
		@wraps(f)
		def decorated(*args, **kwargs):
			print("running wrapped func")
			token = request.headers.get('Authorization')
			if token is None:
				return {"error": "Missing Authorization header"}, 401
			else:
				user = Session.get(token.replace("Bearer ", ""))
			if user is None:
				return {"error": "Invalid Authorization token"}, 401
			if admin_only and user.is_admin == False:
				return {"error": "You do not have permission to view that resource"}
			g.user = user
			g.token = token.replace("Bearer ", "")
			result = f(*args, **kwargs)
			return result
		return decorated
	if func:
		return decorator(func)
	return decorator


def send_async_email(app, msg):
    with app.app_context():
        mail.send(msg)

def send_email(subject, recipients, text_body, html_body, sender=None):
    msg = Message(subject, sender=sender, recipients=recipients)
    msg.body = text_body
    msg.html = html_body
    thr = Thread(target=send_async_email, args=[current_app._get_current_object(), msg])
    thr.start()