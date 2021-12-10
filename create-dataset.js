import fetch from "node-fetch";

const html = await fetch(
  "http://thecinnaman.com/pumpkin-olive-oil-and-orange-cake/"
).then((x) => x.text());
