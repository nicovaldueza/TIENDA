Algoritmo TIENDA
	valorventastotal = 0
	ventamasgrande = 0
	cant_ventas_total = 0
	cant_ventas_altas = 0
	mayor_recaudacion = 0
	promedio_ventas = 0
	
	Repetir
		
		Escribir "MENU TIENDA"
		Escribir "1: REGISTRAR VENTAS"
		Escribir "2: VER ESTADÌSTICAS"
		Escribir "3: SALIR"
		Leer op_entrada
		
		Escribir ""
		
		Segun op_entrada Hacer
			
			1:
				Escribir "INGRESÓ EN REGISTRAR VENTAS"
				Escribir "Cuantos dias desea registrar las ventas?"
				Escribir "Del 1ro al 30 de cada mes"
				Leer cant_registro_dias
				
				Mientras cant_registro_dias < 1 O cant_registro_dias > 30 Hacer
					Escribir "Ingrese un valor válido (1 a 30)"
					Leer cant_registro_dias
				FinMientras
				
				
				Para i = 1 Hasta cant_registro_dias Hacer
					
					recaudacion_dia = 0
					
					Escribir ""
					Escribir "DIA ", i
					Escribir "Cuantas ventas se hicieron este día?"
					Leer cant_ventas
					
					Mientras cant_ventas < 0 Hacer
						Escribir "Ingrese una cantidad válida"
						Leer cant_ventas
					FinMientras
					
					cant_ventas_total = cant_ventas_total + cant_ventas
					
					
					Para j = 1 Hasta cant_ventas Hacer
						
						Escribir ""
						Escribir "VENTA ", j
						
						Escribir "Ingrese nombre del producto"
						Leer nombre_producto
						
						Escribir "Ingrese precio"
						Leer precio_producto
						
						Mientras precio_producto <= 0 Hacer
							Escribir "Ingrese un precio válido"
							Leer precio_producto
						FinMientras
						
						Escribir "Ingrese cantidad vendida"
						Leer cantventas_producto
						
						Mientras cantventas_producto <= 0 Hacer
							Escribir "Ingrese una cantidad válida"
							Leer cantventas_producto
						FinMientras
						
						
						// CALCULAR VENTA
						valorventas = precio_producto * cantventas_producto
						
						// VALOR FINAL
						valorventasfinal = valorventas
						
						// DESCUENTO
						Si valorventas > 50000 Entonces
							Escribir "Compra mayor a $50000"
							Escribir "Se aplica descuento del 10%"
							descuento = 10
							valorventasfinal = valorventas - (valorventas * descuento / 100)
						SiNo
						//RECARGO
							Si valorventas < 5000 Entonces
								Escribir "Compra menor a $5000"
								Escribir "Se aplica recargo del 5%"
								recargo = 5
								valorventasfinal = valorventas + (valorventas * recargo / 100)
							FinSi
							
						FinSi
						
						Escribir "Precio final: $" valorventasfinal
						
						// TOTAL ACUMULADO
						valorventastotal = valorventastotal + valorventasfinal
						
						// RECAUDACION DEL DIA
						recaudacion_dia = recaudacion_dia + valorventasfinal
					
						// VENTA MAS GRANDE
						Si valorventasfinal > ventamasgrande Entonces
							ventamasgrande = valorventasfinal
							producto_ganador = nombre_producto
						FinSi
						
						
						// VENTAS ALTAS
						Si valorventasfinal > 30000 Entonces
							cant_ventas_altas = cant_ventas_altas + 1
						FinSi
						
					FinPara
					
					// MAYOR RECAUDACION
					Si recaudacion_dia > mayor_recaudacion Entonces
						mayor_recaudacion = recaudacion_dia
						mayor_recaudacion_dia = i
					FinSi
					
				FinPara
				
				
				// PROMEDIO
				Si cant_ventas_total > 0 Entonces
					promedio_ventas = valorventastotal / cant_ventas_total
				FinSi
				
				
			2:
				
				Si cant_ventas_total > 0 Entonces
					
					Escribir ""
					Escribir "===== ESTADISTICAS ====="
					
					Escribir "Total acumulado: $" valorventastotal
					
					Escribir ""
					Escribir "Venta más grande: $" ventamasgrande
					Escribir "Producto ganador: " producto_ganador
					
					Escribir ""
					Escribir "Cantidad de ventas altas: " cant_ventas_altas
					
					Escribir ""
					Escribir "Promedio de ventas: $" promedio_ventas
					
					Escribir ""
					Escribir "Día con mayor recaudación: " mayor_recaudacion_dia
					Escribir "Recaudación del día: $" mayor_recaudacion
					
				SiNo
					
					Escribir "No hay ventas cargadas"
					
				FinSi
				
				
			3:
				Escribir "SALIÓ DEL SISTEMA"
				
				
			De Otro Modo:
				Escribir "Opción inválida"
				
		FinSegun
		
	Hasta Que op_entrada = 3
	
FinAlgoritmo