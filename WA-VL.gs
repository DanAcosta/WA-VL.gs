// Generales
const valueToCheckEnviosVL = sheetEnvios.getRange('BB1').getValue();
const dan = '5215554545301'
//const salo = '5215559895500'
const vapelab = '5215617202964'

function WAVL() {
  if (valueToCheckEnviosVL > 0) {
    if (!shouldRunTrigger()) return;
    WAVL1() // On-Hold
    WAVL2() // Pending
    WAVL3() // Procesando
    WAVL4() // Completado
    WAVL5() // Cancelado
    WAVL6() // Refunded
    WAVL7() // Failed
    WAVL8() // Hr Update
    // WAVL9() //
  }
}

function shouldRunTrigger() {
  var date = new Date();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var timezone = spreadsheet.getSpreadsheetTimeZone();
  date = Utilities.formatDate(date, timezone, 'yyyy/MM/dd HH:mm:ss');
  var hours = new Date(date).getHours();
  var hrentrada = 5; // Cambio en la hora de entrada
  var hrsalida = 6; // Cambio en la hora de salida

  console.log(date)
  console.log(hours)

  if (hours >= hrentrada && hours <= hrsalida) {
    console.log('No Corre por horarios') // Cambio en el mensaje de consola
    return false; // Cambio en el retorno cuando no está dentro del rango permitido
  } else {
    console.log('Si Corre') // Cambio en el mensaje de consola
    return true; // Cambio en el retorno cuando está dentro del rango permitido
  }
}

function join(t, a, s) {
  function format(m) {
    let f = new Intl.DateTimeFormat('en', m);
    return f.format(t);
  }
  return a.map(format).join(s);
}


// ON-HOLD local o foraneo
function WAVL1() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    var a = [{ day: 'numeric' }, { month: 'short' }, { year: '2-digit' }];
    var date = join(Fecha, a, '-') + ' ' + Hora
    var orderdate = new Date(date)

    var now = new Date()
    var FechaInMS = orderdate.getTime()
    var add = 5 * 60 * 1000
    var minslater = FechaInMS + add
    var futureDate = new Date(minslater);

    // 1.0 Transferencias MIFEL en On-Hold - Local o Foraneo
    if (
      Empresa == 'VL'
      //&& futureDate <= now
      && Fecha != ''
      && PaymentID == 'bacs'
      && Status == 'on-hold'
      && WA1 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Envíanos el comprobante de transferencia para revisarlo por la mañana y procesar tu pedido.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #*' + Pedido + '*\n' +
        'Con un total de *' + Total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        'La cuenta para transferencia o deposito es:' + '\n' +
        'Banca Mifel' + '\n' +
        'ORANGE MONKE SA DE CV' + '\n' +
        'Cta: 01600569046' + '\n' +
        'Clabe: 042180016005690468' + '\n\n' +

        'Esperamos el comprobante de pago por este medio para procesarlo.' + '\n' +
        '*Te pedimos depositar el monto exacto y poner en concepto o referencia el numero de pedido ' + Pedido + '*' + '\n\n' +

        'Te envio la clabe para que la puedas copiar y pegar sin errores.'

      var clabe = '042180016005690468'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      //send clabe
      SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: clabe
      })

      var msg2 = 'Error al enviar mensaje de WA1 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 40)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 1.1 Transferencias BBVA en On-Hold - Local o Foraneo
    else if (
      Empresa == 'VL'
      //&& futureDate <= now
      && Fecha != ''
      && PaymentID == 'alg_custom_gateway_2'
      && Status == 'on-hold'
      && WA1 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Envíanos el comprobante de transferencia para revisarlo por la mañana y procesar tu pedido.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #*' + Pedido + '*\n' +
        'Con un total de *' + Total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        'La cuenta para transferencia o deposito es:' + '\n' +
        'BBVA' + '\n' +
        'MENDOZA PABLOS MARTHA SALUSTIA' + '\n' +
        'Cta: 0483063992' + '\n' +
        'Clabe: 012180004830639924' + '\n\n' +

        'Esperamos el comprobante de pago por este medio para procesarlo.' + '\n' +
        '*Te pedimos depositar el monto exacto y poner en concepto o referencia el numero de pedido ' + Pedido + '*' + '\n\n' +

        'Te envio la clabe para que la puedas copiar y pegar sin errores.'

      var clabe = '012180004830639924'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      //send clabe
      SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: clabe
      })

      var msg2 = 'Error al enviar mensaje de WA1 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 40)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 1.2 Transferencias Zelle en On-Hold - Local o Foraneo
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && MetodoPago.includes("Zelle")
      && Status == 'on-hold'
      && WA1 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          'Our service hours are daily from 10am to 10pm and we are currently resting.' + '\n' +
          'Please send us the proof of transfer so we can review it in the morning and process your order.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hi *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'This is Dan from Vapelab' + '\n\n' +

        'We received your order #*' + Pedido + '*\n' +
        'With a total of *' + TotalDLS.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        'Please Zelle that amount to the following e-mail:' + '\n' +
        'ventas@vapelab.mx' + '\n' +

        'Please send a screen capture here so we can process the order ASAP.' + '\n'; // Se corrigió aquí

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA1 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 40)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    /*
        // si no entra en on-hold
        else if (
          Empresa == 'VL'
          && futureDate <= now
          && Fecha != ''
          && Status != 'on-hold'
          && WA1 == ''
        ) {
          sheetEnvios.getRange(i + 3, 35).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");
        }
    */
  });

}

// Pending Mercado Pago
function WAVL2() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    var a = [{ day: 'numeric' }, { month: 'short' }, { year: '2-digit' }];
    var date = join(Fecha, a, '-') + ' ' + Hora
    var orderdate = new Date(date)

    var now = new Date()
    var FechaInMS = orderdate.getTime()
    var add = 5 * 60 * 1000
    var minslater = FechaInMS + add
    var futureDate = new Date(minslater);

    // Mercado Pago en pending desues de 5 mins que no pago, local o foraneo
    if (
      Empresa == 'VL'
      && futureDate <= now
      && Fecha != ''
      && MetodoPago.includes("Mercado")
      && Status == 'pending'
      && WA2 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Puedes realizar el pago con confianza y procesaremos tu pedido en cuanto estemos de regreso.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #*' + Pedido + '*\n' +
        'Con un total de *' + Total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        'El estado de tu pedido está *pendiente de pago*, elegiste Mercado Pago como metodo de pago.' + '\n' +
        'Si aun no tienes el link para realizar el pago, por favor avisanos para enviartelo.' + '\n' +

        'Gracias por tu compra!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA2 del pedido' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }
      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 41)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

    }

  });

}


// Pedido en procesando
function WAVL3() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    var a = [{ day: 'numeric' }, { month: 'short' }, { year: '2-digit' }];
    var date = join(Fecha, a, '-') + ' ' + Hora
    var orderdate = new Date(date)

    var now = new Date()
    var FechaInMS = orderdate.getTime()
    var add = 5 * 60 * 1000
    var minslater = FechaInMS + add
    var futureDate = new Date(minslater);

    ///// Locales /////

    // 3.1 Local - Transferencia Pasa de on-hold a Procesando 
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && (PaymentID == 'bacs' || PaymentID == 'alg_custom_gateway_2')
      && WA1 != ''
      && WA3 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        '*Recibimos el pago de tu pedido* #' + Pedido + ', Muchas gracias!' + '\n\n' +

        'Ya lo estamos preparando, en cuanto esté por salir a ruta, te enviaremos una notificación con la hora aproximada de entrega, así como el contacto del mensajero.' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        '*Si compraste dispositivos desechables, por favor, pruebalos enfrente del mensajero, si fallan, con gusto te los cambiamos. Sí no estarás para recibir el pedido, por favor avisanos por este medio para darte indicaciones detalladas para que tu compra este protegida. NO HAY EXCEPCIONES*' + '\n\n' +

        'Gracias por tu compra!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 3.1.1 Local - Zelle Pasa de on-hold a Procesando 
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && PaymentID == 'alg_custom_gateway_1'
      && WA1 != ''
      && WA3 == '') {

      var message =
        'Hi *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        '*We have received the payment for your order* #' + Pedido + ', Thank you so much!' + '\n\n' +

        'We are now preparing it, as soon as it is ready to go out for delivery, we will send you a notification with the estimated delivery time and the courier\'s contact information.' + '\n\n' +

        '*PLEASE REMEMBER:*' + '\n' +
        '*If you purchased disposable devices, please test them in front of the courier. If they fail, we will gladly exchange them for you. If you will not be available to receive the order, please let us know through here, to provide you with detailed instructions to protect your purchase. NO EXCEPTIONS*' + '\n\n' +

        'Thank you for your purchase!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 3.2.1 Entra en Procesando pago EFECTIVO obvio no le mande primer mensaje
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && PaymentID == 'cod'
      && WA3 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Enviaremos tu pedido en la primera ruta por la mañana.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #' + Pedido + '\n' +
        'Con pago en Efectivo' + '\n' +
        'Con un total de *' + Total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        '*Ya lo estamos preparando, en cuanto esté por salir a ruta, te enviaremos una notificación con la hora aproximada de entrega, así como el contacto del mensajero.*' + '\n' +
        'Nuestros mensajeros siempre llevan cambio.' + '\n\n' +

        'Gracias por tu compra!' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Para que el mensajero te pueda entregar es necesario que seas mayor de edad y le muestres tu identificación oficial.' + '\n' +
        '*Si compraste dispositivos desechables, por favor, pruebalos enfrente del mensajero, si fallan, con gusto te los cambiamos. Sí no estarás para recibir el pedido, por favor avisanos por este medio para darte indicaciones detalladas para que tu compra este protegida. NO HAY EXCEPCIONES*'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 3.2.2 Entra en Procesando pago Tarjeta Fisica obvio no le mande primer mensaje
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && PaymentID == 'cheque'
      && WA3 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Enviaremos tu pedido en la primera ruta por la mañana.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #' + Pedido + '\n' +
        'Con pago con Terminal Fisica, (el mensjaero hara el cobro)' + '\n' +
        'Con un total de *' + Total.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' }) + '*\n\n' +

        '*Ya lo estamos preparando, en cuanto esté por salir a ruta, te enviaremos una notificación con la hora aproximada de entrega, así como el contacto del mensajero.*' + '\n\n' +

        'Gracias por tu compra!' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        '*Si compraste dispositivos desechables, por favor, pruebalos enfrente del mensajero, si fallan, con gusto te los cambiamos. Sí no estarás para recibir el pedido, por favor avisanos por este medio para darte indicaciones detalladas para que tu compra este protegida. NO HAY EXCEPCIONES*'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }


    //// Foraneos /////

    // 3.3 Transferencia Pasa de on-hold a Procesando 
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && ShippingID.includes("enviaya")
      && (PaymentID == 'bacs' || PaymentID == 'alg_custom_gateway_2')
      && WA1 != ''
      && WA3 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        '*Recibimos el pago de tu pedido* #' + Pedido + ', Muchas gracias!' + '\n\n' +

        'Ya lo estamos preparando, en cuanto generemos tu guia, te enviaremos el link por este medio y a tu correo para rastrearla.' + '\n\n' +

        'Gracias por tu compra!' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        '*Si adquiriste vapes desechables, para poder ofrecerte una garantía por servicio en caso de que falle alguno, es necesario grabar un video desde que abres el sobre y probar todos en el video, sin cortes ni ediciones en cuadro.*'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 3.3.1 Zelle Pasa de on-hold a Procesando foraneo
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && ShippingID.includes("enviaya")
      && PaymentID == 'alg_custom_gateway_1'
      && WA1 != ''
      && WA3 == '') {

      var message =
        'Hello *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        '*We have received the payment for your order* #' + Pedido + ', thank you so much!' + '\n\n' +

        'We are now preparing it, as soon as we generate your tracking number, we will send you the link through Whatsapp and to your email for tracking.' + '\n\n' +

        'Thank you for your purchase!' + '\n\n' +

        '*PLEASE REMEMBER:*' + '\n' +
        '*If you purchased disposable devices, please record a video as soon as you receive your order (without cuts or edits, with the product always in frame). Please try them one by one, if any of them fails, please send us the video and we will gladly replace it in your next order. NO EXCEPTIONS*'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // Foraneos
    // 3.4 Mercado Pago Pasa de pending a Procesando y ya le mande un primer mensaje Foraneo
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Mercado")
      && WA3 == '') {
      var message =
        'Hola ' + Cliente.slice(0, Cliente.indexOf(" ")) + '' + '\n' +
        'Recibimos el pago de tu pedido #' + Pedido + ' a través de Mercado Pago, ¡Muchas gracias!' + '\n\n' +

        'Ya lo estamos preparando, en cuanto generemos tu guía, te enviaremos el link por este medio y a tu correo para rastrearla.' + '\n\n' +

        'Gracias por tu compra!' + '\n\n' +

        'TE RECORDAMOS:' + '\n' +
        'Si adquiriste vapes desechables, para poder ofrecerte una garantía por servicio en caso de que falle alguno, es necesario grabar un video desde que abres el sobre y probar todos en el video, sin cortes ni ediciones en cuadro.';

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      });

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel;

      if (status_wa.success) {
        status = 'OK';
      } else {
        status = 'Error';
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        });
      }

      // Pone confirmación de enviado
      const range = sheetEnvios.getRange(i + 3, 42);
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 3.4.1 pasa de pending a Procesando y NO le mande un primer mensaje osea no mando el de pending Foraneo
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'processing'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Mercado")
      && WA2 != ''
      && WA3 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n' +
        'Te escribo de VapeLab.mx' + '\n\n' +

        'Recibimos tu pedido #' + Pedido + '\n\n' +

        '*Ya lo estamos preparando, en cuanto generemos tu guia, te enviaremos el link por este medio y a tu correo para rastrearla.*' + '\n\n' +

        'Gracias por tu compra!' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        '*Si adquiriste vapes desechables, para poder ofrecerte una garantía por servicio en caso de que falle alguno, es necesario grabar un video desde que abres el sobre y probar todos en el video, sin cortes ni ediciones en cuadro.*'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA3 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 42)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

    }

  });

}

// Completado
function WAVL4() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    //// Locales /////

    // 4.1 Completed despues de pasar por processing
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && !MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Tu pedido #' + Pedido + ' ya está en camino*' + '\n' +
        'La hora estimada de entrega es entre ' + HrEntrega + ' hrs' + '\n\n' +

        'Tu mensajero es *' + Mensajero + '*, si necesitas algo escríbele aquí ' + GetMensajero(Mensajero)[2] + '\n' +
        '*Por favor no le llames ya que retrasa el proceso*, el se comunicara contigo cuando tu pedido sea el siguiente en entregarse.' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Para evitar retrasos en las entregas, los mensajeros no pueden ingresar ni subir a los domicilios, te pedimos que los veas en Planta Baja para que pueda seguir su ruta lo antes posible. El mensajero no puede esperar mas de 5 minutos en tu domicilio, si deseas reagendar la entrega, avisanos aqui antes de que llegue el mensajero, asi evitaras que se te cobre doble envio.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 4.1.2 Completed despues de pasar por processing para ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hello *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' + // Greeting with customer's first name

        '*Your order #' + Pedido + ' is on its way*' + '\n' + // Confirmation that the order is being delivered
        'The estimated delivery time is between ' + HrEntrega + ' hrs' + '\n\n' + // Estimated delivery time

        'Your delivery guy is *' + Mensajero + '*, if you need anything, you can write to him/her here ' + GetMensajero(Mensajero)[2] + '\n' +
        '*Please do not call the messenger, as it delays the process*, he/she will contact you when your order is next in line for delivery.' + '\n\n' + // Information about the messenger and how to contact them

        '*REMEMBER:*' + '\n' + // Reminder section
        'To avoid delays in deliveries, delivery guys cannot enter or go up to the residences. We ask that you meet them on the ground floor so that they can continue their route as soon as possible. The messenger cannot wait for more than 5 minutes at your residence. If you wish to reschedule the delivery, let us know here before the messenger arrives to avoid being charged double for shipping.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 4.2 Completed pero no paso por processing
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && !MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Recibimos el pago de tu pedido* ' + Pedido + ', Muchas gracias!, *ya esta en camino*' + '\n' +
        'La hora estimada de entrega es entre ' + HrEntrega + ' hrs' + '\n\n' +

        'Tu mensajero es *' + Mensajero + '*, si necesitas algo escríbele aquí ' + GetMensajero(Mensajero)[2] + '\n' +
        '*Por favor no le llames ya que retrasa el proceso*, el se comunicara contigo cuando tu pedido sea el siguiente en entregarse.' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Para evitar retrasos en las entregas, los mensajeros no pueden ingresar ni subir a los domicilios, te pedimos que los veas en Planta Baja para que pueda seguir su ruta lo antes posible. El mensajero no puede esperar mas de 5 minutos en tu domicilio, si deseas reagendar la entrega, avisanos aqui antes de que llegue el mensajero, asi evitaras que se te cobre doble envio.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      // Pone N/A a processing
      //sheetEnvios.getRange(i + 3, 37).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");

    }

    // 4.2.1 completed pero no paso por processing para ZELLE
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Recibimos el pago de tu pedido* ' + Pedido + ', Muchas gracias!, *ya esta en camino*' + '\n' +
        'La hora estimada de entrega es entre ' + HrEntrega + ' hrs' + '\n\n' +

        'Tu mensajero es *' + Mensajero + '*, si necesitas algo escríbele aquí ' + GetMensajero(Mensajero)[2] + '\n' +
        '*Por favor no le llames ya que retrasa el proceso*, el se comunicara contigo cuando tu pedido sea el siguiente en entregarse.' + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Para evitar retrasos en las entregas, los mensajeros no pueden ingresar ni subir a los domicilios, te pedimos que los veas en Planta Baja para que pueda seguir su ruta lo antes posible. El mensajero no puede esperar mas de 5 minutos en tu domicilio, si deseas reagendar la entrega, avisanos aqui antes de que llegue el mensajero, asi evitaras que se te cobre doble envio.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      // Pone N/A a processing
      //sheetEnvios.getRange(i + 3, 37).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");

    }

    ///// Foraneos /////

    // EDITAR TEXTO
    // 4.3 Completed despues de pasar por processing y NO PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && !MetodoPago.includes("Zelle")
      && Seguro == 0
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, ya que no pagaste el seguro contra decomiso, por lo que no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 4.3.1 Completed despues de pasar por processing y SI PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && !MetodoPago.includes("Zelle")
      && Seguro > 0
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // 4.3.2 Completed despues de pasar por processing para ZELLE NO PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Zelle")
      && Seguro == 0
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, pero si escogiste adquirir el seguro para envíos por paquetería, no te preocupes, en el caso de que sea decomisado, no tienes que hacer nada más que avisarnos, con gusto lo enviamos de nuevo. Sí escogiste no adquirir el seguro, no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // 4.3.3 Completed despues de pasar por processing para ZELLE SI PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Zelle")
      && Seguro > 0
      && WA3 != ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, pero si escogiste adquirir el seguro para envíos por paquetería, no te preocupes, en el caso de que sea decomisado, no tienes que hacer nada más que avisarnos, con gusto lo enviamos de nuevo. Sí escogiste no adquirir el seguro, no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // 4.4 Completed pero no paso por processing NO PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && !MetodoPago.includes("Zelle")
      && Seguro == 0
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, pero si escogiste adquirir el seguro para envíos por paquetería, no te preocupes, en el caso de que sea decomisado, no tienes que hacer nada más que avisarnos, con gusto lo enviamos de nuevo. Sí escogiste no adquirir el seguro, no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      //sheetEnvios.getRange(i + 3, 38).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // 4.4.1 Completed pero no paso por processing SI PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && !MetodoPago.includes("Zelle")
      && Seguro > 0
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      //sheetEnvios.getRange(i + 3, 38).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // 4.5.1 Completed pero no paso por processing ZELLE NO PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Zelle")
      && Seguro == 0
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, pero si escogiste adquirir el seguro para envíos por paquetería, no te preocupes, en el caso de que sea decomisado, no tienes que hacer nada más que avisarnos, con gusto lo enviamos de nuevo. Sí escogiste no adquirir el seguro, no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      //sheetEnvios.getRange(i + 3, 38).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // 4.5.2 Completed pero no paso por processing ZELLE SI PAGO SEGURO
    else if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && ShippingID.includes("enviaya")
      && MetodoPago.includes("Zelle")
      && Seguro > 0
      && WA3 == ''
      && WA4 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Ya generamos tu guia del pedido #' + Pedido + '*, te paso el link de rastreo.' + '\n' +
        LinkGuia + '\n\n' +

        '*TE RECORDAMOS:*' + '\n' +
        'Nuestra resposabilidad termina al entregar tu pedido en paqueteria, pero si escogiste adquirir el seguro para envíos por paquetería, no te preocupes, en el caso de que sea decomisado, no tienes que hacer nada más que avisarnos, con gusto lo enviamos de nuevo. Sí escogiste no adquirir el seguro, no nos podemos hacer responsables por perdidas o decomisios por parte de la autoridad.' + '\n\n' +

        'Muchas gracias, y seguimos a la orden!'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA4 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 43)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");

      //sheetEnvios.getRange(i + 3, 38).setValue('N/A').setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

  });

}

// Cancelado
function WAVL5() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    // NO ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'cancelled'
      && !MetodoPago.includes("Zelle")
      && WA5 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        'Una disculpa, tu *pedido #' + Pedido + ' ha sido cancelado*' + '\n' +
        'Si sientes que es un error, avisanos.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA5 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 44)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    //  ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'cancelled'
      && MetodoPago.includes("Zelle")
      && WA5 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        'Una disculpa, tu *pedido #' + Pedido + ' ha sido cancelado*' + '\n' +
        'Si sientes que es un error, avisanos.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA5 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 44)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

  });

}

// Refunded
function WAVL6() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    // NO ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && MetodoPago.includes("Mercado")
      && !MetodoPago.includes("Zelle")
      && Status == 'refunded'
      && WA6 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Tu pedido ' + Pedido + ' ha sido reembolsado*' + '\n' +
        'Para cualquier duda, aqui estamos para apoyarte.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA6 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 45)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && MetodoPago.includes("Mercado")
      && MetodoPago.includes("Zelle")
      && Status == 'refunded'
      && WA6 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Tu pedido ' + Pedido + ' ha sido reembolsado*' + '\n' +
        'Para cualquier duda, aqui estamos para apoyarte.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA6 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 45)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

  });

}

// Failed
function WAVL7() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    // NO ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && MetodoPago.includes("Mercado")
      && !MetodoPago.includes("Zelle")
      && Status == 'failed'
      && WA7 == '') {

      var additionalText = '';

      if (currentHour >= 22 || currentHour < 10) {
        additionalText =
          '⏰ Nuestro horario de servicio es de 10am a 10pm todos los dias y actualmente estamos descansando.' + '\n' +
          'Vemos que tu pago no se proceso, con todo gusto te podemos apoyar en cuanto estemos de regreso, si gustas puedes ir explicando que crees que paso.' + '\n\n' +
          '----------------------------' + ' \n\n'
      }

      var message = additionalText +
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        'Una disculpa, *el pago de tu pedido ' + Pedido + ' ha sido rechazado.*' + '\n' +
        'Para cualquier duda, aqui estamos para apoyarte.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA7 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 46)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && MetodoPago.includes("Mercado")
      && MetodoPago.includes("Zelle")
      && Status == 'failed'
      && WA7 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        'Una disculpa, *el pago de tu pedido ' + Pedido + ' ha sido rechazado.*' + '\n' +
        'Para cualquier duda, aqui estamos para apoyarte.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA7 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 46)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

  });

}


// Hr Updated
function WAVL8() {

  data.forEach(function (row, i) {

    var Empresa = row[0]; var Fecha = row[1]; var Hora = row[2]; var Pedido = row[3]; var Cliente = row[4]; var DireccionCompleta = row[5]; var CalleYNumero = row[6]; var Notas = row[7]; var Colonia = row[8]; var Ciudad = row[9]; var Estado = row[10]; var CP = row[11]; var CountryCode = row[12]; var Tel = row[13]; var WA = row[14]; var ShippingID = row[15]; var TipoEnvio = row[16]; var PaymentID = row[17]; var MetodoPago = row[18]; var Subtotal = row[19]; var CostoEnvio = row[20]; var Seguro = row[21]; var Comision = row[22]; var Total = row[23]; var EfeReal = row[24]; var Mensajero = row[25]; var Status = row[26]; var HrEntrega = row[27]; var HrUpdate = row[28]; var Terminado = row[29]; var LinkGuia = row[30]; var LinkClip = row[31]; var TotalDLS = row[32]; var Vacia1 = row[33]; var Vacia2 = row[34]; var Vacia3 = row[35]; var Vacia4 = row[36]; var Vacia5 = row[37]; var Cobro = row[38]; var WA1 = row[39]; var WA2 = row[40]; var WA3 = row[41]; var WA4 = row[42]; var WA5 = row[43]; var WA6 = row[44]; var WA7 = row[45]; var WA8 = row[46]; var WA9 = row[47]; var WA10 = row[48];

    // Local NO ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && !MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && HrUpdate != ''
      && WA8 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Se actualizó el tiempo estimado de entrega de tu pedido #' + Pedido + '*\n' +
        'Calculamos que tu pedido se va entregar entre *' + HrUpdate + ' hrs' + '*\n\n' +

        'Tu mensajero es *' + Mensajero + '*, si necesitas algo escríbele aquí ' + GetMensajero(Mensajero)[2] + '\n' +
        //'*Por favor no le llames ya que retrasa el proceso*, el se comunicara contigo cuando tu pedido sea el siguiente en entregarse.' + '\n\n' +
        'El se comunicara contigo cuando tu pedido sea el siguiente en entregarse.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA8 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 47)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

    // EDITAR TEXTO
    // Local  ZELLE
    if (
      Empresa == 'VL'
      && Fecha != ''
      && Status == 'completed'
      && (ShippingID == 'distance_rate' || ShippingID == 'free_shipping')
      && MetodoPago.includes("Zelle")
      && Mensajero != ''
      && HrEntrega != ''
      && HrUpdate != ''
      && WA8 == '') {

      var message =
        'Hola *' + Cliente.slice(0, Cliente.indexOf(" ")) + '*' + '\n\n' +

        '*Se actualizó el tiempo estimado de entrega de tu pedido #' + Pedido + '*\n' +
        'Calculamos que tu pedido se va entregar entre *' + HrUpdate + ' hrs' + '*\n\n' +

        'Tu mensajero es *' + Mensajero + '*, si necesitas algo escríbele aquí ' + GetMensajero(Mensajero)[2] + '\n' +
        //'*Por favor no le llames ya que retrasa el proceso*, el se comunicara contigo cuando tu pedido sea el siguiente en entregarse.' + '\n\n' +
        'El se comunicara contigo cuando tu pedido sea el siguiente en entregarse.'

      //send notif to whatsapp
      var status_wa = SendWAVL({
        to: WA.toString(),
        //to: dan,
        msg: message
      })

      var msg2 = 'Error al enviar mensaje de WA8 del pedido ' + Pedido + '\n' +
        'Cliente: ' + Cliente + '\n' +
        'Telefono: ' + Tel

      if (status_wa.success) {
        status = 'OK'
      }
      else {
        status = 'Error'
        var wa_failed = SendWAVL({
          to: vapelab,
          msg: msg2
        })
      }

      // Pone confirmacion de enviado  
      const range = sheetEnvios.getRange(i + 3, 47)
      range.setValue(status + ' - ' + Utilities.formatDate(new Date(), SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'HH:mm')).setHorizontalAlignment("center").setVerticalAlignment("middle");
    }

  });

}



