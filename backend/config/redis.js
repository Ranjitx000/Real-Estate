import { createClient } from "redis"; 

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("connected", () => {
    console.log("redisClient Connected", );

});
redisClient.on("error",(error)=>{
    console.log("redisClient Error", error);

})

await redisClient.connect();
export default redisClient;