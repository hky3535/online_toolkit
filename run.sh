# python3 manage.py runsslserver --cert ssl/cert.pem --key ssl/key.pem 0.0.0.0:30000
nohup python3 -u manage.py runsslserver --cert ssl/cert.pem --key ssl/key.pem 0.0.0.0:30000 > run.log 2>&1 &
