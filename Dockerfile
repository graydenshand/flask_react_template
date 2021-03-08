FROM python

WORKDIR /home/app

# INSTALL PACKAGES
RUN python3 -m pip install flask flask-restful pyjwt sqlalchemy flask-sqlalchemy redis flask-cors marshmallow psycopg2 flask-mail flask-sslify

COPY ./app /home/app

CMD ["flask", "run", "--host=0.0.0.0"]