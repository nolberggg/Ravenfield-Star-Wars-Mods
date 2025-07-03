const fetch = (...args) =>
    import('node-fetch').then(({default: fetch}) => fetch(...args));
  
  exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  
    const body = JSON.parse(event.body);
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwXTa5lFois4-Zdj21W0DatrpUH1UdWqoz2dxipkQ0r72Rs4kb0aBscLLy3vaQ8pwzu/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
  
    const result = await response.text();
  
    return {
      statusCode: 200,
      body: result,
    };
  };
  