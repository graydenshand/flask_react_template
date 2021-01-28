FROM python

WORKDIR /home/app

# INSTALL PACKAGES
RUN python3 -m pip install flask 

COPY ./app /home/app

CMD ["flask", "run", "--host=0.0.0.0"]