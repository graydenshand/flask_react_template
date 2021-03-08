from flask import Flask
from .config import ProductionConfig
import os
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_mail import Mail
from flask_sslify import SSLify

db = SQLAlchemy()
cors = CORS()
mail = Mail()

def create_app(config=ProductionConfig):
	app = Flask(__name__, static_folder="client/app/build/static")
	
	with app.app_context():
		# Load app config
		app.config.from_object(config)

		from .api.models import Session, User
		Session.connect(config.REDIS_URL)

		# Enable flask extensions
		db.init_app(app)
		db.create_all()
		cors.init_app(app, resources={r"/*": {"origins": "*"}})
		mail.init_app(app)
		sslify = SSLify(app)

		from .api import api_bp
		app.register_blueprint(api_bp)

		from .client import client_bp
		app.register_blueprint(client_bp)

		@app.shell_context_processor
		def make_shell_context():
			return {
				"db": db,
				"User": User,
				"Session": Session,
			}
		
		

	return app
