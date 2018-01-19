# Proyect GOM

As it mentions above, also has an image editor, with a streamer socket.io where you can see with many navs open that the editions sync properly as the main user that is editing the image. Has a gallery too, were you can see the images that it has been uploaded to the server.<br>
<br>
<h3>Intructions</h3>
After download the app, you can execute it with NodeJs prev installed (if its not, you should do it):<br>
* Make sure that MongoDB and RoboMongo is installed, so you can execute it within cmd with the proper command from the directory were mongodb is:<br>
<strong>mongod --port 27017 --bind_ip_all</strong><br>
<br>
* After doing it, you can launch it without any problem with NodeJs with the next command within the directory were server.js is located:<br>
<strong>npm start</strong>
<br>
<br>
<br>
Any comments, just let me know :) <br>
<strong>PD:</strong> In some future, I will fix the facebook login issue, due MongoDB does not accept more than 1 info saved with null values, so, for the moment, only twitter is able to login, thanks.