# Uncomment the required imports before adding the code

from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from datetime import datetime
import logging
import json

from .populate import initiate

# Get an instance of a logger
logger = logging.getLogger(__name__)

# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("userName")
            password = data.get("password")

            if not username or not password:
                return JsonResponse({"error": "Username and password required"}, status=400)

            user = authenticate(username=username, password=password)

            if user:
                login(request, user)
                return JsonResponse({"userName": username, "status": "Authenticated"})
            else:
                return JsonResponse({"error": "Invalid credentials"}, status=401)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON"}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# Create a `logout_request` view to handle sign out request

@csrf_exempt
def logout_request(request):
    logout(request)  # Terminate user session
    data = {"userName": ""}  # Return empty username
    return JsonResponse(data)


# Create a `registration` view to handle sign up request
@csrf_exempt
def registration_request(request):
    context = {}

    if request.method == "POST":
        try:
            # Load JSON data from the request body
            data = json.loads(request.body)
            username = data.get("userName")
            password = data.get("password")
            first_name = data.get("firstName")
            last_name = data.get("lastName")
            email = data.get("email")

            username_exist = False

            try:
                # Check if user already exists
                User.objects.get(username=username)
                username_exist = True
            except User.DoesNotExist:
                logger.debug(f"{username} is a new user")

            # If it is a new user
            if not username_exist:
                # Create user in auth_user table
                user = User.objects.create_user(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    password=password,
                    email=email
                )
                # Login the user
                login(request, user)
                data = {"userName": username, "status": "Authenticated"}
                return JsonResponse(data)
            else:
                data = {"userName": username, "error": "Already Registered"}
                return JsonResponse(data, status=409)

        except Exception as e:
            logger.error(f"Error during registration: {e}")
            return JsonResponse({"error": "Registration failed"}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
#     ...


# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request, dealer_id):
#     ...


# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
#     ...


# Create a `add_review` view to submit a review
# def add_review(request):
#     ...
