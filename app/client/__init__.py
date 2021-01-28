from flask import Blueprint, render_template, send_from_directory
import os 

client_bp = Blueprint("client", __name__, static_folder="app/build", template_folder="app/build")

@client_bp.route('/', defaults={'path': ''})
@client_bp.route('/<path:path>')
def catch_all(path):
	if path and path != "" and os.path.exists(client_bp.static_folder + '/' + path):
		return send_from_directory(client_bp.static_folder, path)
	return render_template("index.html")