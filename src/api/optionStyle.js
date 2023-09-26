export function createStyle(html){
  var stylee=document.createElement('style');
  stylee.type = 'text/css';
  stylee.innerHTML = html;
  document.getElementsByTagName('head').item(0).appendChild(stylee);
}