#!/usr/bin/env python

import os

import json
#import simplejson

from flask import Flask
from flask import url_for
from flask import render_template
from flask import request
from flask import jsonify

import pymongo

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', title="SummerOfGeorge")


@app.route('/activities')
def activities():

    return render_template('activities.html', title="ActivitiesOfGeorge", 
                           activity_list=getActivityList())


@app.route('/map')
def map():
    return render_template('map.html', title="MapOfGeorge")


@app.route('/RefreshActivityList', methods=['GET', 'POST'])
def RefreshActivityList( ):
    """ Render the html activity list and return

    """
    num_activities = int(request.form['num_activities'])
    activity_list = getActivityList(num_activities)
    activity_list_html =  render_template("activity_list.html", 
                                          activity_list=activity_list)
    return jsonify( success="success", html=activity_list_html)


@app.route('/SubmitActivity', methods=['GET', 'POST'])
def SubmitActivity():
    """ Take a http request and add activity to database

    """
    
    print "SubmitActivity() - Begin"

    if request.method != 'POST':
        print "SubmitActivity() - ERROR: Expected POST http request"
        return jsonify(success="error")

    # Get the serialized activity JSON object
    # from the request
    activity = json.loads( request.form['activity'] )

    if activity == None:
        print "SubmitActivity() - ERROR: Input activity is 'None'"
        return jsonify(success="error")

    try:
        addActivityToDatabase(activity)
    except:
        print "SubmitActivity() - Caught exception in addActivityToDatabase"
        return jsonify(success="error")

    print "SubmitActivity() - Success"

    return jsonify(success="success")


def connectToDatabase():
    """ Get a handle on the db object

    """
    try:
        connection = pymongo.Connection()
    except:
        print "connectToDatabase() - Failed to open connect to MongoDB"
        raise

    try:
        db = connection['summer_of_george']
    except:
        print "connectToDatabase() - Failed to connect to summer_of_george db"
        raise

    return db


def addActivityToDatabase( activity ):
    """ Add an activity (dict) to the database

    """

    print "addActivityToDatabase() - Adding Activity:", activity, activity.__class__.__name__

    try:
        db = connectToDatabase()
    except:
        print "addActivityToDatabase() - Error: Failed to connect to database"
        raise

    # Check if the 'activities' collection exists:
    if not 'activities' in db.collection_names():
        print "addActivityToDatabase() - ERROR: 'activities' collection doesn't exist"
        raise Exception("Collection Doesn't Exist in Database")

    try:
        activities = db['activities']
    except:
        print "addActivityToDatabase() - Failed to connect to 'activities' collection"
        raise

    try:
        activities.save( activity )
    except:
        print "addActivityToDatabase() - Error: Failed to add activity to database"
        raise

    return


def getActivityList( num_activities=10 ):
    """ Get a list of activities (at most num_activities)

    """
    db = connectToDatabase()
    activities = db['activities']
    activity_list = activities.find().limit( num_activities ).sort("_id", -1);
    return activity_list



if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.debug = True
    app.run(host='0.0.0.0', port=port)
    

