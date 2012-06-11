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
                           activity_list=activity_list())


@app.route('/map')
def map():
    return render_template('map.html', title="MapOfGeorge")


@app.route('/SubmitActivity', methods=['GET', 'POST'])
def SubmitActivity():
    """ Take a http request and add activity to database

    """
    
    print "Submit Activity using method: ", request.method

    """
    if request.method != 'POST':
        print "SubmitActivity() - ERROR: Expected POST http request"
        return jsonify(result="error")
    """

    print "Request: ", request 
    #print "jsonify: ", jsonify(**request.json)
    print "json: ", request.json
    print "form: ", request.form['activity']
    print "json loads: ", json.loads( request.form['activity'] )
    '''
    print "get: ", request.args.get('activity')
    print "get str: ", request.args.get('activity', type=str)
    print "json loads: ", json.loads( request.form['activity'])
    print "json dumps: ", json.dumps( request.form['activity'])
    '''
    # Get the serialized activity JSON object
    # from the request

    #activity = request.args.get('activity', type=str)
    print "Raw activity: ", request.form['activity']

    #activity = simplejson.loads(request.form)[0]
    #activity = json.dumps(request.form['activity'] )
    #activity = json.dumps(request.form['activity'] )
    
    activity = json.loads( request.form['activity'] )

    print "SubmitActivity() - Recieved activity:", activity

    if activity == None:
        print "SubmitActivity() - ERROR: Input activity is 'None'"
        return jsonify(result="error")

    try:
        addActivityToDatabase(activity)
    except:
        print "SubmitActivity() - Caught exception in addActivityToDatabase"
        return jsonify(result="error")

    print "SubmitActivity() - Success"

    return jsonify(result="success")


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
        #activities.insert( activity )
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
    activity_list = activities.find().sort({_id:1}).limit( num_activities );
    return activity_list



def activity_list():
    list = []
    activity = { "name" : "bob", "borough" : "manhattan",
                 "address" : "123 fake street", "type" : "bar",
                 "map_link" : "bob.com" }
    list.append( activity)
    list.append( activity)
    list.append( activity)
    return list


if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.debug = True
    app.run(host='0.0.0.0', port=port)
    

