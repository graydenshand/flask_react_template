import os

class Config(object):
	SECRET_KEY = os.urandom(16) # generate a random string
	DEBUG = False
	TESTING = False

class ProductionConfig(Config):
	pass

class DevelopmentConfig(Config):
	DEBUG = True

class TestingConfig(Config):
	TESTING = True
