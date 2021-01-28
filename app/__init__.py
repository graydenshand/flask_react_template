from flask import Flask
from .config import ProductionConfig
import os

def create_app(config=ProductionConfig):
	app = Flask(__name__, static_folder="client/app/build/static")
	
	# Load app config
	app.config.from_object(config)

	from .client import client_bp
	app.register_blueprint(client_bp)

	return app
