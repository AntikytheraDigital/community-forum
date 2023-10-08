# Community Forum
## Docker Usage
The containers must be run in the same network, you can create a network by running:
```docker network create community-forum``` this network should then be used when
running containers with ```--net community-forum```.
### Running the App
First build the container from the app directory:
```docker build -t community-forum-app .```

To run the container: 

```docker run -p 3005:3005 --net community-forum -e SERVER_URL="http://server:3000" --name app community-forum-app```

Note: SERVER_URL is set in the above example, but this can be changed as needed. 


### Running the Server
First build the container from the server directory:
```docker build -t community-forum-server .```

Then you must set environment variables for the server to use when running the container:
- `ATLAS_URI`
- `SESSION_KEY`

This can be done by either defining the .env file: ```--env-file .env```

Or by using the ```-e``` flag to set each variable individually. For example:
```-e ATLAS_URI=<url> -e SESSION_KEY=<key>```

Note: The variables APP_URL and SERVER_URL should also be set using the ```-e``` flag. These are not in the .env file, but should be set in the command line. 
- `APP_URL`
- `SERVER_URL`

To run the container with .env file (must be in the directory of the .env file):

```docker run -p 3000:3000 --net community-forum -e APP_URL="http://app:3005" --env-file .env --name server community-forum-server```

To run the container with env variables set individually (replace `<url>` and `<key>`):

```docker run -p 3000:3000 --net community-forum -e ATLAS_URI=<url> -e SESSION_KEY=<key> -e APP_URL="http://app:3005" --name server community-forum-server```

note: APP_URL is set in the above examples above but you can change it to a different value as needed 
