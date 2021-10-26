'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 300,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!sssdsd',
        id: 1,
        input: event,
      },
      null,
      2
    ),
  };
};
