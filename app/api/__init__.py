from flask import Blueprint
from flask_restful import Api
from .models import Session



api_bp = Blueprint("api", __name__, url_prefix="/api", template_folder="./email_templates")
api = Api(api_bp)


from .resources import Sessions, ResetPassword, VerifyEmail, Users, Health
api.add_resource(Sessions, '/session')
api.add_resource(ResetPassword, '/reset-password')
api.add_resource(VerifyEmail, '/verify-email')
api.add_resource(Users, '/users', '/users/<user_id>')
api.add_resource(Health, '/')
