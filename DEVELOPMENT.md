<!-- omit in toc -->

# Notes about the code

This project wound up demonstrating techniques for dealing with a ton of different things,
many of which made me bang my head against my desk for quite a while. Here are notes about
those things so future me doesn't go through all that pain again.

<!-- toc -->

- [Notes about the code](#notes-about-the-code)
  - [Runtime environment variables with ReactJS and Docker images](#runtime-environment-variables-with-reactjs-and-docker-images)
  - [Running a .sh file as a Docker ENTRYPOINT with Docker for Windows](#running-a-sh-file-as-a-docker-entrypoint-with-docker-for-windows)
  - [Deploying with Docker - SSL configuration](#deploying-with-docker---ssl-configuration)
    - [The server](#the-server)
    - [The client](#the-client)
  - [Setting up react-leaflet](#setting-up-react-leaflet)
  - [Developing with Visual Studio Code](#developing-with-visual-studio-code)
  - [Hiding folders that shouldn't be shown in the file explorer](#hiding-folders-that-shouldnt-be-shown-in-the-file-explorer)
  - [Showing folders that shouldn't be hidden in the file explorer](#showing-folders-that-shouldnt-be-hidden-in-the-file-explorer)
    - [Debugging client and server at the same time](#debugging-client-and-server-at-the-same-time)

## Runtime environment variables with ReactJS and Docker images

Docker and environment variables go hand-in-hand. Being able to create a single image with
configuration via env vars is a great way to distribute your projects to others. But React?
React makes it hard because it is webpack'ed and essentially just static files served
at runtime. Any environment variables you might use via process.ENV are baked in to the
code as strings _at build time_, which makes them unchangeable with Docker configs.

The solution is to inject them into a small .js file when the Docker container starts.
There are several blog posts around that show ways to do this, but for the moment
I'm using the [example shown here][env-docker-runtime].

While this does work it is _super sensitive_ to paths. Make sure the Dockerfile
creates the folder where the docker-entrypoint.sh file will live in the final image.
Make sure the script writes the env_vars.js file to the same folder where the Dockerfile
put the compiled React app. I lost a lot of time getting this working due to
mismatched file locations.

## Running a .sh file as a Docker ENTRYPOINT with Docker for Windows

Turns out that it's not as simple as just adding the .sh file to your Docker image
and referencing it as the `ENTRYPOINT` in your Dockerfile. Why? Because of line endings.

Seriously.

If you get an error starting up the image saying the .sh file can't be found, even though
it is _clearly_ in the image, it's because the line endings are Windows-style (CRLF) and
simply won't work. They have to be Unix-style (LF).

To fix this in Visual Studio Code open the .sh file and in the bottom right of the
status bar click on `CRLF` and change it to `LF`. Beware though! Git has a setting
to auto-set line endings based on the OS you're using. This needs to be disabled for
whatever your .sh file is in your repo otherwise Git might change it back to CRLF on you!

To disable it use a `.gitattributes` file with a line similar to this:

```
client/docker-entrypoint.sh text eol=lf
```

An example is available in the root folder of this repo.

## Deploying with Docker - SSL configuration

Both the client and the server need to be running over HTTPS. Technically they could run
over HTTP however mobile browsers block geolocation unless the site was served over HTTPS.
Since the primary use of this site is on mobile setting up SSL was a requirement.

A sample `docker-compose.yml` with all the appropriate configurations for this is
available in the `deployment` folder.

### The server

The server is easy since I have full control over the setup of ExpressJS and the
Docker image published to the repository doesn't need any modifications.

The code for starting up the server checks to see if SSL files are present in the `/certs`
folder and if so uses them to start the http server. This code is in [startServer()](server/src/server.mts).
The docker-compose.yml file simply has to mount a volume to `/certs` with a `privkey.pem`
and `fullchain.pem` file.

### The client

This is a bit more complicated. The client is webpacked and runs using nginx. It's
not enough to map a volume with the certs, the Docker image itself needs to be modified
to add an nginx config file.

This is done using a deployment Dockerfile that references the published client image
and simply copies in a `nginx.conf` file to `/etc/nginx/conf.d/nginx.conf`. The path
and name of this file is important and there are a LOT of random stackoverflow
and blog posts out there that use the wrong ones. A sample, working, `nginx.conf`
file is available in the `deployment` folder.

The docker-compose.yml file uses this Dockerfile to start the client image, with
the certs mounted as a volume to `/etc/nginx/ssl`. As with the server image the
certificate files should be named `privkey.pem` and `fullchain.pem`.

## Setting up react-leaflet

The core map is rendered using react-leaflet. Honestly it was one of the easiest parts
of this project. I used the [example shown here][react-leaflet-app-demo] to get started.

[env-docker-runtime]: https://github.com/githubjakob/react-inject-env-docker-runtime
[react-leaflet-app-demo]: https://github.com/ugwutotheeshoes/react-leaflet-app-demo

## Developing with Visual Studio Code

This repo is an example of a (small) monorepo and using VSCode workspaces. The workspace
file in `.vscode/access-code-map.code-workspace` defines the project hierarchy to display
in VSCode and hides folders that aren't useful in the editor.

## Hiding folders that shouldn't be shown in the file explorer

To hide files in a workspace add them to the workspace settings block, _not_ a settings
block inside each of the `folders` section. The paths to the files to hide are _relative
to the workspace root, not the location of the `.vscode/access-code-map.code-workspace`.
This took me forever to figure out. For example using `../server/node_modules` will not work. It has to be `server/node_modules` instead.

## Showing folders that shouldn't be hidden in the file explorer

By default VSCode hides `.gitattributes` files. This is normally fine but given the
pain I had with `docker-entrypoint.sh` (see above) it seems important to see that file
in VSCode.

To make it appear it can also be added to the `files.exclude` setting for the workspace.
Simply set the value to `false` to make it show, overriding the VSCode default.

### Debugging client and server at the same time

There is a workspace-wide `launch.json` that contains the single launch configuration
to start up Microsoft Edge pointed to the client URL. The way to force it to use the
Edge Dev install instead of production Edge is adding `"runtimeExecutable": "dev"`
to the configuration.

The launch config references two tasks in the project-wide `tasks.json` file to
build and run the client and server code. The client requires custom problem matchers,
based on the existing `$ts-checker-webpack-watch` problem matcher, to detect the
start and end of build and eslint verification. Without that VSCode doesn't know when
the build finished. The server build task can simply use `$tsc-watch` since there's no
webpack involved. Another reason to hate webpack...

Even with the above I was still having trouble getting debugging to work. Things would build
but I couldn't figure out how to get the debugger to attach. The magic is to tell vscode
to auto-attach the debugger, which is specified in the workspace file:

```javascript
    "debug.javascript.autoAttachFilter": "smart"
```

I'm sure there's a way to explicitly make attaching work in the launch.json config but
it wasn't worth trying to figure out when auto attach works fine.
