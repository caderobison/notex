#!/bin/bash
# This is a quick script to unpack the frontend repo and send it to the server
echo Moving frontend files...

# move frontend files here
cp frontend/* /usr/share/tomcat/webapps/ROOT

echo Moving backend files...

# move backend files here
rm /usr/share/tomcat/webapps/ROOT/WEB-INF/classes/*.java
cp backend/classes/* /usr/share/tomcat/webapps/ROOT/WEB-INF/classes
cp backend/lib/* /usr/share/tomcat/webapps/ROOT/WEB-INF/lib
cp backend/web.xml /usr/share/tomcat/webapps/ROOT/WEB-INF/web.xml

echo Compiling backend...

# compile backend here
cd /usr/share/tomcat/webapps/ROOT/WEB-INF/classes
rm *.class
javac -cp ../../../../lib/servlet-api.jar:../lib/* *.java

echo Restarting server...

# restart the server
systemctl restart tomcat

echo Deploy complete!
