module.exports = function renderIndexView(links) {
  let html = "<html><head><title>Scraped Links</title></head><body>";
  html += "<h1>Scraped Links</h1><ul>";
  links.forEach((link) => {
    html += `<li><a href="${link.url}">${link.text}</a></li>`;
  });
  html += "</ul></body></html>";
  return html;
};
