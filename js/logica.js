var frameGlobal = ""
var indiceGlobal = 0

function ejemplo() {
    /* 
    Valores variables
    uTransferencia = Unidad	máxima de transferencia de la red - La MTU de Ethernet es 1500 bytes por frame: Cuadro de texto
    ltDatagrama    = Longitud total del datagrama, incluyendo encabezado y datos (en bytes): Cuadro de texto
    ipProtocolo    = Protocolo de	nivel superior: Botón de radio: ICMP, TCP, UDP
    dirIpOrigen    = Dirección IP	origen:	Cuadro de texto en notación decimal.
    dirIpDestino   = Dirección IP	destino: Cuadro de texto en notación decimal.
    */

    uTransferencia = 0
    ltDatagrama = 0
    ipProtocolo = ""
    dirIpOrigen = ""
    dirIpDestino = ""

    /* 
    Valores Fijos:
    Versión	del	datagrama: 4
    Longitud del encabezado: 5 (se asume que el encabezado	del	datagrama será de longitudfija:	5 words de 32 bits).
    Servicios diferenciados: 0

    Valores fijos aleatorios
    numIdentificacion = Número de identificación: Valor entre 0 y 65.535.
    tiempovida        = Tiempo de vida: Valor entre 0 y 255
    */

    // Retorna un número aleatorio entre min (incluido) y max (excluido)
    // La función floor, redondea números decimales
    numIdentificacion = Math.floor(Math.random() * (65536 + 1))
    tiempovida = Math.floor(Math.random() * (256 + 1))
    //console.log("Num ide:  ", numIdentificacion, " tiempovida: ", tiempovida)

    /*
    Valores a calcular:
    La longitud de cada fragmento.
    Los flags.
    El desplazamiento.
    La suma de comprobación en el origen
    */

    /*
    Orden final :
    0100 0101 00000000
    45-00-ltDatagrama-[numIdentificacion]-flags-dezplazamiento-[tiempovida]-ipProtocolo-sumadecomprobación-dirIpOrigen-dirIpDestino
    */
}

/**
 * Metodo que divide un Frame deacuerdo a la cantidad de mtu que se necesite
 * @param {int} mtu Es el número maximo de tranferencia
 * @param {int} ltDatagrama La longitud total del datagrama
 * @param {int} numIdentificacion Es el numero de identificación del datagrama
 * @param {int} tiempovida El tiempo de vida del datagrama
 * @param {int} ipProtocolo El protocooo ip del datagrama
 * @param {int} dirIpOrigen La dirección de origen del datagrama
 * @param {int} dirIpDestino Es la dirección ip destino 192.168
 */
function dividirFrame(mtu, ltDatagrama, numIdentificacion, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino) {
    //Se crea el arreglo donde se vana contener todos los Datagramas
    let frameTotales = []
    //Para calcular el desplazamiento
    let despAux = 0
    //Cuantas veces esta (mtu-20 del encabezado) en la longitud del datagrama, se redondea en caso de no ser entero

    //Para evitar errores en la ejecución del metodo se transforma a entero los siguientes valores
    mtu = parseInt(mtu)
    ltDatagrama = parseInt(ltDatagrama)
    ipProtocolo = parseInt(ipProtocolo)

    //Calculamos el sobrante de la división, para saber cuando falta en caso de que la división sea inexacta
    let sobrante = ltDatagrama % (mtu - 20)
    //Le restamos el restante a ltDatagrama obtener las parte enteras de la división
    let limite = (ltDatagrama - sobrante) / (mtu - 20)

    //Se define var ya que el parametro i se utiliza en diferentes partes del progama, javascript lo tomoa igual si no se usa var
    let i = 1

    //Se verifica si la logitud del datagrama es mayor que el unidad maximade transferencia - 20
    if (ltDatagrama > (mtu - 20)) {
        //Hacemos tantas veces quepa la unidad de transferencia en la longitud del datagrama
        while (i <= limite) {
            // verificamos si resulta que cabe perfectamente en el frame, por ende el ultimo frame sus banderas seran 000
            if (i==limite && sobrante == 0) {
                frameTotales.push(armarFrame(mtu, numIdentificacion, 0, 0, despAux, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino))
            } else {
                //Si resulta que en ni
                frameTotales.push(armarFrame(mtu, numIdentificacion, 0, 1, despAux, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino))
                i = 1 + i
                //Se calcula el dezplazamiento deacuerdo al anterior frame
                despAux = (mtu) * (i - 1)
            }
        }

        //En caso de que haya datos faltantes
        if (sobrante != 0) {
            //Se calcula el valor restante necesitado para completar el frame
            frameTotales.push(armarFrame(sobrante + 20, numIdentificacion, 0, 0, despAux, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino))
        }

    } else if (ltDatagrama == (mtu - 20)) {
        //Se calcula el valor restante necesitado para completar el frame
        frameTotales.push(armarFrame(mtu, numIdentificacion, 1, 0, despAux, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino))
    }
    else {
        //En caso de que no sea necesario agregar mas de 1 frame
        frameTotales.push(armarFrame(ltDatagrama, numIdentificacion, 1, 0, despAux, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino))
    }
    return frameTotales
}

/**
 * Metodo que estructura un Frame dado los atributos del mismo en decimal
 * @param {Decimal} ltDatagrama La longitud de datagrama
 * @param {Decimal} numIdentificacion Numero de indentificación del datagrama
 * @param {Decimal} df Bandera don't fragment 
 * @param {Decimal} mf Bandera More fragment
 * @param {Decimal} desplazamiento Desplazamiento del datagrama
 * @param {Decimal} tiempovida Tiempo de Vida del datagrama
 * @param {Decimal} ipProtocolo Protocolo ip usado por el datagrama
 * @param {Decimal} dirIpOrigen Dirección ip origen del datagrama
 * @param {Decimal} dirIpDestino Dirección ip destino del datagrama
 * @returns {String} Una cadena con la información obtenida en hexadecimal y binario
 */
function armarFrame(ltDatagrama, numIdentificacion, df, mf, desplazamiento, tiempovida, ipProtocolo, dirIpOrigen, dirIpDestino) {
    frameHexa = "45-00"
    frameBinario = "01000101-00000000"

    // Longitud del datagrama - 16 bits - 4 hexa 
    ltDatagramaHex = ltDatagrama.toString(16)
    ltDatagramaBin = ltDatagrama.toString(2)
    //console.log("Desde el programa inicio : ", ltDatagrama, " sale ", ltDatagramaHex)
    // console.log("Frame Hexa : ",ltDatagramaHex, " Frame Binario : ", ltDatagramaBin)
    // Cada que hace una tranformación en base n, los 0 a la izquiera son ignorados, por eso, se deben agregar a mano 
    if (ltDatagramaHex.length < 4) {
        ltDatagramaHex = agregarDigitoFaltante(ltDatagramaHex, 4 - ltDatagramaHex.length)
    }
    if (ltDatagramaBin.length < 16) {
        ltDatagramaBin = agregarDigitoFaltante(ltDatagramaBin, 16 - ltDatagramaBin.length)
    }

    frameHexa += "-" + ltDatagramaHex
    frameBinario += "-" + ltDatagramaBin

    // Identificación: 16 bits - 4 hexa 
    numIdentificacionHex = numIdentificacion.toString(16)
    numIdentificacionBin = numIdentificacion.toString(2)

    if (numIdentificacionHex.length < 4) {
        numIdentificacionHex = agregarDigitoFaltante(numIdentificacionHex, 4 - numIdentificacionHex.length)
    }
    if (numIdentificacionBin.length < 16) {
        numIdentificacionBin = agregarDigitoFaltante(numIdentificacionBin, 16 - numIdentificacionBin.length)
    }

    frameHexa += "-" + numIdentificacionHex
    frameBinario += "-" + numIdentificacionBin

    // Flags    0dfmf + desplazamiento 
    //En esta caso, la fragmentación y demas vienen desde afuera, y primero se debe hacer la parte binaria
    flags = "0" + df + mf
    //console.log("Flags ", flags)
    desplazamientoBin = desplazamiento.toString(2)

    if (desplazamientoBin.length < 13) {
        desplazamientoBin = agregarDigitoFaltante(desplazamientoBin, 13 - desplazamientoBin.length)
    }

    desplazamientoBin = flags + desplazamientoBin
    /*console.log("Desplazamiento Bin ", desplazamientoBin)*/
    //Con la parte binaria completa, ahora si se puede pasar a Hexa
    desplazamientoHex = parseInt(desplazamientoBin, 2).toString(16)
    /*console.log("Desplazamiento Hexa ", desplazamientoHex)*/

    if (desplazamientoHex.length < 4) {
        desplazamientoHex = agregarDigitoFaltante(desplazamientoHex, 4 - desplazamientoHex.length)
    }

    frameHexa += "-" + desplazamientoHex
    frameBinario += "-" + desplazamientoBin

    // Tiempo de vida
    tiempovidaHex = tiempovida.toString(16)
    tiempovidaBin = tiempovida.toString(2)

    if (tiempovidaHex.length < 2) {
        tiempovidaHex = agregarDigitoFaltante(tiempovidaHex, 2 - tiempovidaHex.length)
    }
    if (tiempovidaBin.length < 8) {
        tiempovidaBin = agregarDigitoFaltante(tiempovidaBin, 8 - tiempovidaBin.length)
    }

    frameHexa += "-" + tiempovidaHex
    frameBinario += "-" + tiempovidaBin

    // Protocolo
    ipProtocoloHex = ipProtocolo.toString(16)
    ipProtocoloBin = ipProtocolo.toString(2)

    if (ipProtocoloHex.length < 2) {
        ipProtocoloHex = agregarDigitoFaltante(ipProtocoloHex, 2 - ipProtocoloHex.length)
    }
    if (ipProtocoloBin.length < 8) {
        ipProtocoloBin = agregarDigitoFaltante(ipProtocoloBin, 8 - ipProtocoloBin.length)
    }

    frameHexa += "-" + ipProtocoloHex
    frameBinario += "-" + ipProtocoloBin

    // Dirección ip origen 
    dirIpOrigenHex = dirIpOrigen
    dirIpOrigenBin = parseInt(dirIpOrigen, 16).toString(2)

    if (dirIpOrigenBin.length < 16) {
        dirIpOrigenBin = agregarDigitoFaltante(dirIpOrigenBin, 16 - dirIpOrigenBin.length)
    }

    // Dirección ip destino 
    dirIpDestinoHex = dirIpDestino
    dirIpDestinoBin = parseInt(dirIpDestino, 16).toString(2)

    if (dirIpDestinoBin.length < 16) {
        dirIpDestinoBin = agregarDigitoFaltante(dirIpDestinoBin, 16 - dirIpDestinoBin.length)
    }

    sumaComprobacion = encontrarSumaComprobacion(frameHexa + dirIpOrigenHex + dirIpDestinoHex)
    //console.log("Suma de Comprobación", sumaComprobacion)
    frameHexa += "-" + sumaComprobacion
    frameBinario += "-" + parseInt(sumaComprobacion, 16).toString(2)

    frameHexa += "-" + dirIpOrigenHex + "-" + dirIpDestinoHex
    frameBinario += "-" + dirIpOrigenBin + "-" + dirIpDestinoBin

    console.log("Frame Hexa : ",frameHexa)
    return frameHexa + ":" + frameBinario
}

/**
 * Metodo que agrega ceros a la izquierda a una cadena, n o "limite" veces
 * @param {*} cadena Es el String que se le piensa agregar los 0
 * @param {*} limite Es el número de 0 a agregar a la izquierda de cadena
 * @returns El binario con la cantidad de ceros que necesitaba
 */
function agregarDigitoFaltante(cadena, limite) {

    for (let i = 0; i < limite; i++) {
        cadena = "0" + cadena
    }

    return cadena
}

/**
 * Metodo que calcula la suma de comprobación  y lo retorna en binario
 * @param {String(16)} cabecera Es la cadena de numeros hexadecimales para realializar la suma de comprobacion
 * @returns La suma de comprobación en hexadecimal
 */
function encontrarSumaComprobacion(cabecera) {
    /* 
    El siguiente cadena de numeros es un ejemplo de como se espera que sea cabecera
    los numeros de arriba indican el indice donde estan parados y como en toda cabecera,
    su total de digitos hexadecimales son 20 pares
    01 23 45 67 89 1011 ...       20  23                        39
    45 00 02 24 cc 34 00 b9 40 01 [24 da] c0 a8 02 e3 c0 a8 02 de
    */
    i = 0
    suma = ""
    hexa = ""
    hexb = ""

    // Se realiza la primera suma de los dos primeros cuartetos de hexadecimales
    //Se extrae el primer grupo de 4 digitos hexadecimales
    hexa = cabecera.substring(i, i + 4)
    i += 4
    //Se extrae el siguiente grupo de 4 digitos hexadecimales
    hexb = cabecera.substring(i, i + 4)
    suma = sumarHexadecimal(hexa, hexb)

    //Se traslada el indice hasta el siguiente grupo
    i += 4
    while (i < cabecera.length) {
        /* Se verifica si el resultado de dicha suma tiene mas de 4 digitos hexadecimales*/
        if (suma.length > 4) {
            /* Se obtiene el sobrante y se suma con los demas digitos */
            hexb = suma.substring(0, 1)
            suma = suma.substring(1, suma.length)
            suma = sumarHexadecimal(suma, hexb)
        } else {
            /* Se obtiene los siguientes 4 digitos hexadecimales */
            hexb = cabecera.substring(i, i + 4)
            suma = sumarHexadecimal(suma, hexb)
            i += 4
        }
        //console.log(suma," B  : ", hexb )
    }

    // Se rectifica si hay mas de 4 digitos exadecimales    
    if (suma.length > 4) {
        //Se obtiene el sobrante y se suma con los demas digitos 
        hexb = suma.substring(0, 2)
        suma = suma.substring(1, suma.length)
        suma = sumarHexadecimal(suma, hexb)
    }
    //Se realiza la resta para encontrar la suma de comprobación
    suma = restarHexadecimal("FFFF", suma)

    return suma;
}

/**
 * Metodo que recibe una dirección  ip y la trasnforma a su valor decimal unificado
 * @param {String} direccion Es la dirección ip que se desea cambiar
 * @returns El valor en decimal de la dirección ip
 */
function transformardireccion(direccion) {

    var dividirDir = direccion.split(".")
    var parteA = parseInt(dividirDir[0]).toString(16)
    var parteB = parseInt(dividirDir[1]).toString(16)
    var parteC = parseInt(dividirDir[2]).toString(16)
    var parteD = parseInt(dividirDir[3]).toString(16)
    
    cadenaBin = agregarDigitoFaltante(parteA, 2 - parteA.length) + agregarDigitoFaltante(parteB, 2 - parteB.length) + agregarDigitoFaltante(parteC, 2 - parteC.length) + agregarDigitoFaltante(parteD, 2 - parteD.length)
    //console.log(cadenaBin)
    
    return cadenaBin
}

/**
 * Metodo que dados dos grupos de numeros hexadecimales los suma
 * @param {String(16)} hexa Es el primer grupo de 4 hexadecimales que se desea sumar
 * @param {String(16)} hexb Es el segundo grupo de 4 hexadecimales que se desea sumar
 * @returns La suma de los dos hexadecimales en String(16)
 */
function sumarHexadecimal(hexa, hexb) {
    //Transformar a decimal
    hexaValor = parseInt(hexa, 16)
    hexbValor = parseInt(hexb, 16)

    //Suma de numeros en hexadecimales
    hexaTotal = hexaValor + hexbValor
    hexaTotal = hexaTotal.toString(16)
    return hexaTotal
}

/**
* Metodo que dados dos grupos de numeros hexadecimales los resta
* @param {String(16)} hexa Es el primer grupo de 4 hexadecimales que se desea restar
* @param {String(16)} hexb Es el segundo grupo de 4 hexadecimales que se desea restar
* @returns La resta de los dos hexadecimales en String(16)
*/
function restarHexadecimal(hexa, hexb) {
    //Transformar a hexadecimal
    hexaValor = parseInt(hexa, 16);
    hexbValor = parseInt(hexb, 16);

    //Suma de numeros en hexadecimales
    hexaTotal = hexaValor - hexbValor;
    hexaTotal = hexaTotal.toString(16);
    return hexaTotal
}

/**
 * Metodo que genera una tabla de acuerdo a la cantidad de Frames obtenidos
 * @param {String[]} frames Es un arreglo donde estan todos los frames
 */
function generar_tabla(frames) {

    const $elemento = document.querySelector("#tabla-fragmentos-body");
    $elemento.innerHTML = "";

    // Obtener la referencia del elemento body
    var body = document.getElementById("tabla-container");

    // Crea un elemento <table> y un elemento <tbody>
    var tabla = document.getElementById("tabla-fragmentos");
    var tblBody = document.getElementById("tabla-fragmentos-body");

    // Crea las celdas
    for (var i = 0; i < frames.length; i++) {
        // Crea las hileras de la tabla
        var hilera = document.createElement("tr");
        hilera.setAttribute("onClick", "pintarFrameIndividual(" + i + ")")

        // Obtener información de los frames
        //var frame = frames[i].split(":")
        var frame = pintarData(frames[i].split(":")[0])
        //console.log("frame " + frame)

        for (var j = 0; j < 2; j++) {
            if (j == 0) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(i);
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            } else if (j == 1) {
                // Crea un elemento <td> y un nodo de texto, haz que el nodo de
                // texto sea el contenido de <td>, ubica el elemento <td> al final
                // de la hilera de la tabla
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(frame);
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            }
        }
        // agrega la hilera al final de la tabla (al final del elemento tblbody)
        tblBody.appendChild(hilera);
    }
    // posiciona el <tbody> debajo del elemento <table>
    tabla.appendChild(tblBody);
    // appends <table> into <body>
    body.appendChild(tabla);
    // modifica el atributo "border" de la tabla y lo fija a "2";
    tabla.setAttribute("border", "2");
}

/**
 * Metodo que captura el indice requerido para obtener el frame solicitado
 * @param {int} indice es la posicición del frame que se desea saber
 */
function pintarFrameIndividual(indice) {
    //Guardamos el indice requerido 
    indiceGlobal = indice
    pintarDatos(frameGlobal, indice)
}

/**
 * Método que cumple la función de procesar y mostrar los datos en la segunda sección de la página
 */
function guardarD() {
    //Se obtiene los datos ingresados por el usuario
    var uTransferencia = document.getElementById("unidadMaxima").value
    var ltDatagrama = document.getElementById("longitudTotal").value
    var ipProtocolo = document.getElementById("tipoProtocolo").value
    var dirIpOrigen = document.getElementById("direccionOrigen").value
    var dirIpDestino = document.getElementById("direccionDestino").value

    //Se comienza a mostrar los datos en la segunda sección de la página
    document.getElementById('ipOrigen').innerHTML = dirIpOrigen
    document.getElementById('ipOrigen1').innerHTML = dirIpOrigen
    document.getElementById('ipDestino').innerHTML = dirIpDestino
    document.getElementById('ipDestino1').innerHTML = dirIpDestino

    // Tanto el número de identificación como el timepo de vida son valores aleatorios
    //Por lo que se generan e inmediatamente se muestran en la segunda sección de la página
    var numIdentificacion = Math.floor(Math.random() * (65536 + 1))
    document.getElementById('numeroIdentificacion').innerHTML = numIdentificacion.toString(16) + " (" + numIdentificacion + ")"
    var tiempovida = Math.floor(Math.random() * (256 + 1))
    document.getElementById('tiempovida').innerHTML = tiempovida

    dirIpOrigenCompleta = transformardireccion(dirIpOrigen)
    dirIpDestinoCompleta = transformardireccion(dirIpDestino)

    frame = dividirFrame(uTransferencia, ltDatagrama, numIdentificacion, tiempovida, ipProtocolo, dirIpOrigenCompleta, dirIpDestinoCompleta)
    generar_tabla(frame)

    // Guardar variables globales
    frameGlobal = frame

    //console.log("Resultadod de dividir frame: ", frame)
}

/**
 * Método que muestra datos como la suma de comprobación, el desplazamiento y el total length
 * @param {*} frame Hace referencia al frame resultante tanto hexadecimal como binario
 * @param {*} indice Es el índice del frame que se ha seleccionado para observar diferentes datos
 */
function pintarDatos(frame, indice) {

    frameH = frame[indice].split(':')
    //Para la suma de comprobación se tiene en cuenta el frame en hexadecimal, especificamente la posición 7 del arreglo
    suma = frameH[0].split('-')[7]
    document.getElementById('checksum').innerHTML = suma

    //El desplazamiento se obtine por medio del frame en binario, realizando un split '-', obteniendo el arreglo en la
    //posición 5 y solo obteniendo los números a partir de la posición 4 de la cadena
    desplazamiento = frameH[1].split('-')[5].substring(4)
    //Luego de obtener el desplazamiento en binario se convierte este número en decimal, para posteriormente
    //mostrar el dato en el offset
    desplazamientodecimal = parseInt(desplazamiento, 2)
    document.getElementById('fragmentoffset').innerHTML = desplazamientodecimal

    //Método que funciona para mostrar toda la sección de flags
    mostrarFlags(frame, indice)

    //Total length
    dataHexadecimal = frameGlobal[indiceGlobal].split(':')[0]
    data = ""
    //Del frame hexadecimal se debe quitar los carácteres iguales a "-"
    for(i = 0; i < dataHexadecimal.length; i++){
        if(dataHexadecimal[i] != "-"){
            data += dataHexadecimal[i]
        }
    }
    //El total length se encuentra en la posición 4 a la 8 del frame hexadecimal
    totalLengthH = data.substring(4,8)
    //Luego de tener solo los 4 dígitos del frame hexadecimal, este valor se convierte en decimal
    totalLengthD = parseInt(totalLengthH, 16)
    //Finalmente se pinta en el campo correspondiente
    document.getElementById("totalLength").innerHTML = totalLengthD
}

/**
 * Método que sirve para mostrar en la segunda sección de la página la información de los flags
 * @param {String} frame Hace referencia al frame resultante tanto hexadecimal como binario
 */
function mostrarFlags(frame, indice) {
    //Se hace el llamado al método armarFrame para obtener tanto el frame en hexadecimal como binario
    frameB = frame[indice].split(':')
    //Se obtiene del frame binario la posición del arreglo 5 el cual corresponde a los frag
    flag = frameB[1].split('-')[5]
    //El don't fragment se encuentra en la posición 2 de la cadena de flags
    dontFragment = flag.substring(1, 2)
    //El more fragments se encuentra en la posición 3 de la cadena de flags
    moreFragment = flag.substring(2, 3)

    //Se puede presentar el caso en el que el don't fragment sea 1 y 0, por lo que dependiendo del número
    //se coloca la información correspondiente
    if (dontFragment == "1") {
        document.getElementById('dontfragment').innerHTML = "." + dontFragment + ".. .... = Don't fragment: Set"
    }
    if (dontFragment == "0") {
        document.getElementById('dontfragment').innerHTML = "." + dontFragment + ".. .... = Don't fragment: Not set"
    }

    //Se puede presentar el caso en el que el more fragments sea 1 y 0, por lo que dependiendo del número
    //se coloca la información correspondiente
    if (moreFragment == "1") {
        document.getElementById('morefragments').innerHTML = ".." + moreFragment + ". .... = More fragments: Set"
    }
    if (moreFragment == "0") {
        document.getElementById('morefragments').innerHTML = ".." + moreFragment + ". .... = More fragments: Not set"
    }
}

/**
 * Método que se encarga de quitar los "-" del frame y pintarlos en el campo correspondiente. Se tiene en cuenta
 * que los dígitos van de par en par
 * @param {*} frame Hace referencia al frame resultante tanto hexadecimal como binario
 * @returns El frame organizado de par en par sin carácteres "-"
 */
function pintarData(frame){
    data = ""
    //Del frame hexadecimal se debe quitar los carácteres iguales a "-"
    for(i = 0; i < frame.length; i++){
        if(frame[i] != "-"){
            data += frame[i]
        }
    }

    dataFinal = ""
    //Se arregla el frame de hexadecimal de manera que quede organizado de par en par
    for(i = 0; i < data.length; i += 2){
        dataFinal += data.substring(i, i + 2) + " "
    }

    return dataFinal
}

/**
 * Método que se encarga de pintar un frame hexadecimal de manera que se vea organziado de par en par de dígitos y sin "-"
 * Solo para el frame de tipo Hexadecimal
 */
function pintarDatagramaH() {
    dataH = frameGlobal[indiceGlobal].split(':')[0]
    
    document.getElementById('ipHexadecimal').innerHTML = pintarData(dataH)
}

/**
 * Método que se encarga de pintar un frame hexadecimal de manera que se vea organziado de ocho en ocho dígitos y sin "-"
 * Solo para el frame de tipo binario
 */
function pintarDatagramaB() {
    dataB = frameGlobal[indiceGlobal].split(':')[1]
    
    data = ""
    //Del frame hexadecimal se debe quitar los carácteres iguales a "-"
    for(i = 0; i < dataB.length; i++){
        if(dataB[i] != "-"){
            data += dataB[i]
        }
    }
    
    dataFinal = ""
    //Se arregla el frame binario de manera que quede organizado de ocho en ocho
    for(i = 0; i < data.length; i += 8){
        dataFinal += data.substring(i, i + 8) + " "
    }

    document.getElementById('ipHexadecimal').innerHTML = dataFinal
}

function procesarEjemplo(){
    document.getElementById('unidadMaxima').defaultValue = "1500"
    document.getElementById("longitudTotal").defaultValue = "5000"
    document.getElementById("tipoProtocolo").value = "1"
    document.getElementById("direccionOrigen").defaultValue = "192.168.20.5"
    document.getElementById("direccionDestino").defaultValue = "192.168.30.7"
}