import sqlite3

conn = sqlite3.connect("product.db")
cur = conn.cursor()

cur.execute("""
CREATE TABLE if not exists products (
    id INTEGER PRIMARY KEY,
    name TEXT,
    price INTEGER,
    quantity INTEGER 
)
""")

def add_product(name, price, quantity):
    cur.execute("INSERT INTO products (name, price, quantity) VALUES (?, ?, ?)", (name, price, quantity))
    conn.commit()

def get_all_products():
    cur.execute("SELECT * FROM products")
    data = cur.fetchall()
    if not data:
        print("No products found.")
    for pro in data:
        print(pro)

def update_product(product_id, name, price, quantity):
    cur.execute("""
        UPDATE products 
        SET name = ?, price = ?, quantity = ? 
        WHERE id = ?
    """, (name, price, quantity, product_id))
    conn.commit()

def delete_product(product_id):
    cur.execute("DELETE FROM products WHERE id = ?", (product_id,))
    conn.commit()



print("Welcome to the product management system!")

while True:
    print("Menu")
    print("1. Add a product")
    print("2. View all products")
    print("3. Update a product")
    print("4. Delete a product")
    print("5. Exit")
    
    choice = int(input("Enter your choice: "))
    
    if choice == 1:
        name = input("Enter product name: ")
        price = int(input("Enter product price: "))
        quantity = int(input("Enter product quantity: "))
        add_product(name, price, quantity)
        print("Product added successfully!")
        
    elif choice == 2:
        print(" Current Products ")
        get_all_products()
        
    elif choice == 3:
        product_id = int(input("Enter the product ID you want to edit: "))
        name = input("Enter the new product name: ")
        price = int(input("Enter the new product price: "))
        quantity = int(input("Enter the new product quantity: "))
        
        update_product(product_id, name, price, quantity)
        print("Product updated successfully!")

    elif choice == 4:
        product_id = int(input("Enter the product ID you want to delete: "))
        delete_product(product_id)
        print("Product deleted successfully!")

    elif choice == 5:
         print("Exiting the program. Goodbye!")
         break
        
    else:
        print("Invalid choice. Please try again.")
