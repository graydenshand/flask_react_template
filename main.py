from app import create_app
import os
from app.config import DevelopmentConfig, ProductionConfig

if os.environ.get("FLASK_ENV") == "development":
	app = create_app(config=DevelopmentConfig)
else:
	app = create_app(config=ProductionConfig)

if __name__ =='__main__':
	app.run(host='0.0.0.0', port=os.environ.get('PORT', 5000))