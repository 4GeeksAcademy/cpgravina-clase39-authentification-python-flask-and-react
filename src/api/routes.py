"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# Create a route to authenticate your users and return JWTs. The
# create_access_token() function is used to actually generate the JWT.


@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    print("\n\n\n")
    print(email)
    print(password)

    if email is None or password is None:
        return jsonify({"msg": "Bad username or password"}), 401

    user_query = User.query.filter_by(email=email)
    user = user_query.first()
    print(user)

    if user is None:
        return jsonify({"msg": "Bad username or password"}), 401
    if user.email != email or user.password != password:
        return jsonify({"msg": "Bad username or password"}), 401

    print("\n\n\n")
    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token)


# Protect a route with jwt_required, which will kick out requests
# without a valid JWT present.


@api.route("/current-user", methods=["GET"])
@jwt_required()
def get_current_user():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    print("\n\n\n")
    print(current_user_id)

    if current_user_id is None:
        return jsonify({"msg": "User not found"}), 401
    
    user_query = User.query.get(current_user_id)
    print(user_query)

    if user_query is None:
        return jsonify({"msg": "User not found"}), 401

    user = user_query.serialize()
    print(user)
    print("\n\n\n")
    return jsonify(current_user=user), 200 


@api.route('/people', methods=['GET'])
def handle_all_people():
    people_query = People.query.all()
    all_people = list(map(lambda x: x.serialize(), people_query))
    return jsonify(all_people), 200

@api.route('/people/<int:people_id>', methods=['GET'])
def handle_specific_people(people_id):
    people_query = People.query.get(people_id)
    people = people_query.serialize()
    response_body = {
        "msg": "ok",
        "result": people
    }
    return jsonify(response_body), 200

@api.route('/planets', methods=['GET'])
def handle_all_planets():
    planets_query = Planet.query.all()
    all_planets = list(map(lambda x: x.serialize(), planets_query))
    return jsonify(all_planets), 200

@api.route('/planets/<int:planet_id>', methods=['GET'])
def handle_specific_planet(planet_id):
    planet_query = Planet.query.get(planet_id)
    planet = planet_query.serialize()
    response_body = {
        "msg": "ok",
        "result": planet
    }
    return jsonify(response_body), 200

@api.route('/users', methods=['GET'])
def handle_all_users():
    users_query = User.query.all()
    all_users = list(map(lambda x: x.serialize(), users_query))
    return jsonify(all_users), 200

@api.route('/users/favorites', methods=['GET'])
def handle_users_favorites():
    users_query = User.query.all()
    all_users_favorites = list(map(lambda user: user.serialize(), users_query))
    return jsonify(all_users_favorites), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def handle_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    
    planet = Planet.query.get(planet_id)
    if not planet:
        return jsonify({"error": "Planet not found"}), 404
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if planet in user.favorite_planets:
        return jsonify({"message": "Planet is already in your favorites"}), 200
    
    user.favorite_planets.append(planet)
    db.session.commit()
    return jsonify(planet.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def handle_favorite_people(people_id):

    current_user_id = get_jwt_identity()
    
    people = People.query.get(people_id)
    if not people:
        return jsonify({"error": "People not found"}), 404
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if people in user.favorite_planets:
        return jsonify({"message": "People is already in your favorites"}), 200
    
    user.favorite_people.append(people)
    db.session.commit()
    return jsonify(people.serialize()), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    
    planet = Planet.query.get(planet_id)
    if not planet:
        return jsonify({"error": "Planet not found"}), 404
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.favorite_planets.remove(planet)
    db.session.commit()
    return jsonify(planet.serialize()), 200

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    
    people = People.query.get(people_id)
    if not people:
        return jsonify({"error": "People not found"}), 404
    
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    user.favorite_people.remove(people)
    db.session.commit()
    return jsonify(people.serialize()), 200

