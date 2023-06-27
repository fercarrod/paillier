# paillier
 modulo paillier para ciber

 cuando un cliente se conecta, recibe la llave publica del servidor.
 el cliente puede: 
   1-enviar mensaje por defecto para comprobar conexion 
   2-escribir un msg y encriptarlo usando la llave publica del servidor y enviarlo al server para que este los desencripte con su privada
   3-escribir 2 números, que son pasados a bigint y combinados usando la suma homomorfica y son enviados al servidor junto al resultado de la suma de los bigint. el servidor desencripta y comprueba si es          igual al resultado recibido de la suma de los bigint
   4-escribir 2 números->a bignint, se multiplican con la multiplicacion homomorfica, resutlado enviado al servidor junto al resultado de bigint1*bigint2. servidor desencripta y comprueba
