import os

class Config(object):
	SECRET_KEY = 'test' #os.urandom(16) # generate a random string
	DEBUG = False
	TESTING = False
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
	REDIS_URL = os.environ.get("REDIS_URL")
	SESSION_EXPIRATION_TIME = 60 * 15 # 15 minutes
	MAIL_SERVER = os.environ.get('MAIL_SERVER')
	MAIL_PORT = os.environ.get('MAIL_PORT')
	MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS') == '1'
	MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL') == '1'
	MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
	MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
	MAIL_DEFAULT_SENDER = os.environ.get("MAIL_USERNAME")

class ProductionConfig(Config):
	pass

class DevelopmentConfig(Config):
	DEBUG = True

class TestingConfig(Config):
	TESTING = True
