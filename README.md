# Heavy-Load-Helper
A prototype idea that aims to redirect and store heavy requests till resources become available and they can be processed. This helps prevent cascading failure in applications with heavy load

## How it worksd
- Add a middleware to your server that checks the cpu and ram available.
- If cpu or ram is below the threshold given in config redirects the request to a monitor server.
- Monitor server stores the request then redirects it to a server under the same service when there is sufficient resourse in the server.
- Monitor server pings all the servers in the network then checks its availability and redirects a request to the server, if pending requests are avalable.

## How to run
- ``` docker compose up ```
- By deault 2 servers under the same app_name will boot up.
- By sending multiple requests to /heavy endpoint of one server it gets overloaded, so the next requests will be redirected to the other server under the same app_name.
