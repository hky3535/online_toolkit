# python3 manage.py runsslserver --cert ssl/cert.pem --key ssl/key.pem 0.0.0.0:8888
nohup python3 -u manage.py runsslserver --cert ssl/cert.pem --key ssl/key.pem 0.0.0.0:8888 > run.log 2>&1 &
