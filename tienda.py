# VARIABLES
valorventastotal = 0
ventamasgrande = 0
cant_ventas_total = 0
cant_ventas_altas = 0
mayor_recaudacion = 0
promedio_ventas = 0

while True:

    print("MENU TIENDA")
    print("1: REGISTRAR VENTAS")
    print("2: VER ESTADÍSTICAS")
    print("3: SALIR")

    op_entrada = int(input("Ingrese opción: "))

    print()

    match op_entrada:

        case 1:

            print("INGRESÓ EN REGISTRAR VENTAS")
            print("¿Cuántos días desea registrar las ventas?")
            print("Del 1 al 30")

            cant_registro_dias = int(input("Ingrese cantidad de días: "))

            while cant_registro_dias < 1 or cant_registro_dias > 30:
                print("Ingrese un valor válido (1 a 30)")
                cant_registro_dias = int(input("Ingrese cantidad de días: "))

            for i in range(1, cant_registro_dias + 1):

                recaudacion_dia = 0

                print()
                print(f"DÍA {i}")

                cant_ventas = int(input("¿Cuántas ventas se hicieron este día?: "))

                while cant_ventas < 0:
                    print("Ingrese una cantidad válida")
                    cant_ventas = int(input("¿Cuántas ventas se hicieron este día?: "))

                cant_ventas_total += cant_ventas

                for j in range(1, cant_ventas + 1):

                    print()
                    print(f"VENTA {j}")

                    nombre_producto = input("Ingrese nombre del producto: ")

                    precio_producto = float(input("Ingrese precio: "))

                    while precio_producto <= 0:
                        print("Ingrese un precio válido")
                        precio_producto = float(input("Ingrese precio: "))

                    cantventas_producto = int(input("Ingrese cantidad vendida: "))

                    while cantventas_producto <= 0:
                        print("Ingrese una cantidad válida")
                        cantventas_producto = int(input("Ingrese cantidad vendida: "))

                    # CALCULAR VENTA
                    valorventas = precio_producto * cantventas_producto

                    # VALOR FINAL
                    valorventasfinal = valorventas

                    # DESCUENTO
                    if valorventas > 50000:

                        print("Compra mayor a $50000")
                        print("Se aplica descuento del 10%")

                        descuento = 10

                        valorventasfinal = valorventas - (valorventas * descuento / 100)

                    else:

                        # RECARGO
                        if valorventas < 5000:

                            print("Compra menor a $5000")
                            print("Se aplica recargo del 5%")

                            recargo = 5

                            valorventasfinal = valorventas + (valorventas * recargo / 100)

                    print(f"Precio final: ${valorventasfinal}")

                    # TOTAL ACUMULADO
                    valorventastotal += valorventasfinal

                    # RECAUDACION DEL DIA
                    recaudacion_dia += valorventasfinal

                    # VENTA MAS GRANDE
                    if valorventasfinal > ventamasgrande:

                        ventamasgrande = valorventasfinal
                        producto_ganador = nombre_producto

                    # VENTAS ALTAS
                    if valorventasfinal > 30000:

                        cant_ventas_altas += 1

                # MAYOR RECAUDACION
                if recaudacion_dia > mayor_recaudacion:

                    mayor_recaudacion = recaudacion_dia
                    mayor_recaudacion_dia = i

            # PROMEDIO
            if cant_ventas_total > 0:

                promedio_ventas = valorventastotal / cant_ventas_total

        case 2:

            if cant_ventas_total > 0:

                print()
                print("===== ESTADÍSTICAS =====")

                print(f"Total acumulado: ${valorventastotal}")

                print()
                print(f"Venta más grande: ${ventamasgrande}")
                print(f"Producto ganador: {producto_ganador}")

                print()
                print(f"Cantidad de ventas altas: {cant_ventas_altas}")

                print()
                print(f"Promedio de ventas: ${round(promedio_ventas, 2)}")

                print()
                print(f"Día con mayor recaudación: {mayor_recaudacion_dia}")
                print(f"Recaudación del día: ${mayor_recaudacion}")

            else:

                print("No hay ventas cargadas")

        case 3:

            print("SALIÓ DEL SISTEMA")
            break

        case _:

            print("Opción inválida")