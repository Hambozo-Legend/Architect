import sqlite3

conn = sqlite3.connect("product.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE if not exists products (
    id INTEGER PRIMARY KEY,
    name TEXT ,
    price INTEGER ,
    quantity INTEGER 
)
""")

def add_product(name, price, quantity):
    cur.execute("INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)", (name, price, quantity))
    conn.commit()


def get_all_products():
    cur.execute("SELECT * FROM products")
    data = cur.fetchall()
    for pro in data:
        print(pro)

def delete_products():
    cur.excute("SELECT FROM ")


#--------------------------------------------------------   
print("Welcome to the product management system!")
while True:
    print("1. Add a product")
    print("2. View all products")
    print("3. Update")
    print("4. Exit")
    choice = int(input("Enter your choice: "))
    
    if choice == 1:
        name = input("Enter product name: ")
        price = int(input("Enter product price: "))
        quantity = int(input("Enter product quantity: "))
        add_product(name, price, quantity)
        print("Product added successfully!")
        
    elif choice == 2:
        get_all_products()
        
    elif choice == 3:
        id = int(input("enter the product id u want to edit"))
        name = input("Enter the new product name: ")
        price = int(input("Enter the new product price : "))
        quantity = int(input("Enter the new product quantity: "))

        update_product(id, name, price, quantity)
        print("product updated")



    elif choice == 4:
         print("Exiting the program. Goodbye!")
         break
        
    else:
        print("Invalid choice. Please try again.")