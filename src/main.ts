import {mongodb} from "./mongodb";
import server from "./server";
import spider from "./spider";

const main = async () => {
  await mongodb();
  console.log("connect ok");
  await server();
  spider();
  console.log("done");
};

main();
