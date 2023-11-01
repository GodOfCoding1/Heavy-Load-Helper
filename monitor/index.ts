import { controlServer } from "@godofcoding/heartbeat/src";

const server = controlServer();

server.listen(3000, () => {
  console.log("Server started on port 3000");
});
