const DBDeBug = require("debug")("dbDeBugger");

const GetHomePage = (req, res) => {
  //این دیباگر در مسیر دریافت از صفحه اصلی است و با هر بار درخواست گت از مسیر
  //  اصلی فراخوانده میشود پس محل قرار گیری دیباگر مهم است
  DBDeBug("DB is ....");
  res.send("Hello from JVD ");
}

module.exports={
GetHomePage
}