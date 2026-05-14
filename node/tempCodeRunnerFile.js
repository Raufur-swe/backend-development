const http = require("http");

const server = http.createServer((req, res) => {
  // console.log(req);
  // writting in node js :
  // res.write("<html>");
  // res.write("<head><title>Node js writting system</title></head>");
  // res.write("<body><p>Writting my first webpage through node js</p></body>");
  // res.write("</html>");
  // res.end();

  // routing:
  if (req.url == "/") {
    res.write("<html>");
    res.write("<body><p>This is home page</p></body>");
    res.write("</html>");
    return res.end();
  }else if(req.url =='/about'){
   res.write("<html>");
    res.write("<body><p>This is about page</p></body>");
    res.write("</html>");
    return res.end();
  } 
  else {
    res.write("<html>");
    res.write("<body><p>404 Not found </p></body>");
    res.write("</html>");
  }
});
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
