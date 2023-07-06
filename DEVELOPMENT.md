# Notes about the code

This project wound up demonstrating techniques for dealing with a ton of different things,
many of which made me bang my head against my desk for quite a while. Here are notes about
those things so future me doesn't go through all that pain again.

## Runtime environment variables with ReactJS and Docker images

Docker and environment variables go hand-in-hand. Being able to create a single image with
configuration via env vars is a great way to distribute your projects to others. But React?
React makes it hard because it is webpack'ed and essentially just static files served
at runtime. Any environment variables you might use via process.ENV are baked in to the
code as strings *at build time*, which makes them unchangeable with Docker configs.

The solution is to inject them into a small .js file when the Docker container starts.
There are several blog posts around that show ways to do this, but for the moment
I'm using the [example shown here](https://github.com/githubjakob/react-inject-env-docker-runtime).
