import {
  simulation,
  scenario,
  exec,
  pause,
  constantUsersPerSec,
  rampUsersPerSec,
  atOnceUsers,
  nothingFor,
} from "@gatling.io/core";

import { http, status } from "@gatling.io/http";

const httpProtocol = http
  .baseUrl("https://api.clickup.com")
  .acceptHeader("application/json")
  .contentTypeHeader("application/json")
  .userAgentHeader("Gatling/3.x ClickUp LoadTest");

const getAuthorizedUser = scenario("GetAuthorizedUser").exec(
  http("GET /api/v2/user")
    .get("/api/v2/user")
    .header("Authorization", "pk_302462603_1XI8DMDJ143Z6Y9O643PPQH82LGRDQHK")          
    .check(
    status().in(200, 401)
    )
);

// Scenario 1 

export const spikeTest = simulation((setUp) => {
  setUp(
    getAuthorizedUser.injectOpen(
      constantUsersPerSec(10).during(20),   
      constantUsersPerSec(100).during(5),   
      constantUsersPerSec(10).during(20)    
    )
  ).protocols(httpProtocol);
});

//  Scenario 2 

export const rampUpTest = simulation((setUp) => {
  setUp(
    getAuthorizedUser.injectOpen(
      constantUsersPerSec(20).during(20),           
      rampUsersPerSec(20).to(100).during(30)        
    )
  ).protocols(httpProtocol);
});