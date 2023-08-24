print("Python Calculator")
print("-----------------")

def calculater():
	num_1 = int(input("Enter your first number : "))
	num_2 = int(input("Enter your second number : "))

	opretion = input(''' Please type in the math operation you would like to complate :
			+ for addition
			- for substraction
			* for multiplication
			/ for division
			** for power
			% for modulo
			: ''')
	if opretion == '+':
		print('{} + {} = '.format(num_1,num_2))
		print(num_1+num_2)
	elif opretion == '-':
		print('{} - {} = '.format(num_1,num_2))
		print(num_1 - num_2)
	elif opretion == '*':
		print('{} * {} = '.format(num_1,num_2))
		print(num_1 * num_2)
	elif opretion == '/':
		print('{} + {} = '.format(num_1,num_2))
		print(num_1 / num_2)
	elif opretion == '**':
		print('{} ^ {}'.format(num_1,num_2))
		print(num_1 ** num_2)
	elif opretion == '%':
		print('{} % {} = '.format(num_1,num_2))
		print(num_1 % num_2)
	else:
		print("Please Enter valid opretion!")

calculater()

def again():
	responce = input(''' Do you want to calculate again ? 
		  if yes then Type 'Y' or no then Type 'N' :
		''')
	if responce.upper() == 'Y':
		calculater()
		again()
	elif responce.upper() == 'N':
		print("see you again :).")
	else:
		again()
again()
