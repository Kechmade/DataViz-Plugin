# RawGraphs as a data visualization Plug-in for Archi.
What is it ?
This project is an extention to [Archi](https://github.com/archimatetool/archi) that allows generating dynamic plots and information graphics. It is designed for architects using the modelling technique Archimate with Archi. The Plug-in extracts automatically data from the set of concepts and relationships from the model [using the open source JavaScript SQL database [alaSQL](http://alasql.org/)] It offers different algorithms of data visualization to address the concerns of different stakeholders.

## Instructions

# Run Locally on your Machine from Archi.

In order to use dynamic data extraction directly from your model ( using alaSQL library).

Clone DataViz-Plugin from the command line or download the zip. 
$ git clone https://github.com/Kechmade/DataViz-Plugin

1 -  Put the content of the directory DataViz-Plugin in the (/Archi.app/plugins/com.archimatetool.reports_4.0.2.201706161020/templates/ ) subdirectory of Archi.


2 - Launch Archi and select a model.
In menu entries "File > Report > HTML" [This will ask you to create a repository where you want to store the content of RAW ( size ~48 Mo ) and it  will run an html page ]


2 - launch WebServer.exe from the directory chosen and note the Port where your server is running. 

3 - Go to localhost/raw.html from your web browser. 


Run Locally on your Machine independently from ARCHI.

Be sure you have the following requirements installed in order to run This version of Raw DataViz-Plugin locally in your machine :

# Run Locally on your Machine independantly from Archi.

You will only need the html subdirectory. 
1 - Rename raw.html to index.html
2 - Launch WebServer.exe and note the Port where your server is running. 
3 - Go to localhost from your web browser. 

Or from terminal: 
$ python -m SimpleHTTPServer 8080

Once this is running, go to localhost:8080  from your web browser. 

