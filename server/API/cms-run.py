# coding=utf-8
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

"""------------------------------------------------------------------------------------------------------------------"""

"""                                   Copyright © 2015-2017 Thought Grains Solutions.                                """

"""                                               All Rights Reserved.                                               """

"""                                                                                                                  """

"""             This software is the confidential and proprietary information of Thought Grains Solutions.           """

"""                                          (Confidential Information)                                              """

"""  --------------------------------------------------------------------------------------------------------------  """

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

"""                                                                                                                  """

"""   File Name   :   cms-run.py                                                                                     """

"""   Description :   cms-run.py                                                                                     """

"""                                                                                                                  """

"""   Date :   20/05/2016                                          Created By  :   Thoughtgrains Solutions           """

""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

import os
import uuid
import re
import random
import os.path
import email.utils
import subprocess as sp
import simplejson as json
from datetime import datetime
from email.mime.text import MIMEText
import smtplib
from werkzeug import secure_filename
from cassandra.cluster import Cluster
from flask_cors import CORS
from flask_cqlalchemy import CQLAlchemy
from flask_httpauth import HTTPBasicAuth
from passlib.apps import custom_app_context as pwd_context
from flask import Flask, abort, request, jsonify, json, g, send_from_directory
from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

config = json.loads(open('ipconfig.json').read())
cassandra_HOST = config['cassandra_HOST']

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'dreamwalk'
app.config['CASSANDRA_HOSTS'] = [cassandra_HOST]
app.config['protocol_version '] = 3
app.config['CASSANDRA_KEYSPACE'] = "tg_cms"
app.config['CQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'obj', 'docx', 'doc'}
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['DOWNLOAD_FOLDER'] = 'downloads/'


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']


db = CQLAlchemy(app)
auth = HTTPBasicAuth()
CORS(app)
db.sync_db()

cluster = Cluster([cassandra_HOST])
session = cluster.connect()

session.execute(
    "CREATE KEYSPACE IF NOT EXISTS tg_cms WITH replication = {'class': 'SimpleStrategy','replication_factor' : 3}")

db.sync_db()


class Users(db.Model):
    __tablename__ = 'users'
    userid = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    username = db.columns.Text(required=False, index=True)
    password = db.columns.Text(required=False, index=True)
    role = db.columns.Text(required=False)
    firstname = db.columns.Text(required=False)
    lastname = db.columns.Text(required=False)
    email = db.columns.Text(required=False, index=True)
    gender = db.columns.Text(required=False)
    city = db.columns.Text(required=False)
    country = db.columns.Text(required=False)
    postcode = db.columns.Text(required=False)
    phone = db.columns.Text(required=False)
    createdon = db.columns.DateTime(required=False)
    password_change = db.columns.Integer(required=False, default=0)

    def hash_password(self, password):
        self.password = pwd_context.encrypt(password)

    def verify_password(self, password):
        return pwd_context.verify(password, self.password)

    def generate_auth_token(self, expiration=84600):
        s = Serializer(app.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'userid': str(self.userid)})

    @staticmethod
    def verify_auth_token(token):
        global data
        s = Serializer(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            abort(401)  # valid token, but expired
        except BadSignature:
            return None  # invalid token
        return Users.objects().allow_filtering().get(userid=data['userid'])


class Projects(db.Model):
    __tablename__ = 'projects'
    id = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    userid = db.columns.UUID(required=False, index=True)
    projectname = db.columns.Text(required=False, index=True)
    ui_projectname = db.columns.Text(required=False)
    projectstatus = db.columns.Text(required=False)
    projectdetails = db.columns.Text(required=False)
    projectstartdate = db.columns.DateTime(required=False)
    projectcompletiondate = db.columns.DateTime(required=False)
    projectauthor = db.columns.Text(required=False)


class Models(db.Model):
    __tablename__ = 'models'
    id = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    userid = db.columns.UUID(required=False, index=True)
    projectname = db.columns.Text(required=False, index=True)
    modelname = db.columns.Text(required=False, index=True)
    ui_modelname = db.columns.Text(required=False)
    ui_fieldname = db.columns.Text(required=False)
    fieldname = db.columns.Text(required=False, index=True)
    fieldtype = db.columns.Text(required=False, index=True)
    fieldrequired = db.columns.Text(required=False)
    fieldoptions = db.columns.Text(required=False)
    fielddatatype = db.columns.Text(required=False)


class Pages(db.Model):
    __tablename__ = 'pages'
    id = db.columns.UUID(primary_key=True, default=uuid.uuid4)
    userid = db.columns.UUID(required=False, index=True)
    pagename = db.columns.Text(required=False, index=True)
    projectname = db.columns.Text(required=False, index=True)
    modelname = db.columns.Text(required=False)
    fieldname = db.columns.Text(required=False)
    fieldvalue = db.columns.Text(required=False)
    fieldtype = db.columns.Text(required=False)
    fieldoptions = db.columns.Text(required=False)
    fielddatatype = db.columns.Text(required=False)
    leftposition = db.columns.Text(required=False)
    topposition = db.columns.Text(required=False)
    fieldwidth = db.columns.Text(required=False)
    fieldheight = db.columns.Text(required=False)
    inputvalue = db.columns.Text(required=False)


db.sync_db()


@auth.verify_password
def verify_password(username, password):
    # first try to authenticate by token
    username = str(request.form['username'])
    password = str(request.form['password'])
    if not username:
        abort(400)  # username is empty
    user = Users.verify_auth_token(username)
    if not user:
        # try to authenticate with username/password
        try:
            user = Users.objects().allow_filtering().get(username=username)
        except Exception:
            pass
        if not user or not user.verify_password(password):
            abort(406)
    user.save()
    g.user = user
    return True


@app.route('/api/register', methods=['POST'])
def new_user():
    check_if_exist = None
    username = str(request.form['username'])
    password = str(request.form['password'])
    firstname = str(request.form['firstname'])
    lastname = str(request.form['lastname'])
    gender = str(request.form['gender'])
    city = str(request.form['city'])
    country = str(request.form['country'])
    postcode = str(request.form['postcode'])
    emailid = str(request.form['email'])
    phone = str(request.form['phone'])
    if username:
        try:
            check_if_exist = Users.objects().allow_filtering().filter(username=username).first()
        except Exception:
            pass
        if check_if_exist is not None:
            return jsonify({"error": "username already exists"}), 406

    try:
        check_if_exist = Users.objects().allow_filtering().filter(email=emailid).first()
    except Exception:
        pass
    if check_if_exist is not None:
        return jsonify({"emailerror": "emailid already exists"}), 409

    users_tab = Users(username=username)
    users_tab.hash_password(password)
    users_tab.firstname = firstname
    users_tab.lastname = lastname
    users_tab.email = emailid
    users_tab.gender = gender
    users_tab.city = city
    users_tab.country = country
    users_tab.postcode = postcode
    users_tab.phone = phone
    users_tab.createdon = datetime.now()
    users_tab.save()

    return jsonify({'status': 'success', 'userid': users_tab.userid}), 201


@app.route("/api/forgotpassword", methods=['POST'])
def forgot_password():
    emailid = str(request.form['email'])
    pin = random.randint(999, 9999)
    print(pin)

    try:
        user = Users.objects().allow_filtering().get(email=emailid)
    except Exception:
        return jsonify({"error": "incorrect email"}), 404

    user.hash_password(str(pin))
    user.password_change = 1
    user.save()

    msg = MIMEText("""
    Dear """ + user.username + """,

    The password for your account has been reset.

    Your new password is: """ + str(pin) + """

    For security reasons kindly visit User Profile page. If you have questions, write to info@thoughtgrains.com .

    Thank you,
    Team Thoughtgrains""")

    msg['To'] = emailid
    msg['From'] = email.utils.formataddr(('Thoughtgrains', 'info@thoughtgrains.com'))
    msg['Subject'] = 'Reset Your Password'

    server = smtplib.SMTP(host='ns1.cp-32.webhostbox.net', port='465')
    server.login('info@thoughtgrains.com', 'thoughtgrains@123')
    server.set_debuglevel(True)

    server.sendmail('info@thoughtgrains.com', [emailid], msg.as_string())

    return jsonify({"success": "Email has been sent"}), 201


@app.route('/api/changepassword', methods=['POST'])
@auth.login_required
def change_password():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    new_password = request.form["newpassword"]

    try:
        user = Users.objects().allow_filtering().get(userid=userid)
    except Exception:
        return jsonify({"error": "incorrect userid"})
    user.hash_password(new_password)
    user.password_change = 0
    user.save()

    return jsonify({"success": "Password changed successfully"}), 201


@app.route('/api/login', methods=['POST'])
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(84600)

    return jsonify({'token': token.decode('ascii'), 'passwordrequest': g.user.password_change})


@app.route('/api/addproject', methods=['POST'])
@auth.login_required
def add_project():
    proj_name = None
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    ui_projectname = (str(request.form['ui_projectname'])).replace("'", "")
    project_name = str(request.form['projectname']).replace("'", "")
    project_status = str(request.form['projectstatus'])
    project_details = str(request.form['projectdetails']).replace("'", "")
    project_start_date = request.form['projectstartdate']

    try:
        project_start_date = datetime.strptime(project_start_date, "%Y-%m-%d").date()
    except Exception:
        pass

    project_completion_date = request.form['projectcompletiondate']
    try:
        project_completion_date = datetime.strptime(project_completion_date, "%Y-%m-%d").date()
    except Exception:
        pass
        project_completion_date = None

    project_author = str(request.form['projectauthor']).replace("'", "")

    if not ui_projectname or not project_start_date:
        abort(400)

    if ui_projectname:

        try:
            proj_name = Projects.objects().allow_filtering().filter(projectname=project_name).first()
        except Exception:
            pass

        if proj_name is not None:
            return jsonify({"status": "duplicate"}), 409

        session.execute("CREATE KEYSPACE " + project_name + " WITH replication " +
                        "= {'class':'SimpleStrategy', 'replication_factor':3};")

    new_project = Projects(projectname=project_name)
    new_project.userid = userid
    new_project.ui_projectname = ui_projectname
    new_project.projectstatus = project_status
    new_project.projectdetails = project_details
    new_project.projectstartdate = project_start_date
    new_project.projectcompletiondate = project_completion_date
    new_project.projectauthor = project_author
    new_project.save()

    return jsonify({'status': 'Added', "ProjectID": new_project.id}), 201


@app.route('/api/getproject', methods=['POST'])
@auth.login_required
def get_projects():
    username = str(request.form['username'])
    projects = Users.verify_auth_token(username)
    user_id = projects.userid
    pageno = 1
    num_of_rec = 1000
    prev_pagecount = (pageno - 1) * num_of_rec
    response_text = []
    projects_tab = Projects.objects().allow_filtering().filter(userid=user_id)
    i = 0

    for projects in projects_tab:
        i += 1
        if i <= prev_pagecount:
            continue
        response_text.append(
            {'id': str(projects.id), "ui_projectname": projects.ui_projectname, "projectname": projects.projectname,
             "projectstatus": projects.projectstatus, "projectdetails": projects.projectdetails,
             "projectstartdate": projects.projectstartdate,
             "projectcompletiondate": projects.projectcompletiondate,
             "projectauthor": projects.projectauthor})
    sorted_list = sorted(response_text, key=lambda k: k['ui_projectname'])
    return jsonify({"Projects": sorted_list})


@app.route('/api/getprojectbyid', methods=['POST'])
@auth.login_required
def get_projectid():
    username = str(request.form['username'])
    projects = Users.verify_auth_token(username)
    user_id = projects.userid
    id = str(request.form['id'])
    pageno = 1
    num_of_rec = 1000
    prev_page_count = (pageno - 1) * num_of_rec
    response_text = []
    projects_tab = Projects.objects().allow_filtering().filter(id=id, userid=user_id)
    i = 0

    for projects in projects_tab:
        i += 1
        if i <= prev_page_count:
            continue
        response_text.append(
            {'id': str(projects.id), "ui_projectname": projects.ui_projectname, "projectname": projects.projectname,
             "projectstatus": projects.projectstatus, "projectdetails": projects.projectdetails,
             "projectstartdate": projects.projectstartdate,
             "projectcompletiondate": projects.projectcompletiondate,
             "projectauthor": projects.projectauthor})
    return jsonify({"Projects": response_text})


@app.route('/api/editproject', methods=['POST'])
@auth.login_required
def edit_project():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    project_id = str(request.form['id'])
    ui_projectname = ''
    project_status = ''
    project_details = ''
    project_start_date = ''
    project_completion_date = ''
    project_author = ''

    try:
        ui_projectname = str(request.form['ui_projectname']).replace("'", "")
    except:
        pass

    try:
        project_status = str(request.form['projectstatus'])
    except:
        pass

    try:
        project_details = str(request.form['projectdetails']).replace("'", "")
    except:
        pass

    try:
        project_start_date = request.form['projectstartdate']
        try:
            project_start_date = datetime.strptime(project_start_date, "%Y-%m-%d").date()
        except Exception:
            pass
    except Exception:
        pass

    try:
        project_completion_date = request.form['projectcompletiondate']
        try:
            project_completion_date = datetime.strptime(project_completion_date, "%Y-%m-%d").date()
        except Exception:
            pass
    except Exception:
        pass

    try:
        project_author = str(request.form['projectauthor']).replace("'", "")
    except:
        pass

    if not id:
        abort(400)

    verify_user = Projects.objects().allow_filtering().filter(id=project_id, userid=userid)
    if verify_user:
        edit_proj = Projects.objects().allow_filtering().get(id=project_id)
        edit_proj.id = project_id
        if ui_projectname:
            edit_proj.ui_projectname = ui_projectname
        if project_status:
            edit_proj.projectstatus = project_status
        if project_details:
            edit_proj.projectdetails = project_details
        if project_start_date:
            edit_proj.projectstartdate = project_start_date
        if project_completion_date:
            edit_proj.projectcompletiondate = project_completion_date
        if project_author:
            edit_proj.projectauthor = project_author
        edit_proj.save()

        return jsonify({'status': 'Updated', "ProjectID": edit_proj.id}), 201
    else:
        abort(400)


@app.route('/api/deleteproject', methods=['POST'])
@auth.login_required
def delete_project():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectid = str(request.form['id'])

    verify_user = Projects.objects().allow_filtering().filter(id=projectid, userid=userid)
    if verify_user:
        delete_proj = Projects.objects().allow_filtering().get(id=projectid)
        proj_model_tab = (
            session.execute(
                "SELECT id FROM tg_cms.models WHERE projectname =" "'" + delete_proj.projectname + "'" " LIMIT 1;"))
        if proj_model_tab == list():

            pageid = Pages.objects().allow_filtering().filter(projectname=delete_proj.projectname)

            for id in pageid:
                session.execute("DELETE FROM tg_cms.pages WHERE id =" + str(id.id) + ";")

            session.execute("DROP KEYSPACE " + str(delete_proj.projectname) + " ")

            delete_proj = Projects(id=projectid)
            delete_proj.delete()
            return jsonify({'status': 'Deleted', "ProjectID": delete_proj.id}), 201
        else:
            return jsonify({'status': "Couldn't delete, models exists"}), 403
    else:
        abort(400)


@app.route('/api/projectdownload', methods=['POST'])
@auth.login_required
def file_download():
    keyspace = request.form['projectname']

    child = sp.Popen("python cassandradump.py --keyspace " + keyspace + " --export-file " + keyspace + ".cql ",
                     shell=True, cwd="downloads")
    rc = child.communicate()[0]

    return jsonify({"childoutput": rc, "path": "http://localhost:10101/downloads/" + keyspace + ".cql"})


@app.route('/downloads/<filename>')
def downloaded_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)


@app.route('/api/getmodel', methods=['POST'])
@auth.login_required
def get_model():
    username = str(request.form['username'])
    models = Users.verify_auth_token(username)
    userid = models.userid
    projectname = str(request.form['projectname'])
    pageno = 1
    num_of_rec = 1000
    prev_pagecount = (pageno - 1) * num_of_rec
    response_text = []
    models_tab = Models.objects().allow_filtering().filter(projectname=projectname, userid=userid)
    i = 0
    for models in models_tab:
        i += 1
        if i <= prev_pagecount:
            continue
        response_text.append({'id': str(models.id), "ui_modelname": models.ui_modelname, "modelname": models.modelname,
                              "projectname": models.projectname})
    sorted_list = sorted(response_text, key=lambda k: k['modelname'])
    return jsonify({"Models": sorted_list})


@app.route('/api/addmodel', methods=['post'])
@auth.login_required
def add_model():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    keyspace = request.form['projectname']
    ui_modelname = request.form['modelname'].replace("'", "")
    modelname = ui_modelname.replace(" ", "").lower()
    modelname = modelname.replace("'", "")
    projectname = request.form['projectname']
    field_obj = json.loads(request.form["fieldobj"])
    count = len(field_obj)
    create_tab = ""
    insert_mod = ""
    ui_field_names = ""
    field_names = ""
    field_types = ""
    field_data_types = ""
    field_options = ""
    field_required = ""
    field_length = len(field_obj)
    first_nextchar = ","
    sec_nextchar = "#"
    i = 1

    session.set_keyspace(keyspace)
    if count == 1:
        for temp in field_obj:
            fieldname = temp['fieldname'].replace(" ", "").lower()
            fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
            fieldname = fieldname.replace("'", "")
            ui_fieldname = temp['fieldname'].replace("'", "")
            create_tab = fieldname + " " + temp['fielddatatype']
            insert_mod = "'" + ui_fieldname + "'" "," "'" + fieldname + "'" "," "'" + temp['fieldtype'] + "'" "," "'" + \
                         temp[
                             'fieldrequired'] + "'" "," "'" + temp['fieldoptions'].replace("'", "") + "'" ", " "'" + \
                         temp[
                             'fielddatatype'] + "'" ""
    else:
        for temp in field_obj:
            if i == field_length:
                first_nextchar = ""
                sec_nextchar = ""
            fieldname = temp['fieldname'].replace(" ", "").lower()
            fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
            fieldname = fieldname.replace("'", "")
            ui_fieldname = temp['fieldname'].replace("'", "")
            create_tab = create_tab + fieldname + " " + temp['fielddatatype'] + first_nextchar
            ui_field_names = ui_field_names + ui_fieldname + sec_nextchar
            field_names = field_names + fieldname + sec_nextchar
            field_types = field_types + temp['fieldtype'] + sec_nextchar
            field_required = field_required + temp['fieldrequired'] + sec_nextchar
            field_options = field_options + temp['fieldoptions'].replace("'", "") + sec_nextchar
            field_data_types = field_data_types + temp['fielddatatype'] + sec_nextchar
            i += 1
        insert_mod = "'" + ui_field_names + "'" "," "'" + field_names + "'," + "'" + field_types + "'," + "'" + field_required + "'," + "'" + field_options + "'," + "'" + field_data_types + "'"
    try:
        session.execute("CREATE TABLE " + modelname + "(IID UUID PRIMARY KEY," + create_tab + ");")
    except Exception as e:
        return jsonify({"error": str(e)})

    try:
        session.set_keyspace("tg_cms")
        session.execute(
            "INSERT INTO models (id , userid, ui_modelname, modelname , projectname , ui_fieldname , fieldname ,fieldtype , fieldrequired,fieldoptions, fielddatatype) VALUES (uuid ()," + str(
                userid) + ", " "'" + ui_modelname + "'" ", " "'" + modelname + "'" "," "'" + projectname + "'" "," + insert_mod + ");")
    except Exception as e:
        return jsonify({"error": str(e)})

    return jsonify({"success": "200"}), 201


@app.route('/api/getmodelbyid', methods=['POST'])
@auth.login_required
def get_modelid():
    username = str(request.form['username'])
    models = Users.verify_auth_token(username)
    userid = models.userid
    modelid = str(request.form['id'])
    keyspace = str(request.form['projectname'])
    modelname = str(request.form['modelname']).replace(" ", "").lower()
    modelname = re.sub('[^a-zA-Z0-9 \n\.]', '', modelname)
    pageno = 1
    num_of_rec = 1000
    prev_pagecount = (pageno - 1) * num_of_rec
    response_text = []
    models_tab = (session.execute("SELECT iid FROM " + keyspace + "." + modelname + " LIMIT 1;"))

    mod_tab = Models.objects().allow_filtering().filter(id=modelid, userid=userid)
    i = 0

    for models in mod_tab:
        i += 1
        if i <= prev_pagecount:
            continue
        if models_tab == list():
            response_text.append(
                {'id': str(models.id), "projectname": models.projectname, "ui_modelname": models.ui_modelname,
                 "modelname": models.modelname, "ui_fieldname": models.ui_fieldname,
                 "fieldname": models.fieldname, "fieldtype": models.fieldtype,
                 "fieldrequired": models.fieldrequired, "fieldoptions": models.fieldoptions,
                 "fielddatatype": models.fielddatatype, "recordexist": "0"})
        else:
            response_text.append(
                {'id': str(models.id), "projectname": models.projectname, "ui_modelname": models.ui_modelname,
                 "modelname": models.modelname, "ui_fieldname": models.ui_fieldname,
                 "fieldname": models.fieldname, "fieldtype": models.fieldtype,
                 "fieldrequired": models.fieldrequired, "fieldoptions": models.fieldoptions,
                 "fielddatatype": models.fielddatatype, "recordexist": "1"})
    return jsonify({"fields": response_text})


@app.route('/api/editmodel', methods=['POST'])
@auth.login_required
def edit_model():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    modelid = str(request.form['id'])
    projectname = request.form['projectname']
    keyspace = projectname
    ui_modelname = request.form['modelname'].replace("'", "")
    modelname = ui_modelname.replace(" ", "").lower()
    modelname = re.sub('[^a-zA-Z0-9 \n\.]', '', modelname)
    modelname = modelname.replace("'", "")
    old_modelname = request.form['oldmodelname']
    session.set_keyspace("system")
    field_obj = json.loads(request.form["fieldobj"])
    ## for cassandra 2x ###
    #mod_length = [session.execute(
    #     "SELECT column_name FROM schema_columns WHERE keyspace_name=" "'" + keyspace + "'" "  AND columnfamily_name = " "'" + old_modelname + "'" ";")]
    ####
    mod_length = session.execute("SELECT * FROM " + keyspace + "." + old_modelname + " LIMIT 1; ")
    prev_mod_length = len(mod_length[0]) - 1
    field_obj_length = len(field_obj)
    first_nextchar = ","
    sec_nextchar = "#"
    i = 1
    create_tab = ""
    ui_field_names = ""
    field_names = ""
    field_types = ""
    field_data_types = ""
    field_options = ""
    field_required = ""

    verify_user = Models.objects().allow_filtering().filter(id=modelid, userid=userid)
    if verify_user:
        mod_tab = (session.execute("SELECT iid FROM " + keyspace + "." + old_modelname + " LIMIT 1;"))
        if mod_tab == list():
            session.set_keyspace(keyspace)
            session.execute("DELETE FROM tg_cms.models WHERE id=" + modelid + ";")
            session.execute("DROP TABLE " + old_modelname + ";")
            if field_obj_length == 1:
                for temp in field_obj:
                    fieldname = temp['fieldname'].replace(" ", "").lower()
                    fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
                    fieldname = fieldname.replace("'", "")
                    ui_fieldname = temp['ui_fieldname']
                    create_tab = fieldname + " " + temp['fielddatatype']
                    insert_mod = "'" + ui_fieldname + "'" "," "'" + fieldname + "'" "," "'" + temp[
                        'fieldtype'] + "'" "," "'" + temp[
                                     'fieldrequired'] + "'" "," "'" + temp['fieldoptions'].replace("'",
                                                                                                   "") + "'" ", " "'" + \
                                 temp[
                                     'fielddatatype'] + "'" ""
            else:
                for temp in field_obj:
                    if i == field_obj_length:
                        first_nextchar = ""
                        sec_nextchar = ""
                    ui_fieldname = temp['ui_fieldname'].replace("'", "")
                    fieldname = temp['fieldname'].replace(" ", "").lower()
                    fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
                    fieldname = fieldname.replace("'", "")
                    create_tab = create_tab + fieldname + " " + temp['fielddatatype'] + first_nextchar
                    ui_field_names = ui_field_names + ui_fieldname + sec_nextchar
                    field_names = field_names + fieldname + sec_nextchar
                    field_types = field_types + temp['fieldtype'] + sec_nextchar
                    field_required = field_required + temp['fieldrequired'] + sec_nextchar
                    field_options = field_options + temp['fieldoptions'].replace("'", "") + sec_nextchar
                    field_data_types = field_data_types + temp['fielddatatype'] + sec_nextchar
                    i += 1
                insert_mod = "'" + ui_field_names + "'," + "'" + field_names + "'," + "'" + field_types + "'," + "'" + field_required + "'," + "'" + field_options + "'," + "'" + field_data_types + "'"
            try:
                session.execute("CREATE TABLE " + modelname + "(IID UUID PRIMARY KEY," + create_tab + ");")
            except Exception as e:
                return jsonify({"error": str(e)})

            try:
                session.set_keyspace("tg_cms")
                session.execute(
                    "INSERT INTO models (id , userid, ui_modelname, modelname , projectname , ui_fieldname , fieldname ,fieldtype , fieldrequired,fieldoptions, fielddatatype) VALUES (" + str(
                        modelid) + "," + str(
                        userid) + ", " "'" + ui_modelname + "'" ", " "'" + modelname + "'" "," "'" + projectname + "'" "," + insert_mod + ");")
            except Exception as e:
                return jsonify({"error": str(e)})

            return jsonify({"success": "200"}), 201
        elif field_obj_length > prev_mod_length:
            for temp in field_obj[prev_mod_length:]:
                fieldname = temp['fieldname'].replace(" ", "").lower()
                fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
                fieldname = fieldname.replace("'", "")
                try:
                    session.execute("ALTER TABLE " + keyspace + "." + old_modelname + " ADD " + fieldname + " " + temp[
                        'fielddatatype'] + ";")
                except Exception as e:
                    return jsonify({"error": str(e)})
            for temp in field_obj:
                if i == field_obj_length:
                    sec_nextchar = ""
                fieldname = temp['fieldname'].replace(" ", "").lower()
                fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
                fieldname = fieldname.replace("'", "")
                ui_fieldname = temp['ui_fieldname'].replace("'", "")
                ui_field_names = ui_field_names + ui_fieldname + sec_nextchar
                field_names = field_names + fieldname + sec_nextchar
                field_types = field_types + temp['fieldtype'] + sec_nextchar
                field_data_types = field_data_types + temp['fielddatatype'] + sec_nextchar
                field_options = field_options + temp['fieldoptions'].replace("'", "") + sec_nextchar
                field_required = field_required + temp['fieldrequired'] + sec_nextchar
                i += 1

                session.execute(
                    "INSERT INTO tg_cms.models (id , userid, ui_modelname, modelname , projectname , ui_fieldname , fieldname ,fieldtype , fieldrequired,fieldoptions, fielddatatype) VALUES ( " + str(
                        modelid) + "," + str(
                        userid) + ", " "'" + ui_modelname + "'" ", " "'" + old_modelname + "'" " , " "'" + projectname + "'" ", " "'" + ui_field_names + "'" "  ," "'" + field_names + "'" " , " "'" + field_types + "'" " , " "'" + field_required + "'" " , " "'" + field_options + "'" " , " "'" + field_data_types + "'" ");")

        elif field_obj_length == prev_mod_length:
            for temp in field_obj:
                if temp['old_fielddatatype'] != temp['fielddatatype']:
                    return jsonify({"error": "Couldn't Edit Entries Exists"}), 406
                else:
                    if i == field_obj_length:
                        sec_nextchar = ""
                    fieldname = temp['fieldname'].replace(" ", "").lower()
                    fieldname = re.sub('[^a-zA-Z0-9 \n\.]', '', fieldname)
                    fieldname = fieldname.replace("'", "")
                    ui_fieldname = temp['ui_fieldname'].replace("'", "")
                    ui_field_names = ui_field_names + ui_fieldname + sec_nextchar
                    field_names = field_names + fieldname + sec_nextchar
                    field_types = field_types + temp['fieldtype'] + sec_nextchar
                    field_data_types = field_data_types + temp['fielddatatype'] + sec_nextchar
                    field_options = field_options + temp['fieldoptions'].replace("'", "") + sec_nextchar
                    field_required = field_required + temp['fieldrequired'] + sec_nextchar
                    i += 1
                    try:
                        session.execute(
                            "INSERT INTO tg_cms.models (id , userid, ui_modelname, modelname , projectname , ui_fieldname , fieldname ,fieldtype , fieldrequired,fieldoptions, fielddatatype) VALUES ( " + str(
                                modelid) + "," + str(
                                userid) + ", " "'" + ui_modelname + "'" ", " "'" + old_modelname + "'" " , " "'" + projectname + "'" ", " "'" + ui_field_names + "'" " ," "'" + field_names + "'" " , " "'" + field_types + "'" " , " "'" + field_required + "'" " , " "'" + field_options + "'" " , " "'" + field_data_types + "'" ");")
                    except Exception as e:
                        return jsonify({"error": str(e)})
        else:
            return jsonify({"success": "200"}), 201
    else:
        abort(400)
    return jsonify({"success": "200"}), 201


@app.route('/api/deletemodelfield', methods=['POST'])
@auth.login_required
def delete_field():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    modelname = request.form['modelname']
    modelid = request.form['id']
    keyspace = request.form['projectname']
    fieldname = request.form['fieldname']
    removeid = int(request.form['removeid'])

    verify_user = Models.objects().allow_filtering().filter(id=modelid, userid=userid)
    if verify_user:
        session.set_keyspace(keyspace)
        session.execute("ALTER TABLE " + modelname + " DROP " + fieldname + " ;")
        modtable = json.dumps(session.execute("SELECT * FROM tg_cms.models WHERE id = " + modelid + ""))
        modtable = json.loads(modtable)
        mod_tab = (session.execute("SELECT iid FROM " + keyspace + "." + modelname + " LIMIT 1;"))
        if mod_tab == list():
            for temp in modtable:
                fieldname = temp["fieldname"].split('#')
                field_name_len = len(fieldname) - 1
                fieldname[removeid] = ''
                if removeid == field_name_len:
                    new_field_name = '#'.join(fieldname[:-1])
                else:
                    new_field_name = '#'.join(fieldname)

                fieldtype = temp["fieldtype"].split('#')
                fieldtype_len = len(fieldtype) - 1
                fieldtype[removeid] = ''
                if removeid == fieldtype_len:
                    new_fieldtype = '#'.join(fieldtype[:-1])
                else:
                    new_fieldtype = '#'.join(fieldtype)

                fieldrequired = temp["fieldrequired"].split('#')
                fieldrequired_len = len(fieldrequired) - 1
                fieldrequired[removeid] = ''
                if removeid == fieldrequired_len:
                    new_fieldrequired = '#'.join(fieldrequired[:-1])
                else:
                    new_fieldrequired = '#'.join(fieldrequired)

                fieldoptions = temp["fieldoptions"].split('#')
                fieldoptions_len = len(fieldoptions) - 1
                fieldrequired[removeid] = ''
                if removeid == fieldoptions_len:
                    new_fieldoptions = '#'.join(fieldoptions[:-1])
                else:
                    new_fieldoptions = '#'.join(fieldoptions)

                field_datatype = temp["fielddatatype"].split('#')
                field_datatype_len = len(field_datatype) - 1
                field_datatype[removeid] = ''
                if removeid == field_datatype_len:
                    new_field_datatype = '#'.join(field_datatype[:-1])
                else:
                    new_field_datatype = '#'.join(field_datatype)

                session.execute(
                    "INSERT INTO tg_cms.models (id , modelname , projectname , fieldname ,fieldtype , fieldrequired, fieldoptions, fielddatatype) VALUES (" + str(
                        modelid) + "," "'" + temp["modelname"] + "'" "," "'" + temp[
                        "projectname"] + "'" "," "'" + new_field_name + "'" "," "'" + new_fieldtype + "'" "," "'" + new_fieldrequired + "'" "," "'" + new_fieldoptions + "'" "," "'" + new_field_datatype + "'" ");")

            return jsonify({"succuss": "updated"}), 201
        else:

            return jsonify({"error": "Couldn't edit"}), 406
    else:
        abort(400)


@app.route('/api/deletemodel', methods=['POST'])
@auth.login_required
def delete_model():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    modelid = request.form['id']
    keyspace = str(request.form['projectname'])

    verify_user = Models.objects().allow_filtering().filter(id=modelid, userid=userid)
    if verify_user:
        model = Models.objects().allow_filtering().get(id=modelid)
        mod_table = (session.execute("SELECT iid FROM " + keyspace + "." + model.modelname + " LIMIT 1;"))
        if mod_table == list():
            session.set_keyspace(keyspace)
            session.execute("DROP TABLE " + model.modelname + " ;")
            session.execute("DELETE FROM tg_cms.models WHERE id=" + modelid + ";")
            return jsonify({"status": "Deleted"}), 201
        else:
            return jsonify({"error": "Couldn't delete"}), 406
    else:
        abort(400)


@app.route('/api/listentry', methods=['POST'])
@auth.login_required
def list_entry():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    modelname = request.form['modelname']
    projectname = request.form['projectname']
    keyspace = request.form['projectname']
    sorted_list = ''

    session.set_keyspace(keyspace)
    plan = Models.objects().allow_filtering().filter(projectname=projectname, modelname=modelname, userid=userid)
    if plan:
        list_model = session.execute("""SELECT * FROM """ + modelname + """;""")
        sorted_list = sorted(list_model, key=lambda k: k[1])
        # json.dumps(sorted_list)
    else:
        abort(400)
    return jsonify({"Entries": sorted_list})


@app.route('/api/getmodelfields', methods=['POST'])
@auth.login_required
def get_modelfields():
    username = str(request.form['username'])
    models = Users.verify_auth_token(username)
    userid = models.userid
    projectname = str(request.form['projectname'])
    modelname = str(request.form['modelname'])
    pageno = 1
    num_of_rec = 1000
    prev_pagecount = (pageno - 1) * num_of_rec
    response_text = []
    models_tab = Models.objects().allow_filtering().filter(projectname=projectname, modelname=modelname, userid=userid)
    i = 0
    for models in models_tab:
        i += 1
        if i <= prev_pagecount:
            continue
        response_text.append({'id': str(models.id), "modelname": models.modelname, "projectname": models.projectname,
                              "ui_fieldname": models.ui_fieldname, "fieldname": models.fieldname,
                              "fieldtype": models.fieldtype,
                              "fieldrequired": models.fieldrequired, "fieldoptions": models.fieldoptions,
                              "fielddatatype": models.fielddatatype})

    return jsonify({"columns": response_text})


@app.route('/api/addentry', methods=['POST'])
@auth.login_required
def add_entry():
    modelname = request.form['modelname']
    keyspace = request.form['projectname']
    fieldkeys = json.loads(request.form["fieldkeys"])
    fieldvalues = json.loads(request.form["fieldvalues"])
    filedatatype = json.loads(request.form["filedatatype"])
    j = 0

    session.set_keyspace(keyspace)
    entryid = uuid.uuid4()

    for types in filedatatype:

        if types['fileDataType'] == "int":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", " + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of int")})

        elif types['fileDataType'] == "bigint":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of bigint")})

        elif types['fileDataType'] == "blob":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", textAsBlob('"'' + fieldvalues[j]['FieldVals'] + ''"'));")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str(e)})

        elif types['fileDataType'] == "boolean":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of boolean")})

        elif types['fileDataType'] == "decimal":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of decimal")})

        elif types['fileDataType'] == "double":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of double")})

        elif types['fileDataType'] == "float":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of float")})

        elif types['fileDataType'] == "text":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of text")})

        elif types['fileDataType'] == "timestamp":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of timestamp")})

        elif types['fileDataType'] == "uuid":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", " + str(fieldvalues[j]['FieldVals']) + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of uuid")})

        elif types['fileDataType'] == "varchar":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of varchar")})

        elif types['fileDataType'] == "varint":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception as e:
                session.execute("DELETE FROM " + modelname + " WHERE iid=" + str(entryid) + " ;")
                return jsonify({"error": str("Invalid value for type of varint")})
        j += 1

    try:
        filefields = json.loads(request.form['filefields'])

        for files in filefields:
            file = request.files[files]

            if file and not allowed_file(file.filename):
                return jsonify({"error": "invalid file type"}), 406
            elif file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                savefilename = (keyspace + '-' + modelname + '-' + filename)
                p = "uploads/" + savefilename + " "
                if os.path.isfile(p):
                    return jsonify({"error": "file already exist"}), 409
                else:
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], savefilename))
    except Exception:
        pass

    return jsonify({"success": "Added"}), 201


@app.route('/api/geteditentryfields', methods=['POST'])
@auth.login_required
def get_editentryfields():
    username = str(request.form['username'])
    models = Users.verify_auth_token(username)
    userid = models.userid
    keyspace = request.form['projectname']
    entryid = request.form['entryid']
    projectname = str(request.form['projectname'])
    modelname = str(request.form['modelname'])
    pageno = 1
    num_of_rec = 1000
    prev_pagecount = (pageno - 1) * num_of_rec
    response_text = []

    session.set_keyspace(keyspace)

    models_tab = Models.objects().allow_filtering().filter(projectname=projectname, modelname=modelname, userid=userid)
    i = 0
    for models in models_tab:
        i += 1
        if i <= prev_pagecount:
            continue

        entry_list = session.execute("SELECT * FROM " + modelname + " WHERE iid= " + entryid + " ;")
        entries = entry_list[0]

        response_text.append({'id': str(models.id), "entryid": str(entryid), "modelname": models.modelname,
                              "ui_modelname": models.ui_modelname,
                              "projectname": models.projectname,
                              "ui_fieldname": models.ui_fieldname, "fieldname": models.fieldname,
                              "fieldtype": models.fieldtype,
                              "fieldrequired": models.fieldrequired, "fieldoptions": models.fieldoptions,
                              "fielddatatype": models.fielddatatype})

        return jsonify({"Entries": entries, "Columns": response_text})


@app.route('/api/editentry', methods=['POST'])
@auth.login_required
def edit_entry():
    modelname = request.form['modelname']
    keyspace = request.form['projectname']
    count = request.form['count']
    entryid = request.form['entryid']
    dupfieldkeys = request.form["fieldkeys"].replace("'", "")
    fieldkeys = json.loads(request.form["fieldkeys"])
    fieldvalues = json.loads(request.form["fieldvalues"])
    filedatatype = json.loads(request.form["filedatatype"])
    nextchar = ","
    fieldvalue = ""
    i = 1
    j = 0
    fieldvalues_len = len(fieldvalues)

    session.set_keyspace(keyspace)

    for types in filedatatype:

        if types['fileDataType'] == "int":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", " + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of int")})

        elif types['fileDataType'] == "bigint":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of bigint")})

        elif types['fileDataType'] == "blob":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", textAsBlob('"'' + fieldvalues[j]['FieldVals'] + ''"'));")
            except Exception:
                return jsonify({"error": str(e)})

        elif types['fileDataType'] == "boolean":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of boolean")})

        elif types['fileDataType'] == "decimal":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of decimal")})

        elif types['fileDataType'] == "double":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of double")})

        elif types['fileDataType'] == "float":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of float")})

        elif types['fileDataType'] == "text":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception:
                return jsonify({"error": str("Invalid value for type of text")})

        elif types['fileDataType'] == "timestamp":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception:
                return jsonify({"error": str("Invalid value for type of timestamp")})

        elif types['fileDataType'] == "uuid":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ", " + str(fieldvalues[j]['FieldVals']) + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of uuid")})

        elif types['fileDataType'] == "varchar":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + ",'"'' + fieldvalues[j]['FieldVals'] + ''"');")
            except Exception:
                return jsonify({"error": str("Invalid value for type of varchar")})

        elif types['fileDataType'] == "varint":
            try:
                session.execute("INSERT INTO " + modelname + " (iid, " + fieldkeys[j]['fieldKey'] + ") VALUES (" + str(
                    entryid) + "," + fieldvalues[j]['FieldVals'] + ");")
            except Exception:
                return jsonify({"error": str("Invalid value for type of varint")})
        j += 1

    try:
        filefields = json.loads(request.form['filefields'])

        for files in filefields:
            file = request.files[files]

            if file and not allowed_file(file.filename):
                return jsonify({"error": "invalid file type"}), 406
            elif file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                save_filename = (keyspace + '-' + modelname + '-' + filename)
                path = "uploads/" + save_filename + " "
                if os.path.isfile(path):
                    return jsonify({"error": "file already exist"}), 409
                else:
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], save_filename))
    except Exception:
        pass

    return jsonify({"success": "updated"}), 201


@app.route('/api/deleteentry', methods=['POST'])
@auth.login_required
def delete_entry():
    modelname = request.form['modelname']
    iid = request.form['entryid']
    keyspace = request.form['projectname']

    session.set_keyspace(keyspace)
    session.execute("DELETE FROM " + modelname + " WHERE iid=" + iid + " ;")

    return jsonify({"status": "Deleted"}), 201


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.route('/api/addpages', methods=['POST'])
@auth.login_required
def add_pages():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    pagename = str(request.form['pagename']).replace("'", "")
    response_text = []

    try:
        page_name = Pages.objects().allow_filtering().filter(pagename=pagename, projectname=projectname,
                                                             userid=userid).first()
    except Exception:
        return jsonify({"status": "duplicate"}), 409

    if page_name is not None:
        return jsonify({"status": "duplicate"}), 409

    new_page = Pages(projectname=projectname)
    new_page.userid = userid
    new_page.pagename = pagename
    new_page.save()

    response_text.append({"Pages": "Added", "pageid": new_page.id, "pagename": pagename})

    return jsonify({"Pages": response_text}), 201


@app.route('/api/deletepages', methods=['POST'])
@auth.login_required
def delete_pages():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    pageid = str(request.form['pageid'])

    verify_user = Pages.objects().allow_filtering().filter(id=pageid, userid=userid, projectname=projectname)
    if verify_user:
        delete_page = Pages(id=pageid)
        delete_page.delete()
        return jsonify({'status': 'Deleted', "ProjectID": delete_page.id}), 201

    else:
        abort(400)

    return jsonify({"Status": "Deleted"}), 201


@app.route('/api/getpages', methods=['POST'])
@auth.login_required
def get_pages():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    response_text = []

    get_page = Pages.objects().allow_filtering().filter(userid=userid, projectname=projectname)

    for pages in get_page:
        response_text.append(
            {"pagename": pages.pagename, "pageid": pages.id, "userid": userid})

    return jsonify({"Pages": response_text}), 201


@app.route('/api/loadpagefield', methods=['POST'])
@auth.login_required
def load_pagefield():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    pageid = str(request.form['pageid'])
    response_text = []

    get_page = Pages.objects().allow_filtering().filter(id=pageid, projectname=projectname, userid=userid)

    for pages in get_page:
        response_text.append(
            {"pagename": pages.pagename, "pageid": pages.id, "userid": userid, "fieldname": pages.fieldname,
             "fielddatatype": pages.fielddatatype, "fieldoptions": pages.fieldoptions, "fieldtype": pages.fieldtype,
             "fieldvalue": pages.fieldvalue, "leftposition": pages.leftposition, "topposition": pages.topposition,
             "fieldwidth": pages.fieldwidth, "fieldheight": pages.fieldheight, "inputvalue": pages.inputvalue})

    return jsonify({"Pages": response_text}), 201


@app.route('/api/addpagefield', methods=['POST'])
@auth.login_required
def add_pagefield():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    pageid = str(request.form['pageid'])
    pagename = str(request.form['pagename'])
    field_obj = json.loads(request.form["fieldobj"])
    field_obj_length = len(field_obj)
    i = 1
    field_names = ""
    field_types = ""
    field_data_types = ""
    field_options = ""
    field_values = ""
    left_position = ""
    top_position = ""
    width_position = ""
    height_position = ""
    input_values = ""
    sec_nextchar = "#"

    if field_obj_length == 1:
        for temp in field_obj:
            leftpos = temp['leftposition']
            leftpos = str(leftpos)
            toppos = temp['topposition']
            toppos = str(toppos)
            widthpos = temp['fieldwidth']
            widthpos = str(widthpos)
            heightpos = temp['fieldheight']
            heightpos = str(heightpos)
            fieldval = temp['fieldvalue']
            fieldval = fieldval.encode('ascii', 'ignore').replace("'", "")
            insert_page = "'" + temp['fieldname'].replace("'", "") + "'" "," "'" + fieldval + "'" "," "'" + temp[
                'fieldtype'] + "'" "," "'" + temp['fieldoptions'].replace("'", "") + "'" "," "'" + temp[
                              'fielddatatype'] + "'" "," "'" + leftpos + "'" "," "'" + toppos + "'" "," "'" + widthpos + "'" "," "'" + heightpos + "'" "," "'" + \
                          fieldval + "'"
    else:
        for temp in field_obj:
            if i == field_obj_length:
                sec_nextchar = ""

            leftpos = temp['leftposition']
            leftpos = str(leftpos)
            toppos = temp['topposition']
            toppos = str(toppos)
            widthpos = temp['fieldwidth']
            heightpos = temp['fieldheight']
            heightpos = str(heightpos)
            widthpos = str(widthpos)
            fieldval = temp['fieldvalue']
            fieldval = fieldval.encode('ascii', 'ignore').replace("'", "")
            field_names = field_names + temp['fieldname'].replace("'", "") + sec_nextchar
            field_values = field_values + fieldval.replace("'", "") + sec_nextchar
            field_types = field_types + temp['fieldtype'].replace("'", "") + sec_nextchar
            field_options = field_options + temp['fieldoptions'].replace("'", "") + sec_nextchar
            field_data_types = field_data_types + temp['fielddatatype'] + sec_nextchar
            left_position = left_position + leftpos + sec_nextchar
            top_position = top_position + toppos + sec_nextchar
            width_position = width_position + widthpos + sec_nextchar
            height_position = height_position + heightpos + sec_nextchar
            input_values = input_values + temp['inputvalue'].replace("'", "") + sec_nextchar
            i += 1
        insert_page = "'" + field_names + "'" "," "'" + field_values + "'" ","  "'" + field_types + "'" "," "'" + field_options + "'" "," "'" + field_data_types + "'" "," "'" + left_position + "'" "," "'" + top_position + "'" "," "'" + width_position + "'" ",""'" + height_position + "'" "," "'" + input_values + "'"

    try:
        session.set_keyspace("tg_cms")
        session.execute(
            "INSERT INTO pages (id , pagename, userid, projectname, fieldname, fieldvalue, fieldtype, fieldoptions, fielddatatype, leftposition, topposition, fieldwidth, fieldheight, inputvalue) VALUES (" + str(
                pageid) + "," "'" + pagename + "'" "," + str(
                userid) + "," "'" + projectname + "'" "," + insert_page + ");")
    except Exception as e:
        return jsonify({"error": str(e)})

    return jsonify({"Status": "Success"}), 201


@app.route('/api/linkmodel', methods=['POST'])
@auth.login_required
def link_model():
    username = str(request.form['username'])
    user = Users.verify_auth_token(username)
    userid = user.userid
    projectname = str(request.form['projectname'])
    fieldtype = str(request.form['fieldtype'])
    response_text = []

    models_tab = Models.objects().allow_filtering().filter(userid=userid, projectname=projectname)

    for models in models_tab:
        fieldtype_hash_sep = models.fieldtype.split('#')
        fieldname_hash_sep = models.fieldname.split('#')
        uifieldname_hash_sep = models.ui_fieldname.split('#')
        fieldoptions_hash_sep = models.fieldoptions.split('#')
        fielddatatype_hash_sep = models.fielddatatype.split('#')
        if fieldtype in fieldtype_hash_sep:
            index = fieldtype_hash_sep.index(fieldtype)
        for i, j in enumerate(fieldtype_hash_sep):
            if j == fieldtype:
                field_name = fieldname_hash_sep[i]
                uifield_name = uifieldname_hash_sep[i]
                field_type = fieldtype_hash_sep[i]
                field_options = fieldoptions_hash_sep[i]
                field_datatype = fielddatatype_hash_sep[i]
                response_text.append(
                    {"modelname": models.modelname, "ui_modelname": models.ui_modelname, "modelid": models.id,
                     "fieldtype": field_type,
                     "fieldname": field_name, "ui_fieldname": uifield_name,
                     "fieldoptions": field_options, "fielddatatype": field_datatype})

    return jsonify({"Status": "Success", "Models": response_text}), 201


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10101)
