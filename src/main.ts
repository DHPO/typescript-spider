import {mongodb} from "./mongodb";
import server from "./server";
import spider from "./spider";

const main = async () => {
  await mongodb();
  console.log("db connect ok");
  await server();
  spider();
};

main();
