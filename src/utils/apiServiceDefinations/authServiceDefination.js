// ==================== SERVICE DEFINITIONS ====================

import HttpRequest from "../apiServices/HttpRequest";

const authServiceDefination = {
  // GET /users
  signup: (data, options) => {
    const { id, filter, limit } = data;

    const request = new HttpRequest()
      .setMethod("GET")
      .setUrl(`/api/users/${id}`)
      .setParams({ filter, limit })
      .build();

    return request;
  },

  // POST /users
  postUser: (data, options) => {
    const { id, notify, ...body } = data;

    const request = new HttpRequest()
      .setMethod("POST")
      .setUrl(`/api/users/${id}`)
      .setParams({ notify })
      .setBody(body)
      .setRequireAuth()
      .build();

    return request;
  },
};

export default authServiceDefination;
