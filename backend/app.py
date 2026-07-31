import os
from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client
load_dotenv()
app = Flask(__name__)

CORS(app)
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)

TABLE = "applications"

# bearer token pull, used to attach to request headers when RLS would prevent someone who is not signed in to perform actions with RLS enabled.
# for create, update, and delete -- token is captured by react on login and stored in browser local storage which is used for sending requests related to protected actions
def get_client():
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user_client=create_client(SUPABASE_URL,SUPABASE_KEY)
        # attach user's Json web token to all outgoing http requests
        user_client.postgrest.auth(token)
        return user_client
    return supabase

# healthcheck
@app.get("/")
def health():
    return {"status": "ok"}

# read
@app.get("/api/applications")
def get_resources():
    res = supabase.table(TABLE).select("*").order("created_at").execute()
    return res.data, 200

# create
@app.post("/api/applications")
def create_item():
    client=get_client()
    data = request.get_json()
    res = client.table(TABLE).insert(data).execute()
    if not res.data:
        return {"error": "Unauthorized. Create item failed."}, 400
    return res.data[0], 200

# update
@app.route("/api/applications/<int:app_id>", methods=["PATCH"])
def update_item(app_id):
    client=get_client()
    data = request.get_json()
    res = client.table(TABLE).update(data).eq('id', app_id).execute()
    if not res.data:
        return {"error": "Unauthorized or item not found."}, 404
    return res.data[0], 200

# delete
@app.delete("/api/applications/<int:app_id>")
def delete_item(app_id):
    client=get_client()
    res = client.table(TABLE).delete().eq("id", app_id).execute()
    if not res.data:
        return {"error": "Unauthorized or item not found."}, 404
    return {"message": "Deleted successfully."}, 200

# sign up
@app.post("/api/signup")
def signup():
    auth_data = request.get_json()
    email = auth_data.get("email")
    password = auth_data.get("password")

    if not email or not password:
        return ({"error": "Email and password are required to sign up."}), 400
    if len(password)<6: 
        return ({"error": "Length of password must be at least 6 characters long."}), 400

    auth_response = supabase.auth.sign_up({
        "email": email,
        "password": password
    })
    if not auth_response.user:
        return ({"error": "Sign-up failed. Please try again."}), 400

    return ({
        "message": "User account successfully created.",
        "user": {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "created_at": auth_response.user.created_at
        }
    }), 201

# login
@app.post("/api/login")
def login():
    auth_data = request.get_json()
    email = auth_data.get("email")
    password = auth_data.get("password")

    if not email or not password:
        return ({"error": "Email and password are required."}), 400
     
    auth_response = supabase.auth.sign_in_with_password({
        "email": email,
        "password": password})
    return {
        "token": auth_response.session.access_token,
        "user": {
            "id": auth_response.user.id,
            "email": auth_response.user.email,
            "created_at": auth_response.user.created_at}} ,200

if __name__ == '__main__': 
    app.run(debug=True)