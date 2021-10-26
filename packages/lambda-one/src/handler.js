'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!ss',
        id: 1,
        input: event,
      },
      null,
      2
    ),
  };
};
