const ssUsers = SpreadsheetApp.openById(
  "<spreedshit_id>"
);
// const sheetFecha = ssUsers.getSheetByName('datosDesplegables');
const sheetlistadoUsuariosFinales = ssUsers.getSheetByName("listadoUsuarios");

const calendarioEventos = CalendarApp.getCalendarById(
  "<google_calendar_id>@group.calendar.google.com"
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
