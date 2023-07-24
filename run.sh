python3 -m pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
python3 manage.py runsslserver --cert ssl/cert.pem --key ssl/key.pem 0.0.0.0:30000