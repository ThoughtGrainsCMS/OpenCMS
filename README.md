# OpenCMS

# SERVER:
1) Make sure that you are having Python 2.7.12 and running Cassandra 3.0.9
2) Install visual C++ for python(VCForPythin27.msi). from https://www.microsoft.com/en-us/download/confirmation.aspx?id=44266 
3) Set System variable for Python.
4) Run Cassandra (cassandra -f)
5) Go to the working file directory(i.e TG_CMS --> server --> API ) in command prompt. 
6) Run requirements.txt: pip install -r requirements.txt 
7) In ipconfig.json under TG-CMS-->server-->API set your cassandra_HOST ip. 
8) Open command prompt and run : python cms-run.py 

# Front-End: 
1) Install pycharm or similar editors which has build in application server.
2) Go to the working file directory(i.e TG_CMS --> ui --> static ) in Editor. 
2) Run index.html(we recommend to use Google Chrome).