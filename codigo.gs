const ssUsers = SpreadsheetApp.openById(
  "1V1KaYV-DS5X5Srrq24-GAMO_1sNIAXuuWrxsybeenLg"
);
// const sheetFecha = ssUsers.getSheetByName('datosDesplegables');
const sheetlistadoUsuariosFinales = ssUsers.getSheetByName("listadoUsuarios");

// Calendario de prueba
const calendarioEventos = CalendarApp.getCalendarById(
  "4c4f56155832a5a9c1f2577a9519b06f0e98d61f7a877372891b39a5e355bece@group.calendar.google.com"
);

const fechaHoy = new Date();
const fechaManiana = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1);
const fechaPasado = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 2);
const fechaUltima = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 3);

function doGet(e) {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Calendario");
}

function include(filenName) {
  return HtmlService.createHtmlOutputFromFile(filenName).getContent();
}

function obtenerAgentes() {
  let allUsersIni = sheetlistadoUsuariosFinales.getDataRange().getValues();
  let allUsersFinal = allUsersIni.filter((valor) => valor.includes("activo"));
  Logger.log(allUsersFinal);
  return allUsersFinal;
}

function obtenerEventosHOY() {
  const eventos = obtenerEventos(fechaHoy, fechaManiana);
  Logger.log(eventos);
  return eventos;
}

function obtenerEventosMANIANA() {
  const eventos = obtenerEventos(fechaManiana, fechaPasado);
  return eventos;
}

function obtenerEventosPASADO() {
  const eventos = obtenerEventos(fechaPasado, fechaUltima);
  return eventos;
}

function obtenerEventos(inicio, fin) {
  var listEvents = [];
  var listaEventos = calendarioEventos.getEvents(inicio, fin);

  //Logger.log(fechaHoy.toLocaleDateString());
  //Logger.log(listaEventos);

  for (i in listaEventos) {
    listEvents.push([
      listaEventos[i].getTitle(),
      listaEventos[i].getStartTime().toLocaleTimeString().slice(0, -3) +
        " to " +
        listaEventos[i].getEndTime().toLocaleTimeString().slice(0, -3),
    ]);
  }

  const unicos = [];
  for (var i = 0; i < listEvents.length; i++) {
    const elemento = JSON.stringify(listEvents[i]);
    if (!JSON.stringify(unicos).includes(elemento)) {
      unicos.push(listEvents[i]);
    }
  }
  return unicos;
}

function getUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}
