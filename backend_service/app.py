from hashlib import md5
import base64
from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import func
from flask_cors import CORS,cross_origin


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////home/greece/Desktop/backend_followup/site.db'
db = SQLAlchemy(app)
images_list = []


class AnalystsInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_key = db.Column(db.String(20), unique=True, nullable=False)
    analyst_name = db.Column(db.String(20), unique=True, nullable=False)
    is_adm = db.Column(db.Boolean, default=False, nullable=False)
    status = db.Column(db.Boolean, default=False)

class InformationType(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    activities = db.Column(db.String(20), nullable=False)
    registers = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

with app.app_context():
    db.create_all()


@app.route('/list_analysts', methods=['GET'])
def list_analysts():
    analysts = AnalystsInfo.query.all()
    all_analysts = [analyst.analyst_name for analyst in analysts]
    response = jsonify({'analysts': all_analysts})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return make_response(response, 200)

@app.route('/authenticate', methods=['POST'])
def authenticate():
    print('a')
    data = request.get_json()

    if 'user_key' not in data:
        response = jsonify({'error': 'Chave de usuário não inserida.'}),
        return make_response(response, 400)

    user_key = data['user_key']
   # user_key = md5(user_key.encode()).hexdigest()
    user = AnalystsInfo.query.filter_by(user_key=user_key).first()

    if user:
        response = jsonify({'verified': True, "is_adm": user.is_adm})
        return make_response(response, 200)
    
    else:
        response = jsonify({'verified': False})
        return make_response(response, 401)

@app.route('/information', methods=['GET','POST'])
def information():
    global images_list
    if request.method == "GET":
        current_day_information = InformationType.query.filter(db.func.strftime("%Y-%m-%d", InformationType.timestamp) == datetime.utcnow().date()).all()
        images = images_list
        data_list = [{'activity': info.activities, 'activity_registers': info.registers} for info in current_day_information]
        return make_response(jsonify({'information': data_list, "images": images}), 200)

    
    elif request.method == "POST":
        data = request.get_json()
        if (not data or 'activities' not in data or 'registers' not in data or 'analyst' not in data):
            response = jsonify({'error': 'Falta informação na requisição'})
            return make_response(response, 400)
        
        data_activities = data["activities"]
        data_registers = data["registers"]
        analyst = data["analyst"]
        images = data["images"]
        images_list.append(images)

        
        verify_activity = InformationType.query.filter_by(activities=data_activities).first()
        verify_analyst = AnalystsInfo.query.filter_by(analyst_name=analyst).first()

        if (verify_analyst):
            verify_analyst.status = True

        if (verify_activity):
            for registry in data_registers:
                verify_activity.registers = f"{verify_activity.registers}\n{registry}" if verify_activity.registers else registry
        else:
            data_registers = '\n'.join(data_registers)
            new_data = InformationType(activities=data_activities, registers=data_registers)
            db.session.add(new_data)
        
        db.session.commit()
        response = jsonify({'information': "Informações enviadas"})
        return make_response(response, 200)

    
@app.route('/get_status', methods=['GET'])
def get_status():
    users = AnalystsInfo.query.all()
    user_status = [{'analyst': user.analyst_name, 'status': user.status} for user in users]

    response = jsonify({'status': user_status})
    return make_response(response, 200)

@app.route('/ping', methods=['GET'])
def ping():
    return make_response(jsonify({'message': 'Aplicação funcionando!'}), 200)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
